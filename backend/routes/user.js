import app from '../app';

import client from '../db/connectDB';

//Routes Middlewares
app.get('/', (req, res) =>
{
    // res.send('Hello user, more coming...');
    res.status(200).send({ 'message': 'YAY! Congratulations! Your first endpoint is working' });
});


app.get('/auth/create-user', (req, res) =>
{
    // res.send('Hello user, more coming...');
    res.status(200).send({ 'message': 'YAY! Congratulations! Your first endpoint is working' });
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

//For inserting to db
app.post('/auth/create-user', function(req, response, next)
{
    // Grab data from http request
    const data =
    {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        jobRole: req.body.jobRole,
        department: req.body.department,
        address: req.body.address
    };

    const values =
    [
        data.firstname,
        data.lastname,
        data.email,
        data.password,
        data.gender,
        data.jobRole,
        data.department,
        data.address
    ];

    client.query("SELECT email FROM users WHERE email ='"+data.email+"'", (err, res) =>
    {
        if (res)
        {
            console.log(data.email, "Already Exist");
            response.send({ 'Email': data.email+' Already Exists' });
        }
        
        else
        {
            client.query('INSERT INTO users (firstname, lastname, email, password, gender, jobRole, department, address) values($1, $2, $3, $4, $5, $6, $7, $8)', values, (err, res) =>
            {
                if (err)
                {
                    console.log(err);
                    response.send('Oops we encountered a server error, Try Again...');
                }
                
                if (!err)
                {
                    response.send('User Created');
                    console.log(data.firstname, "User Created" );
                }
            })
        }

    });
    
});




const routeApp = app;

module.exports = routeApp;
