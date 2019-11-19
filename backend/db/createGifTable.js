import client from './connectDB';

const runGifTable = client.query("CREATE TABLE IF NOT EXISTS gifs ( gif_id SERIAL PRIMARY KEY, title VARCHAR (500) NOT NULL, imageName VARCHAR (500) NOT NULL, imageUrl VARCHAR (500) NOT NULL, imageType VARCHAR (50) NOT NULL, postedBy TEXT NOT NULL, email VARCHAR (250) NOT NULL, userId VARCHAR (50) NOT NULL, createdOn VARCHAR (100) NOT NULL)", (err, res) =>
{
    console.log(err, res);
});

module.exports = runGifTable;