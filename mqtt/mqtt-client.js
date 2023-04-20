import mqtt from 'mqtt';
export class MqttClient {
    #options;
    #client;
    #topics;

    constructor(options, topics) {
        this.#options = options;
        this.#topics = topics;
    }

    connect() {
        this.#client = mqtt.connect(this.#options);
        this.#client.on('connect', () => {
           console.log('## Connected!');

           this.#client.subscribe(this.#topics, (err) => {
               if (!err) {
                   console.log(`Start to subscribe: ${this.#topics}`);
               } else {
                   conosle.error(err);
               }
           });
        });

        this.#client.on('error', (err) => {
            console.log(err);
        });
    }

    sendCommand(topic, message) {
        this.#client.publish(topic, JSON.stringify(message));
    }

    setMessageCallback(cb) {
        this.#client.on('message', cb);
    }
}