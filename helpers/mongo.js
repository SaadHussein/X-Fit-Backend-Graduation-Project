const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
    console.log('Connection Done');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function mongoConnect() {
    try {
        console.log('Working on Connection');
        await mongoose.connect(MONGO_URL);
    } catch (err) {
        console.log(err);
        console.log('Error Happened When Trying To Connect To DB.');
    }
}

async function mongoDisconnect() {
    try {
        await mongoose.disconnect();
    } catch (err) {
        console.log(err);
        console.log('Error Happened When Trying To Disconnect To DB.');
    }
}

module.exports = {
    mongoConnect,
    mongoDisconnect
};