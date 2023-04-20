import * as dotenv from 'dotenv';
dotenv.config();

import { MqttClient } from './mqtt/mqtt-client.js';
import { DB } from './db/db.js';

import { init, getRouter } from "./routes.js";

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const TOPIC_TYPE_INDEX = 0;
const PORT_NUMBER = 8080;

const db = new DB({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

const mqttOptions = {
    host: process.env.MQTT_BROKER_HOST,
    port: process.env.MQTT_BROKER_PORT,
};

const mqttClient = new MqttClient(mqttOptions, ['dt/#']);
mqttClient.connect();

mqttClient.setMessageCallback(async (topic, message) => {
    try {
        const topicType = topic.split('/')[TOPIC_TYPE_INDEX];
        const messageToJSON = JSON.parse(message);

        switch (topicType) {
            case 'dt':
                await db.insertData({
                    deviceId: messageToJSON.device_id,
                    temperature: messageToJSON.temperature,
                    humidity: messageToJSON.humidity,
                    createdAt: new Date(messageToJSON.timestamp),
                });
                break;

            default:
                console.log(`Undefined topic type, ${topicType}`);
                break;
        }
    } catch (e) {
        console.error(e);
    }
});


init(db, mqttClient);

app.use(express.json());
app.use("/api", getRouter());

app.listen(PORT_NUMBER, () => {
    console.log(`simple-iot server listening port ${PORT_NUMBER}`);
});




