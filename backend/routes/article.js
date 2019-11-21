const date = require('date-and-time');

const jwt = require('jsonwebtoken');

const app = require('../app');

const client = require('../db/connectDB');

const justAuthenticate = require('../middlewares/verifyToken');


app.post('/api/v1/articles', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To Post Articles, As You're Not Logged In With Correct Token..." });
        }
        else
        {
            const currentUserEmail = authData.data.email;

            client.query(`SELECT * FROM users WHERE email ='${currentUserEmail}' LIMIT 1`, (getErr, getRes) =>
            {
                if (getErr)
                {
                    console.log('We Encountered An Issue Proccessing Your Data');
                    res.status(500).send('We Encountered An Issue Proccessing Your Data');
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


app.get('/api/v1/articles/:id', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To View Articles, As You're Not Logged In With Correct Token..." });
        }
        else
        {
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
                    res.status(500).send('We Encountered An Issue Proccessing Your Data');
                }

                if (getRes.rows[0])
                {
                    client.query(`SELECT * FROM articlesComments WHERE articleId ='${articleId}'`, (ComErr, ComRes) =>
                    {
                        if (ComErr)
                        {
                            console.log('We Encountered An Issue Fetching Comment(s)');
                            res.status(500).send('We Encountered An Issue Fetching Comment(s)');
                        }

                        if (ComRes)
                        {
                            res.status(200).json({
                                "status": "success",
                                "data":
                                {
                                    "id": articleId,
                                    "createdOn": getRes.rows[0].updatedat,
                                    "title": getRes.rows[0].title,
                                    "article": getRes.rows[0].content,
                                    "Posted By": getRes.rows[0].postedby,
                                    "Created On": getRes.rows[0].createdon,
                                    "Updated On": getRes.rows[0].updatedat,
                                    "comments": ComRes.rows
                                }
                            });
                        }
                    });
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


app.patch('/api/v1/articles/:id', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To Edit Articles, As You're Not Logged In With Correct Token..." });
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
                    res.status(500).send('We Encountered An Issue Proccessing Your Data');
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
                                        res.status(200).json({
                                            "status": "success",
                                            "data": {
                                            "message": "Article successfully updated",
                                            "title": SelUpRes.rows[0].title,
                                            "article": SelUpRes.rows[0].content,
                                            "CreatedOn": SelUpRes.rows[0].createdon,
                                            "UpdatedAt": SelUpRes.rows[0].updatedat
                                            }
                                        });
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


app.delete('/api/v1/articles/:id', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To Delete Articles, As You're Not Logged In With Correct Token..." });
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
                    res.status(500).send('We Encountered An Issue Proccessing Your Data');
                }

                if (getRes.rows[0])
                {
                    if (getRes.rows[0].email === currentUserEmail)
                    {
                        client.query(`DELETE FROM articles WHERE article_id ='${articleId}'`, (DelErr, DelRes) =>
                        {
                            if (DelErr)
                            {
                                console.log('We Encountered An Issue Deleting This Article');
                                res.status(500).send('We Encountered An Issue Deleting This Article');
                            }

                            if (DelRes)
                            {
                                const now = new Date();
                    
                                const nownownow = date.format(now, 'ddd. hh:mm A, MMM. DD YYYY', true);

                                res.status(200).json({
                                    "status": "success",
                                    "data": {
                                    "message": "Article successfully deleted",
                                    "time": nownownow
                                    }
                                });
                                console.log('Article successfully deleted');
                            }
                        });
                    }
                    else
                    {
                        console.log(`Sorry You're Not Authorized To Delete This Post`);
                        res.status(403).send(`Sorry You're Not Authorized To Delete This Post`);
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


app.post('/api/v1/articles/:id/comment', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To Comment On This Article, As You're Not Logged In With Correct Token..." });
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
                    console.log('We Encountered An Issue Proccessing This Article, Try Again...');
                    res.status(500).send('We Encountered An Issue Proccessing This Article, Try Again...');
                }

                if (getRes.rows[0])
                {
                    client.query(`SELECT * FROM users WHERE email ='${currentUserEmail}' LIMIT 1`, (SelErr, SelRes) =>
                    {
                        if (SelErr)
                        {
                            console.log('We Encountered An Issue Getting Your Data');
                            res.status(500).send('We Encountered An Issue Getting Your Data');
                        }

                        if (SelRes)
                        {
                            const commentersId = `${SelRes.rows[0].user_id}`;
                            const commentMessage = req.body.comment;
                            const now = new Date();
                            const nownownow = date.format(now, 'ddd. hh:mm A, MMM. DD YYYY', true);
                            const articleTitle = getRes.rows[0].title;
                            const articleContent = getRes.rows[0].content;

                            const currentUsersLastname = SelRes.rows[0].lastname;
                            const currentUsersFirstname = SelRes.rows[0].firstname;

                            const postedBy = `${currentUsersFirstname} ${currentUsersLastname}`;

                            const realvalues = [articleId, commentMessage, postedBy, currentUserEmail, commentersId, nownownow];

                            client.query('INSERT INTO articlesComments (articleId, message, commenterName, commenterEmail, commenterId, createdOn) values($1, $2, $3, $4, $5, $6)', realvalues, (Inerr, Inresult) =>
                            {
                                if (Inerr)
                                {
                                    console.log(Inerr);
                                    res.status(500).send('We Encountered An Issue Posting Your Comment,Try Again...');
                                }

                                if (Inresult)
                                {
                                    res.status(201).json({
                                        "status": "success",
                                        "data": {
                                        "message": "Comment successfully created",
                                        "createdOn": nownownow,
                                        "articleTitle": articleTitle,
                                        "article": articleContent,
                                        "comment": commentMessage,
                                        "PostedBy": postedBy
                                        }
                                    });
                                    console.log("Comment successfully created");
                                }
                            });
                        }
                    });
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