import "@babel/polyfill";

import app from './app';

import routeApp from './routes/user';

import client from './db/connectDB';

const port = process.env.PORT || 3000;

app.listen(port, () =>
{
    console.log(`Server Running On port ${port}`);
});