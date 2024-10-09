const Control = require('../models/Control');

const device = [
    'Ceiling Fan',
    'Air Conditioner',
    'Lamp'
]

exports.saveControlData = async (data) => {
    try {
        const newData = new Control({
            deviceId: Number(data[0]),
            name: device[Number(data[0]) - 1],
            action: Number(data[1])
        });
        await newData.save();
        console.log('Data control saved to database');
    } catch (err) {
        console.error('Database error:', err);
    }
};

exports.getDatatControl = async (req, res) => {
    const {
        action = null,
        deviceId = null,
        page = 1,
        limit = 10,
        startTime = new Date(0),
        endTime = new Date(),
    } = req.query;
    let query = {
        timestamp: {
            $gte: new Date(startTime),
            $lte: new Date(endTime)
        }
    }

    if (action && deviceId) {
        query.action = action;
        query.deviceId = deviceId
    } else if (action && !deviceId) {
        query.action = action;

    } else if (!action && deviceId) {
        query.deviceId = deviceId

    }
    try {
        const data = await Control.find(query)
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalRecords = await Control.countDocuments(query);

        res.status(200).json({
            data,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: parseInt(page),
        });
    } catch (err) {
        console.error('Errorfecth data:', err);
        res.status(500).json({ error: 'Failed to  data' });
    }
};

exports.filterAction = async (req, res) => {
    const { action, page = 1, limit = 10 } = req.query;

    try {
        const skip = (page - 1) * limit;

        const results = await Control.find({ action: action })
            .skip(skip)
            .limit(Number(limit));

        const totalResults = await Control.countDocuments({ action: action });

        res.json({
            page: Number(page),
            limit: Number(limit),
            totalResults,
            totalPages: Math.ceil(totalResults / limit),
            data: results,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.filterDevice = async (req, res) => {
    const { device, page = 1, limit = 10 } = req.query;

    try {
        const skip = (page - 1) * limit;

        const results = await Control.find({ device: device })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(Number(limit));


        const totalResults = await Control.countDocuments({ device: device });

        res.json({
            page: Number(page),
            limit: Number(limit),
            totalResults,
            totalPages: Math.ceil(totalResults / limit),
            data: results,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
