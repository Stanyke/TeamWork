import client from './connectDB';

const runArticleCommentTable = client.query("CREATE TABLE IF NOT EXISTS articlesComments ( comment_id SERIAL PRIMARY KEY, articleId VARCHAR (500) NOT NULL, message TEXT NOT NULL, commenterName TEXT NOT NULL, commenterEmail VARCHAR (250) NOT NULL, commenterId VARCHAR (500) NOT NULL, createdOn VARCHAR (100) NOT NULL)", (err, res) =>
{
    console.log(err, res);
});

module.exports = runArticleCommentTable;