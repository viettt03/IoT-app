const router = require('express').Router()
const { getDatatControl } = require('../controllers/control');
const { getDataSensor, getWarningToday } = require('../controllers/sensor');

router.get('/getDataSensor', getDataSensor);

router.get('/getDataControl', getDatatControl);

router.get('/getWarningToday', getWarningToday);

module.exports = router;
