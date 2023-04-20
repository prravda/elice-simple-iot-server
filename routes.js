import express from 'express';

const router = express.Router();

const init = (db, mqttClient) => {
  router.get('/data/realtime', async (req, res) => {
    // 실시간 데이터 조회
    res.send(await db.getLatestData());
  })

  router.get('/data/devices/:device_id', async (req, res) => {
    const { device_id } = req.params;
    const { start, end } = req.query;
  
    if(!device_id || device_id === ''){
      res.status(400).send({ error: 'device_id error' })
    }
    // 히스토리 데이터 조회
    res.send(await db.getData(device_id, start, end));
  })
  
  router.post('/cmd/devices/:device_id', async (req, res) => {
    const { device_id } = req.params;
    const { command } = req.body;

    console.log(device_id, command)

    if(!device_id || device_id === ''){
      res.status(400).send({ error: 'device_id empty error' })
    }
    if(command!=='run' && command !== 'stop'){
      res.status(400).send({ error: 'command value error' })
    }
    
    // 디바이스 정보 조회
    const device = await db.getOneDevice(device_id);

    // 명령 메시지 발행
    await mqttClient.sendCommand(`cmd/${device.serial_num}/pump`, {
      serial_num: device.serial_num, 
      command,
    })

    res.send(true)

  })

  router.get('/devices', async (req, res) => {
    // 디바이스 리스트 조회
    res.send(await db.getDevices());
  })
}

const getRouter = () => {
  return router
}

export default {
  init, 
  getRouter,
}