const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/IoT')
    .then(() => console.log('db conect'))
    .catch((err) => console.log("db conection failed: ", err))