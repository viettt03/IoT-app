const router = require('express').Router()
const { getDatatTb1, postDatatTb2, getDatatTb2, getDataHome, sortData, filterDevice, filterAction } = require('../controllers');


router.get('/getDataHome', getDataHome);

router.get('/getDataTb1', getDatatTb1);

router.post('/postDataTb2', postDatatTb2);

router.get('/getDataTb2', getDatatTb2);

router.get('/sortDataTb1', sortData);

router.get('/filterDevice', filterDevice);

router.get('/filterAction', filterAction);


module.exports = router;
