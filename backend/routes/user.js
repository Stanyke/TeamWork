import app from '../app';

import client from '../db/connectDB';

//Routes Middlewares
app.get('/', (req, res) =>
{
    // res.send('Hello user, more coming...');
    res.status(200).send({ 'message': 'YAY! Congratulations! Your first endpoint is working' });
});


app.get('/auth/creat-user', (req, res) =>
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

const routeApp = app;

module.exports = routeApp;