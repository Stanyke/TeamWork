const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const publicR = __dirname + '/public';

app.use(express.static(publicR));
app.use("/css", express.static(__dirname + '/css'));
app.use("/font", express.static(__dirname + '/font'));
app.use("/img", express.static(__dirname + '/img'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/video", express.static(__dirname + '/video'));

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