const app = require('./app');

const routeApp = require('./routes/user');

const gifRoute = require('./routes/gif');

const articleRoute = require('./routes/article');

const feedRoute = require('./routes/feed');

const client = require('./db/connectDB');

const port = process.env.PORT || 3000;

app.listen(port, () =>
{
    console.log(`Server Running On port ${port}`);
});