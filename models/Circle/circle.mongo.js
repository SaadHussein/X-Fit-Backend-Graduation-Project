const mongoose = require('mongoose');

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
    }
});

module.exports = mongoose.models.Circle || mongoose.model('Circle', circleSchema);
