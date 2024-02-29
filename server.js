require('dotenv').config();
require('express-async-errors');
const http = require('http');
const app = require('./app');
const mongoDB = require('./helpers/mongo');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

async function startServer() {
    try {
        await mongoDB.mongoConnect();
        server.listen(PORT, () => {
            console.log(`Listening on PORT 3000, Welcome To Graduation Project`);
        });
    } catch (err) {
        console.log(err);
    }
}

startServer();