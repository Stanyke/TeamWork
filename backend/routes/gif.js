const path = require('path');

const date = require('date-and-time');

const jwt = require('jsonwebtoken');

const app = require('../app');

const client = require('../db/connectDB');

const cloudinary = require('../db/cloudinary');

const justAuthenticate = require('../middlewares/verifyToken');


app.post('/api/v1/gifs', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To Post Gif Files, As You're Not Logged In With Correct Token..." });
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

                    const filePathChecker = path.extname(req.body.image);

                    if (filePathChecker === '.gif')
                    {
                        cloudinary.uploader.upload(req.body.image, { tags: 'Teamwork Gif Post' }, (cloudErr, Cloudimage) =>
                        {
                            if (cloudErr)
                            {
                                console.log('We Encountered An Issue Proccessing This, Probably File Does Not Exist');
                                res.status(500).send('We Encountered An Issue Proccessing This, Probably File Does Not Exist');
                            }

                            if (Cloudimage)
                            {
                                const realvalues = [req.body.title, Cloudimage.public_id, Cloudimage.url, req.body.image, postedBy, currentUserEmail, currentUsersId, nownownow];

                                client.query('INSERT INTO gifs (title, imageName, imageUrl, imageType, postedBy, email, userId, createdOn) values($1, $2, $3, $4, $5, $6, $7, $8)', realvalues, (uerr, result) =>
                                {
                                    if (uerr)
                                    {
                                        console.log('Image Posted but failed inserting to database');
                                        res.status(201).send('Image Posted but failed insertingto database');
                                    }

                                    if (result)
                                    {
                                        client.query(`SELECT * FROM gifs WHERE imageName ='${Cloudimage.public_id}' LIMIT 1`, (SelErr, SelRes) =>
                                        {
                                            if (SelErr)
                                            {
                                                console.log('Could not process image selection but image uploaded');
                                                res.status(201).send('Could not process image selection but image uploaded');
                                            }

                                            if (SelRes)
                                            {
                                                const imageId = SelRes.rows[0].gif_id;

                                                const imageCreatedAt = SelRes.rows[0].createdOn;

                                                console.log('Successfully Uploaded Post');
                                                res.status(201).json({
                                                    "status": "success",
                                                    "data": {
                                                    "gifId": imageId,
                                                    "message": "GIF image successfully posted",
                                                    "createdOn": imageCreatedAt,
                                                    "title": req.body.title,
                                                    "imageUrl": Cloudimage.url
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        console.log('File Selected Is Not A Gif File');
                        res.status(403).send('File Selected Is Not A Gif File');
                    }
                }
            });
        }
    });
});


app.get('/api/v1/gifs/:id', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To View Articles, As You're Not Logged In With Correct Token..." });
        }
        else
        {
            const gifId = req.params.id;

            if (!gifId)
            {
                return res.status(400).send({ error: true, message: 'Please provide a gif ID' });
            }
            
            client.query(`SELECT * FROM gifs WHERE gif_id ='${gifId}' LIMIT 1`, (getErr, getRes) =>
            {
                if (getErr)
                {
                    console.log('We Encountered An Issue Proccessing Your Data');
                    res.status(500).send('We Encountered An Issue Proccessing Your Data');
                }

                if (getRes.rows[0])
                {
                    client.query(`SELECT * FROM gifsComments WHERE gifId ='${gifId}'`, (ComErr, ComRes) =>
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
                                    "id": gifId,
                                    "createdOn": getRes.rows[0].createdon,
                                    "title": getRes.rows[0].title,
                                    "url": getRes.rows[0].imageurl,
                                    "Posted By": getRes.rows[0].postedby,
                                    "comments": ComRes.rows
                                }
                            });
                        }
                    });
                }

                if (!getRes.rows[0])
                {
                    console.log(`Gif With Such ID Does Not Exists`);
                    res.status(400).send(`Gif With Such ID Does Not Exists`);
                }
            });
        }
    });
});


app.delete('/api/v1/gifs/:id', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To Delete Gif Photo, As You're Not Logged In With Correct Token..." });
        }
        else
        {
            const currentUserEmail = authData.data.email;

            const gifId = req.params.id;

            if (!gifId)
            {
                return res.status(400).send({ error: true, message: 'Please provide a gif post ID' });
            }
            
            client.query(`SELECT * FROM gifs WHERE gif_id ='${gifId}'`, (getErr, getRes) =>
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
                        const imageTitleToBeDeleted = getRes.rows[0].imagename;

                        cloudinary.uploader.destroy(imageTitleToBeDeleted, (CloudDelErr, CloudDelRes) =>
                        {
                            if (CloudDelErr)
                            {
                                console.log(imageTitleToBeDeleted);
                                res.status(500).send('We Encountered An Issue Deleting This Gif Post');
                            }

                            if (CloudDelRes)
                            {
                                const now = new Date();
                        
                                const nownownow = date.format(now, 'ddd. hh:mm A, MMM. DD YYYY', true);

                                client.query(`DELETE FROM gifs WHERE gif_id ='${gifId}'`, (DelErr, DelRes) =>
                                {
                                    if (DelErr)
                                    {
                                        console.log('We Encountered An Issue Deleting This Article but this Photo Is No longer Available');
                                        res.status(500).send('We Encountered An Issue Deleting This Article but this Photo Is No longer Available');
                                    }

                                    if (DelRes)
                                    {
                                        res.status(200).json({
                                            "status": "success",
                                            "data": {
                                                "message": "gif post successfully deleted",
                                                "time": nownownow
                                            }
                                        });
                                        console.log('gif post successfully deleted');
                                    }
                                });
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


app.post('/api/v1/gifs/:id/comment', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To Comment On This Gif Photo, As You're Not Logged In With Correct Token..." });
        }
        else
        {
            const currentUserEmail = authData.data.email;

            const gifId = req.params.id;

            if (!gifId)
            {
                return res.status(400).send({ error: true, message: 'Please provide a gif post ID' });
            }
            
            client.query(`SELECT * FROM gifs WHERE gif_id ='${gifId}'`, (getErr, getRes) =>
            {
                if (getErr)
                {
                    console.log('We Encountered An Issue Proccessing Your Data');
                    res.status(500).send('We Encountered An Issue Proccessing Your Data');
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
                            const gifTitle = getRes.rows[0].title;

                            const currentUsersLastname = SelRes.rows[0].lastname;
                            const currentUsersFirstname = SelRes.rows[0].firstname;

                            const postedBy = `${currentUsersFirstname} ${currentUsersLastname}`;

                            const realvalues = [gifId, commentMessage, postedBy, currentUserEmail, commentersId, nownownow];

                            client.query('INSERT INTO gifsComments (gifId, message, commenterName, commenterEmail, commenterId, createdOn) values($1, $2, $3, $4, $5, $6)', realvalues, (Inerr, Inresult) =>
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
                                        "gifTitle": gifTitle,
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


const gifRoute = app;

module.exports = gifRoute;