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

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedMinValue = parseFloat(minValue);
    const parsedMaxValue = parseFloat(maxValue);
    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    if (parsedPage < 1 || parsedLimit < 1) {
        return res.status(400).json({ error: 'Trang và giới hạn phải là số nguyên dương' });
    }

    let query = {};

    const validFields = ['temp', 'humidity', 'light', 'time'];
    if (!validFields.includes(selectField)) {
        return res.status(400).json({ error: 'Trường được chọn không hợp lệ' });
    }

    if (selectField === 'time') {
        query.timestamp = { $gte: parsedStartTime, $lte: parsedEndTime };
    } else {
        query[selectField] = { $gte: parsedMinValue, $lte: parsedMaxValue };
    }

    const sortOrder = order === 'desc' ? -1 : 1;

    try {

        const data = await Sensor.aggregate([
            { $match: query },
            { $sort: { [sortBy]: sortOrder } },
            { $skip: (parsedPage - 1) * parsedLimit },
            { $limit: parsedLimit }
        ]);

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


// exports.getDataSensor = async (req, res) => {
//     const {
//         sortBy = 'order',
//         order = 'desc',
//         minValue = 0,
//         maxValue = Number.MAX_SAFE_INTEGER,
//         selectField = 'temp',
//         startTime = new Date(0),
//         endTime = new Date(),
//         page = 1,
//         limit = 10
//     } = req.query;

//     let query = {};

//     if (selectField === 'time') {
//         query.timestamp = {
//             $gte: new Date(startTime),
//             $lte: new Date(endTime)
//         };
//     } else if (selectField) {
//         const validFields = ['temp', 'humidity', 'light'];
//         if (!validFields.includes(selectField)) {
//             return res.status(400).json({ error: 'Invalid select field' });
//         }
//         query[selectField] = {
//             $gte: minValue,
//             $lte: maxValue
//         };
//     }

//     const sortOrder = order === 'desc' ? -1 : 1;

//     try {

//         const data = await Sensor.find(query)
//             .sort({ [sortBy]: sortOrder })
//             .skip((page - 1) * limit)
//             .limit(parseInt(limit));
//         const totalRecords = await Sensor.countDocuments(query);

//         res.status(200).json({
//             data,
//             totalPages: Math.ceil(totalRecords / limit),
//             currentPage: parseInt(page),
//             totalRecords
//         });
//     } catch (err) {
//         console.error('Error fetching data:', err);
//         res.status(500).json({ error: 'Failed to fetch data' });
//     }
// };

// exports.getDataHome = async (req, res) => {
//     const page = 1, limit = 10;

//     try {
//         const data = await Sensor.find()
//             .sort({ timestamp: -1 })
//             .skip((page - 1) * limit)
//             .limit(parseInt(limit));

//         res.status(200).json({
//             data
//         });
//     } catch (err) {
//         console.error('Errorfecth data:', err);
//         res.status(500).json({ error: 'Failed to  data' });
//     }
// };