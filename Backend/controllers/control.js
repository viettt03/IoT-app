const Control = require('../models/Control');

const device = [
    'Ceiling Fan',
    'Air Conditioner',
    'Lamp'
]

exports.saveControlData = async (data) => {
    try {
        const time = new Date();
        time.setMilliseconds(0);
        const newData = new Control({
            deviceId: Number(data[0]),
            name: device[Number(data[0]) - 1],
            action: Number(data[1]),
            timestamp: time
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
        date = null
    } = req.query;
    let query = {}

    if (action && deviceId) {
        query.action = action;
        query.deviceId = deviceId
    } else if (action && !deviceId) {
        query.action = action;

    } else if (!action && deviceId) {
        query.deviceId = deviceId

    }
    if (date) {
        const inputDate = new Date(date);
        if (isNaN(inputDate.getTime())) {
            return res.status(400).json({ error: 'Ngày không hợp lệ' });
        }

        const startDate = new Date(inputDate);
        let endDate;

        if (inputDate.getSeconds() === 0) {
            if (inputDate.getMinutes() === 0) {
                if (inputDate.getHours() === 0) {

                    endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 1);
                } else {

                    endDate = new Date(startDate);
                    endDate.setHours(startDate.getHours() + 1);
                }
            } else {

                endDate = new Date(startDate);
                endDate.setMinutes(startDate.getMinutes() + 1);
            }
        } else {

            endDate = new Date(startDate);
            endDate.setSeconds(startDate.getSeconds() + 1);
        }

        query.timestamp = { $gte: startDate, $lt: endDate };
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
