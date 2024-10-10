require('express-async-errors');
require('./db');
const cors = require('cors');
const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const routers = require('./routers');
const http = require('http');
const mqtt = require('mqtt');
const WebSocket = require('ws');
const { saveSensorData } = require('./controllers/sensor');
const { saveControlData } = require('./controllers/control');
const Sensor = require('./models/Sensor');

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', routers);

const mqttOptions = {
    username: 'viettt03',
    password: '2003',
};

const mqttClient = mqtt.connect('mqtt://192.168.0.102:1234', mqttOptions);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');

    mqttClient.subscribe(['home/sensor', 'home/device/control', 'home/device/status'], (err) => {
        if (err) {
            console.error('Subscribe error:', err);
        } else {
            console.log('Subscribed to topics');
        }
    });
});

//mqtt pub control led

app.post('/api/postDataControl', async (req, res) => {
    try {
        const { deviceId, control } = req.body;
        const controlMessage = `${deviceId}:${control}`;
        await mqttClient.publish('home/device/control', controlMessage);

        res.status(200).json({
            mess: 'control Succes'
        });
    } catch (err) {
        console.error('Errorfecth data:', err);
        res.status(500).json({ error: 'Failed to  data' });
    }
})

mqttClient.on('message', (topic, message) => {
    const msg = message.toString();
    console.log(msg);

    if (topic === 'home/sensor') {
        const data = msg.split(" ")
        saveSensorData(data);
        broadcastSensorData(wss, { type: 'sensorData', data });

    }

    if (topic === 'home/device/status') {
        const data = msg.split(":")
        saveControlData(data);
        broadcastSensorData(wss, { type: 'controlData', data });
    }


});

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});


function broadcastSensorData(wss, data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}


app.use((err, req, res, next) => {
    return res.status(500).json({ error: err.message });
});


// Sensor.find({})
//     .skip((5 - 1) * 10)
//     .limit(10)
//     .then(data => {
//         console.log(data);
//     })
//     .catch(err => {
//         console.error(err);
//     });



const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
    console.log('Server is listening on port ' + PORT);
});
