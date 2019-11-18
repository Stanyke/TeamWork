import app from '../app';

import client from '../db/connectDB';

import justAuthenticate from '../middlewares/verifyToken';


const jwt = require('jsonwebtoken');

app.get('/feeds', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To Fetch Post Feeds, As You're Not Logged In With Correct Token..." });
        }
        else
        {
            client.query(`SELECT * FROM gifs ORDER BY gif_id DESC`, (getErr, getRes) =>
            {
                if (getErr)
                {
                    console.log('We Encountered An Issue Getting Gif Posts');
                    res.status(500).send('We Encountered An Issue Getting Gif Posts');
                }

                if (getRes)
                {
                    client.query(`SELECT * FROM articles ORDER BY article_id DESC`, (ArtErr, ArtRes) =>
                    {
                        if (ArtErr)
                        {
                            console.log('We Encountered An Issue Getting Articles');
                            res.status(500).send('We Encountered An Issue Getting Articles');
                        }

                        if (ArtRes)
                        {
                            res.status(200).json({
                                "status": "success",
                                "data": [{
                                    "Gifs": getRes.rows,
                                    "Articles": ArtRes.rows
                                }]
                            });
                        }
                    });
                }
            });
        }
    });
});

const feedRoute = app;

module.exports = feedRoute;