import bcrypt from 'bcrypt';

import app from '../app';

import client from '../db/connectDB';

import justAuthenticate from '../middlewares/verifyToken';

const jwt = require('jsonwebtoken');


//Routes Middlewares
app.post('/lol', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            res.sendStatus(403);
        }
        else
        {
            res.status(201).send({ 'message': 'YAY! Congratulations! Your first endpoint is working', authData });
        }
    });
});


app.get('/users', async (req, res) =>
{
    const rows = await readUsers();
    res.status(200).send(JSON.stringify(rows));
});

async function readUsers()
{
    try
    {
        const result = await client.query('Select * from users');
        return result.rows;
    }
    catch (e)
    {
        return [];
    }
}


//For Login in
app.post('/auth/signin', (req, result) =>
{
    const data = {
        email: req.body.email,
        password: req.body.password
    };

    client.query(`SELECT password FROM users WHERE email ='${req.body.email}' LIMIT 1`, (err, res) =>
    {
        if (res.rows[0])
        {
            const userPasswrd = res.rows[0].password;

            bcrypt.compare(data.password, userPasswrd).then((valid) =>
            {
                if (!valid)
                {
                    console.log('Incorrect password!');
                    result.status(401).send('Incorrect password!');
                }

                if (valid)
                {
                    jwt.sign({ data }, 'myscreteisreal', { expiresIn: '2h' }, (derr, token) =>
                    {
                        result.json({
                            token
                        });
                    });
                }
            });
        }

        if (err)
        {
            result.status(500).send('We Encountered An Internal Error, Try Again...');
        } 

        if (!res.rows[0])
        {
            console.log('Email Does not Exists');
            result.status(404).send('Email Does not Exists');
        }
    });
});


//For creating Account
app.post('/auth/create-user', function (req, response)
{
    // Grab data from http request
    const data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        jobRole: req.body.jobRole,
        department: req.body.department,
        address: req.body.address,
        isAdmin: req.body.isAdmin,
        verifyAdmin: req.body.verifyAdmin
    };

    client.query(`SELECT * FROM users WHERE isAdmin ='1' AND email ='${req.body.verifyAdmin}'`, (err, res) => 
    {
        if (!res.rows[0])
        {
            response.status(500).send("You're Not Authorized To Create New Users, Just Admins Are Allowed...");
        }

        if (err)
        {
            console.log('We Encountered An Internal Error, Try Again...');
            response.status(500).send('We Encountered An Internal Error, Try Again...');
        }

        if (res.rows[0])
        {
            client.query(`SELECT email FROM users WHERE email ='${req.body.email}'`, (derr, myres) => 
            {
                if (derr)
                {
                    console.log('We Encountered An Issue Proccessing This');
                    response.status(500).send('We Encountered An Issue Proccessing This');
                }

                if (myres.rows[0])
                {
                    console.log(req.body.email, "Already Exist");
                    response.send(`${req.body.email} Already Exist`);
                }

                if (!myres.rows[0])
                {
                    bcrypt.hash(req.body.password, 10, function (error, hash)
                    {
                        if (error)
                        {
                            console.log('We Encountered an issue processing your Account');
                            response.status(500).send('We Encountered an issue processing your Account');
                        }
                        
                        const realvalues = [data.firstname, data.lastname, data.email, hash, data.gender, data.jobRole, data.department, data.address, data.isAdmin];

                        client.query('INSERT INTO users (firstname, lastname, email, password, gender, jobRole, department, address, isAdmin) values($1, $2, $3, $4, $5, $6, $7, $8, $9)', realvalues, (uerr, result) =>
                        {
                            if (uerr)
                            {
                                console.log('We Encountered an issue creating your Account');
                                response.status(500).send('We Encountered an issue creating your Account');
                            }
                            if (result)
                            {
                            response.status(201).send(`${data.firstname}'s Account Created`);
                            console.log(`${data.firstname}'s Account Created`);
                            }
                        });
                    });
                }
            });
        }
    });
});

const routeApp = app;

module.exports = routeApp;
