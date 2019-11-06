const { Client } = require('pg');

const client = new Client({
    "user": "postgres",
    "password": "Stanley&50",
    "host": "localhost",
    "port": 4000,
    "database": "teamwork"
});

client.connect().then(() =>
{
    console.log("Server, You Have Successfully connected to PostgreSql");
})
.catch((error) =>
{
    console.log("Server, Unable to connect to PostgreSql");
	console.error(error);
});

module.exports = client;