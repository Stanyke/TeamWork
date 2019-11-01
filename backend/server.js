import express from "express"

const app = express();

const port = process.env.PORT || 3000;


app.get('/', (req, res) =>
{
    res.send("Hello user, more coming...");
})

app.listen(port, () =>
{
    console.log(`Server Running On port ${port}`)
});