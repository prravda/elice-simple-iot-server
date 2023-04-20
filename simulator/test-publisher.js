import mqtt from 'mqtt'
import dotenv from 'dotenv';
dotenv.config()

const mqttOptions = {
  host: process.env.MQTT_BROKER_HOST,
  port: process.env.MQTT_BROKER_PORT,
};

const client = mqtt.connect(mqttOptions);

client.on('connect', (connack) => {
  console.log('## test publisher connected')

  setInterval(()=>{
    console.log("## published")
    const device_id = Math.round(Math.random() * 5)
    client.publish('dt/test-01', JSON.stringify({
      device_id: device_id===0?1:device_id,
      humidity: Math.round(Math.random() * 100), 
      temperature: Math.round(Math.random() * 100), 
      timestamp: Date.now(),
    }));
  }, 1000)
});

client.on('message', (topic, message)=>{
  console.log(topic, JSON.parse(message.toString('utf-8')))

})