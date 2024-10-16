const Sensor = require('../models/Sensor');

exports.saveSensorData = async (data) => {
    try {
        const time = new Date();
        time.setMilliseconds(0);
        const newData = new Sensor({
            temp: Number(data[0]),
            humidity: Number(data[1]),
            light: Number(data[2]),
            wind: Number(data[3]),
            rain: Number(data[4]),
            timestamp: time
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
        date = null,
        page = 1,
        limit = 10
    } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedMinValue = parseFloat(minValue);
    const parsedMaxValue = parseFloat(maxValue);

    if (parsedPage < 1 || parsedLimit < 1) {
        return res.status(400).json({ error: 'Trang và giới hạn phải là số nguyên dương' });
    }

    let query = {
        temp: { '$gte': 0, '$lte': 9007199254740991 }
    };

    const validFields = ['temp', 'humidity', 'light', 'time', 'wind', 'rain'];
    if (!validFields.includes(selectField)) {
        return res.status(400).json({ error: 'Trường được chọn không hợp lệ' });
    }
    if (selectField !== 'time')
        query[selectField] = { $gte: parsedMinValue, $lte: parsedMaxValue };

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

    const sortOrder = order === 'desc' ? -1 : 1;

    try {
        const data = await Sensor.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip((parsedPage - 1) * parsedLimit)
            .limit(parsedLimit);

        const totalRecords = await Sensor.countDocuments(query);

        res.status(200).json({
            data,
            totalPages: Math.ceil(totalRecords / parsedLimit),
            currentPage: parsedPage,
            totalRecords
        });
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        res.status(500).json({ error: 'Không thể lấy dữ liệu' });
    }
};



exports.getWarningToday = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 0);

        const countWaring = await Sensor.countDocuments({
            timestamp: { $gte: startDate, $lte: endDate },
            wind: { $gt: 50 },
            rain: { $gt: 50 }
        })
        res.status(200).json({
            countWaring
        });
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        res.status(500).json({ error: 'Không thể lấy dữ liệu' });
    }
};


