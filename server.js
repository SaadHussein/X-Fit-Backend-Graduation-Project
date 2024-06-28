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
const { Server } = require("socket.io");
const validateToken = require('./middleware/validateToken');
const io = new Server(server);
const circleDB = require("./models/Circle/circle.mongo");

async function startServer() {
    try {
        await mongoDB.mongoConnect();

        io.on("connection", (socket) => {
            console.log("User Connected");

            socket.on("message", async ({ message, token, user, circleID }) => {
                console.log(message, token, user, circleID);

                const decodedToken = validateToken(token);
                if (!decodedToken) {
                    console.log("Invalid Token");
                    return;
                }

                const selectedCircle = await circleDB.findById(circleID);
                selectedCircle.messages.push({
                    text: message,
                    senderName: user.name
                });

                await selectedCircle.save();

                socket.emit("messages", { messages: selectedCircle.messages });
            });
        });

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