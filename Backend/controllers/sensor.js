const Sensor = require('../models/Sensor');

exports.saveSensorData = async (data) => {
    try {
        const newData = new Sensor({
            temp: Number(data[0]),
            humidity: Number(data[1]),
            light: Number(data[2])
        });
        await newData.save();
        console.log('Data saved to database');
    } catch (err) {
        console.error('Database error:', err);
    }
};

exports.getDataSensor = async (req, res) => {
    const {
        sortBy = 'order',
        order = 'desc',
        minValue = 0,
        maxValue = Number.MAX_SAFE_INTEGER,
        selectField = 'temp',
        startTime = new Date(0),
        endTime = new Date(),
        page = 1,
        limit = 10
    } = req.query;

    let query = {};

    if (selectField === 'time') {
        query.timestamp = {
            $gte: new Date(startTime),
            $lte: new Date(endTime)
        };
    } else if (selectField) {
        const validFields = ['temp', 'humidity', 'light'];
        if (!validFields.includes(selectField)) {
            return res.status(400).json({ error: 'Invalid select field' });
        }
        query[selectField] = {
            $gte: minValue,
            $lte: maxValue
        };
    }

    const sortOrder = order === 'desc' ? -1 : 1;

    try {

        const data = await Sensor.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const totalRecords = await Sensor.countDocuments(query);

        res.status(200).json({
            data,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: parseInt(page),
            totalRecords
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

exports.getDataHome = async (req, res) => {
    const page = 1, limit = 10;

    try {
        const data = await Sensor.find()
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            data
        });
    } catch (err) {
        console.error('Errorfecth data:', err);
        res.status(500).json({ error: 'Failed to  data' });
    }
};