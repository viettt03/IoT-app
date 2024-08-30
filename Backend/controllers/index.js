const Table1 = require('../models/Table1');
const Table2 = require('../models/Table2');


const randData = () => {
    const temp = Math.floor(Math.random() * 40) + 1;
    const humidity = Math.floor(Math.random() * 100) + 1;
    const light = Math.floor(Math.random() * 100) + 1;
    return { temp, humidity, light };
}

exports.saveRandomSensorData = async (req, res) => {
    const data = new Table1(randData());
    try {
        await data.save();
        console.log('Data saved:', data);
        // res.status(200).json({ data });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ error: 'Failed to save data' });
    }
};

exports.getDatatTb1 = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const data = await Table1.find()
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalRecords = await Table1.countDocuments();

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
exports.getDataHome = async (req, res) => {
    const page = 1, limit = 10;

    try {
        const data = await Table1.find()
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


exports.postDatatTb2 = async (req, res) => {
    try {
        const { device, control } = req.body;

        const data = new Table2({ device, control, action: 1 });
        await data.save();
        res.status(200).json({
            data,
            mess: 'Succes'
        });
    } catch (err) {
        console.error('Errorfecth data:', err);
        res.status(500).json({ error: 'Failed to  data' });
    }
};

exports.getDatatTb2 = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const data = await Table2.find()
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalRecords = await Table2.countDocuments();

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


exports.sortData = async (req, res) => {
    const { sortBy, order = 'asc', page = 1, limit = 10 } = req.query;


    const validSortFields = ['order', 'temp', 'humidity', 'light'];
    if (!validSortFields.includes(sortBy)) {
        return res.status(400).json({ error: 'Invalid sort field' });
    }


    const sortOrder = order === 'desc' ? -1 : 1;
    console.log(sortOrder);

    try {
        const results = await Table1.find()
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        // Đếm tổng số kết quả phù hợp (không tính phân trang)
        const totalResults = await Table1.countDocuments();

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

        const results = await Table2.find({ device: device })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(Number(limit));


        const totalResults = await Table2.countDocuments({ device: device });

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

exports.filterAction = async (req, res) => {
    const { action, page = 1, limit = 10 } = req.query;

    try {
        const skip = (page - 1) * limit;

        const results = await Table2.find({ action: action })
            .skip(skip)
            .limit(Number(limit));


        const totalResults = await Table2.countDocuments({ action: action });

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