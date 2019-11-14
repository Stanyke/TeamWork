import app from '../app';

import client from '../db/connectDB';

//Routes Middlewares
app.get('/', (req, res) =>
{
    // res.send('Hello user, more coming...');
    res.status(200).send({ 'message': 'YAY! Congratulations! Your first endpoint is working' });
});


app.get('/auth/create-user', (req, res) =>
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

//For inserting to db
app.post('/auth/create-user', async (req, res) =>
{
    try
    {
        const createUser = await client.query('INSERT INTO users (firstname, lastname, email, password, gender, jobrole, department, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [req.query.firstname, req.query.lastname, req.query.email, req.query.password, req.query.gender, req.query.jobrole, req.query.department, req.query.address]);

       if (createUser)
        {
            res.json({
                result: 'ok cool'
            });
            console.log('Name:', res.rows[0]);
            console.log(res.rows[1]);
            return res.redirect('/users');
        }
        
            res.json({
                result: 'failed',
                data: {},
                message: `New user registeration failed`
            });
   }
   catch (error)
    {
        error;
    }
});


const routeApp = app;

module.exports = routeApp;