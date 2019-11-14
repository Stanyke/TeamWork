const { Client } = require('pg');

const client = new Client({
    "user": "pauacrdw",
    "password": "ZJL5zi9ewI-4ymUQtD9NmXtHisgjRvHF",
    "host": "salt.db.elephantsql.com",
    "port": 5432,
    "database": "pauacrdw"
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