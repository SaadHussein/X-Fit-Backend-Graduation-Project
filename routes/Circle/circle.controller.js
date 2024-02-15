const { createCircleInDatabase } = require('../../models/Circle/circle.model');

async function createCircle(req, res) {
    const data = req.body;

    if (data.name === '' || !data.name || data.adminID === '' || !data.adminID) {
        return res.status(404).json({
            message: "Fields Required."
        });
    }

    const result = await createCircleInDatabase(data);

    if (result.message === 'Created Successfully.') {
        return res.status(201).json(result);
    } else {
        return res.status(404).json(result);
    }

}

module.exports = {
    createCircle,
};