const client = require('./connectDB');

const runGifCommentTable = client.query("CREATE TABLE IF NOT EXISTS gifsComments ( comment_id SERIAL PRIMARY KEY, gifId VARCHAR (500) NOT NULL, message TEXT NOT NULL, commenterName TEXT NOT NULL, commenterEmail VARCHAR (250) NOT NULL, commenterId VARCHAR (500) NOT NULL, createdOn VARCHAR (100) NOT NULL)", (err, res) =>
{
    console.log(err, res);
});

module.exports = runGifCommentTable;