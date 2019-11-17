import date from 'date-and-time';

import app from '../app';

import client from '../db/connectDB';

import cloudinary from '../db/cloudinary';

import justAuthenticate from '../middlewares/verifyToken';


const jwt = require('jsonwebtoken');

app.post('/gifs', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To Create Post, As You're Not Logged In..." });
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

                    cloudinary.uploader.upload(req.body.title, { tags: 'Teamwork Gif Post' }, (cloudErr, Cloudimage) =>
                    {
                        if (cloudErr)
                        {
                            console.log('We Encountered An Issue Proccessing This');
                            res.status(500).send('We Encountered An Issue Proccessing This');
                        }

                        if (Cloudimage)
                        {
                            const realvalues = [Cloudimage.public_id, Cloudimage.url, req.body.image, postedBy, currentUserEmail, currentUsersId, nownownow];

                            client.query('INSERT INTO gifs (title, imageUrl, imageType, postedBy, email, userId, createdOn) values($1, $2, $3, $4, $5, $6, $7)', realvalues, (uerr, result) =>
                            {
                                if (uerr)
                                {
                                    console.log('Image Posted but failed insertingto database');
                                    res.status(201).send('Image Posted but failed insertingto database');
                                }

                                if (result)
                                {
                                    client.query(`SELECT * FROM gifs WHERE title ='${Cloudimage.public_id}' LIMIT 1`, (SelErr, SelRes) =>
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
                                                "title": Cloudimage.public_id,
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
            });
        }
    });
});

const gifRoute = app;

module.exports = gifRoute;