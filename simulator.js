import * as mqtt from 'mqtt';
import * as dotenv from 'dotenv';
dotenv.config();

const client = mqtt.connect({ host: process.env.MQTT_BROKER_HOST, port: process.env.MQTT_BROKER_PORT });

client.on('connect', () => {
    console.log('Connected to MQTT broker...');

    setInterval(() => {
        const deviceId = Math.round(Math.random() * 3);
        console.log('A message was published!');
        client.publish(`dt/device_${deviceId}`, JSON.stringify({
            device_id: deviceId === 0 ? 1 : deviceId,
            humidity: Math.round(Math.random() * 100),
            temperature: Math.round(Math.random() * 100),
            timestamp: Date.now(),
        }))
    }, 2000);
});

client.on('message', (topic, message) => {
   console.log(topic, JSON.parse(message.toString('utf-8')));
});
