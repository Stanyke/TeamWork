import client from './connectDB';

const runUserTable = client.query("CREATE TABLE IF NOT EXISTS users ( user_id SERIAL PRIMARY KEY, firstname VARCHAR (50) NOT NULL, lastname VARCHAR (50) NOT NULL, email VARCHAR (50) UNIQUE NOT NULL, password VARCHAR (250) NOT NULL, gender VARCHAR (50) NOT NULL, jobRole VARCHAR (50) NOT NULL, department VARCHAR (50) NOT NULL, address VARCHAR (50) NOT NULL , isAdmin  VARCHAR (2) DEFAULT '0')", (err, res) =>
{
    console.log(err, res);
});

module.exports = runUserTable;