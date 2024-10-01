const router = require('express').Router()
const { postDatatControl, getDatatControl, filterAction, filterDevice } = require('../controllers/control');
const { getDataSensor, getDataHome } = require('../controllers/sensor');



router.get('/getDataSensor', getDataSensor);

router.get('/getDataControl', getDatatControl);




module.exports = router;
