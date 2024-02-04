const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    authentication: {
        password: {
            type: String,
            required: true,
        },
        token: {
            type: String,
        }
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: false,
    },
    age: {
        type: Number,
        required: false,
    },
    weight: {
        type: Number,
        required: false,
    },
    height: {
        type: Number,
        required: false,
    },
    goal: {
        type: String,
        required: false,
    },
    experience: {
        type: String,
        required: false,
    },
    bodyFatPercentage: {
        type: Number,
        required: false,
    },
    muscleMass: {
        type: Number,
        required: false,
    },
    workoutDurationPreference: {
        type: String,
        required: false,
    },
    workoutFrequencyPreference: {
        type: String,
        required: false,
    },
    preferredExerciseTypes: {
        type: String,
        required: false,
    },
    trainingEnvironmentPreference: {
        type: String,
        required: false,
    },
    accessToEquipment: {
        type: String,
        required: false,
    },
    motivationLevel: {
        type: String,
        required: false,
    },
    stressLevels: {
        type: Number,
        required: false,
    }
});

module.exports = mongoose.model('User', userSchema);