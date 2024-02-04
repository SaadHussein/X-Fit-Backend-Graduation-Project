const http = require('http');
const app = require('./app');
const mongoDB = require('./helpers/mongo');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

async function startServer() {
    await mongoDB.mongoConnect();
    server.listen(PORT, () => {
        console.log(`Listening on PORT 3000, Welcome To Graduation Project`);
    });
}

startServer();