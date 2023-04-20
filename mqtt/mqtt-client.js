import mqtt from 'mqtt'

class MqttClient {
  #options;
  #client;
  #topics;

  constructor(options, topics){
    this.#options = options;
    this.#topics = topics;
  }

  connect(){
    const self = this;
    self.#client = mqtt.connect(self.#options);
    
    // 연결 이벤트 콜백
    self.#client.on('connect', () => {
      console.log('## connected');
      
      // 구독 설정
      self.#client.subscribe(self.#topics, (error) => {
        if (!error) {
          console.log(`## start to suscribe ${self.#topics}`);  
        } else {
          console.log(error)
        }
      });
    });

    self.#client.on('error', (error) => {
      console.log(error);
    });
  }

  // MQTT 메시지 발행
  sendCommand(topic, message){
    this.#client.publish(topic, JSON.stringify(message));
  }

  // 메시지 이벤트 콜백 설정
  setMessageCallback(cb){
    this.#client.on('message', cb);
  }
}

export default MqttClient;








