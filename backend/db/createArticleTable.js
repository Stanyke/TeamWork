import client from './connectDB';

const runArticleTable = client.query("CREATE TABLE IF NOT EXISTS articles ( article_id SERIAL PRIMARY KEY, title VARCHAR (500) NOT NULL, content TEXT NOT NULL, postedBy TEXT NOT NULL, email VARCHAR (250) NOT NULL, userId VARCHAR (50) NOT NULL, createdOn VARCHAR (100) NOT NULL, updatedAt VARCHAR (100) NOT NULL)", (err, res) =>
{
    console.log(err, res);
});

module.exports = runArticleTable;