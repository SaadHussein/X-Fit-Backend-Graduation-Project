require('dotenv').config();
require('express-async-errors');

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception, Shutting Down...');
    console.log(err.name, err.message);
    process.exit(1);
});

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

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection, Shutting Down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});