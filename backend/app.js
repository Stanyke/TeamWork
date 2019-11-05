import express from 'express';

import bodyParser from 'body-parser';


const app = express();


//Routes Middlewares
app.get('/', (req, res) =>
{
    // res.send('Hello user, more coming...');
    res.status(200).send({ 'message': 'YAY! Congratulations! Your first endpoint is working' });
});

app.use((req, res, next) =>
{
	res.setHeader('Access-Control-Allow-Origin', '*');
	
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: 'true' }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

module.exports = app;