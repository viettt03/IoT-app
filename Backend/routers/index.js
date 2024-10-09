const router = require('express').Router()
const { getDatatControl } = require('../controllers/control');
const { getDataSensor } = require('../controllers/sensor');

router.get('/getDataSensor', getDataSensor);

router.get('/getDataControl', getDatatControl);

module.exports = router;
