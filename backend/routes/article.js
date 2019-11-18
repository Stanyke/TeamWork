import date from 'date-and-time';

import app from '../app';

import client from '../db/connectDB';

import justAuthenticate from '../middlewares/verifyToken';


const jwt = require('jsonwebtoken');

app.post('/articles', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To Post Articles, As You're Not Logged In..." });
        }
        else
        {
            const currentUserEmail = authData.data.email;

            client.query(`SELECT * FROM users WHERE email ='${currentUserEmail}' LIMIT 1`, (getErr, getRes) =>
            {
                if (getErr)
                {
                    console.log('We Encountered An Issue Proccessing Your Data');
                    res.status(500).send('We Encountered An Issue Proccessing You Data');
                }

                if (getRes.rows[0])
                {
                    const currentUsersFirstname = getRes.rows[0].firstname;

                    const currentUsersLastname = getRes.rows[0].lastname;

                    const currentUsersId = getRes.rows[0].user_id;

                    const postedBy = `${currentUsersFirstname} ${currentUsersLastname}`;

                    const now = new Date();
                    
                    const nownownow = date.format(now, 'ddd. hh:mm A, MMM. DD YYYY', true);

                    const realvalues = [req.body.title, req.body.article, postedBy, currentUserEmail, currentUsersId, nownownow, nownownow];

                    client.query('INSERT INTO articles (title, content, postedBy, email, userId, createdOn, updatedAt) values($1, $2, $3, $4, $5, $6, $7)', realvalues, (uerr, result) =>
                    {
                        if (uerr)
                        {
                            console.log('Article failed inserting to database, Try again...');
                            res.status(201).send('Article failed inserting to database, Try again...');
                        }

                        if (result)
                        {
                            client.query(`SELECT * FROM articles WHERE createdOn ='${nownownow}' LIMIT 1`, (SelErr, SelRes) =>
                            {
                                if (SelErr)
                                {
                                    console.log('Could not process user encryption but article uploaded');
                                    res.status(201).send('Could not process user encryption but article uploaded');
                                }

                                if (SelRes)
                                {
                                    console.log('Article uploaded successfully');
                                    res.status(201).json({
                                        "status": "success",
                                        "data": {
                                        "message": "Article successfully posted",
                                        "articleId": SelRes.rows[0].article_id,
                                        "createdOn": nownownow,
                                        "title": req.body.title
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});


app.get('/articles/:id', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To Edit Articles, As You're Not Logged In..." });
        }
        else
        {
            const currentUserEmail = authData.data.email;

            const articleId = req.params.id;

            if (!articleId)
            {
                return res.status(400).send({ error: true, message: 'Please provide an article ID' });
            }
            
            client.query(`SELECT * FROM articles WHERE article_id ='${articleId}' LIMIT 1`, (getErr, getRes) =>
            {
                if (getErr)
                {
                    console.log('We Encountered An Issue Proccessing Your Data');
                    res.status(500).send('We Encountered An Issue Proccessing You Data');
                }

                if (getRes.rows[0])
                {
                    if (getRes.rows[0].email === currentUserEmail)
                    {
                        res.status(200).send(getRes.rows[0]);
                        console.log(getRes.rows[0]);
                    }
                    else
                    {
                        console.log(`Sorry You're Not Authorized To Edit This Post`);
                        res.status(403).send(`Sorry You're Not Authorized To Edit This Post`);
                    }
                }

                if (!getRes.rows[0])
                {
                    console.log(`Post With Such ID Does Not Exists`);
                    res.status(400).send(`Post With Such ID Does Not Exists`);
                }
            });
        }
    });
});


app.put('/articles/:id', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To Edit Articles, As You're Not Logged In..." });
        }
        else
        {
            const currentUserEmail = authData.data.email;

            const articleId = req.params.id;

            if (!articleId)
            {
                return res.status(400).send({ error: true, message: 'Please provide an article ID' });
            }
            
            client.query(`SELECT * FROM articles WHERE article_id ='${articleId}' LIMIT 1`, (getErr, getRes) =>
            {
                if (getErr)
                {
                    console.log('We Encountered An Issue Proccessing Your Data');
                    res.status(500).send('We Encountered An Issue Proccessing You Data');
                }

                if (getRes.rows[0])
                {
                    if (getRes.rows[0].email === currentUserEmail)
                    {
                        const now = new Date();
                    
                        const nownownow = date.format(now, 'ddd. hh:mm A, MMM. DD YYYY', true);

                        client.query(`UPDATE articles SET title ='${req.body.title}', content ='${req.body.article}', updatedAt ='${nownownow}' WHERE article_id ='${articleId}'`, (UpErr, UpRes) =>
                        {
                            if (UpErr)
                            {
                                console.log('We Encountered An Issue Updating This Article');
                                res.status(500).send('We Encountered An Issue Updating This Article');
                            }

                            if (UpRes)
                            {
                                client.query(`SELECT * FROM articles WHERE article_id ='${articleId}' LIMIT 1`, (SelUpErr, SelUpRes) =>
                                {
                                    if (SelUpErr)
                                    {
                                        console.log('We Encountered An Issue Previewing Update Article which was updated successfully');
                                        res.status(500).send('We Encountered An Issue Previewing Update Article which was updated successfully');
                                    }

                                    if (SelUpRes)
                                    {
                                        res.status(200).send(getRes.rows[0]);
                                        console.log('Article Updated Successfully');
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        console.log(`Sorry You're Not Authorized To Edit This Post`);
                        res.status(403).send(`Sorry You're Not Authorized To Edit This Post`);
                    }
                }

                if (!getRes.rows[0])
                {
                    console.log(`Post With Such ID Does Not Exists`);
                    res.status(400).send(`Post With Such ID Does Not Exists`);
                }
            });
        }
    });
});


const articleRoute = app;

module.exports = articleRoute;