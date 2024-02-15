const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
    memberName: {
        type: String,
        required: true
    },
    memberID: {
        type: String,
        required: true
    }
});

const circleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    adminID: {
        type: String,
        required: true
    },
    members: {
        type: [memberSchema],
    }
});

module.exports = mongoose.models.Circle || mongoose.model('Circle', circleSchema);
