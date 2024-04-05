const catchAsync = require("../../middleware/catchAsync");

const CreateUserPlan = catchAsync(async (req, res, next) => {
    const response = await fetch('https://finess-hub.onrender.com/', {
        method: "POST",
        body: JSON.stringify({
            user_id: req.user._id,
            age: req.user.age,
            name: req.user.name,
            email: req.user.email,
            password: req.user.authentication.password,
            gender: req.user.gender,
            weight: req.user.weight,
            height: req.user.height,
            workout_history: [],
            fitness_goals: req.user.goal,
            fitness_level: req.user.experience,
            medical_conditions: ["None"],
            preferences: { duration: +req.user.workoutDurationPreference.slice(0, 2), intensity: req.user.motivationLevel, frequency: +req.user.workoutFrequencyPreference.slice(0, 1) },
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();
    res.status(200).json({
        status: "success",
        data
    });

});

module.exports = {
    CreateUserPlan
};