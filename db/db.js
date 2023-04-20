import mysql from 'mysql2';

export class DB {
    #pool;
    #promisePool;
    constructor({ host, user, password, database }) {
        this.#pool = mysql.createPool({
            host,
            user,
            password,
            database,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10,
            idleTimeout: 60000,
            queueLimit: 0,
        });
        this.#promisePool = this.#pool.promise();
    }

    async insertData({ deviceId, temperature, humidity, createdAt }) {
        const sql = `INSERT INTO device_data (device_id, temperature, humidity) VALUES (?, ?, ?)`;
        const [rows] = await this.#promisePool.query(sql, [deviceId, temperature, humidity]);
        return rows;
    }

    async getAllDevices() {
        const sql = `SELECT * FROM device`;
        const [rows] = await this.#promisePool.query(sql);
        return rows;
    }

    async getLatestData() {
        // 실시간 데이터란? - 조회를 하는 시점에서 가장 마지막에 들어간 값
        // getLatestData 를 통해, 모든 device 들의 실시간 데이터를 가져와야 함

        // SubQuery 와 IN clause 에 대한 설명
        // device_1 MAX(idx) === 123
        // device_2 MAX(idx) === 433
        // device_3 MAX(idx) === 200
        // SELECT * FROM device_data WHERE idx IN(123, 433, 200);

        const sql = `SELECT * FROM device_data WHERE idx IN(SELECT MAX(idx) FROM device_data GROUP BY device_id)`;
        const [rows] = await this.#promisePool.query(sql);

        return rows;
    }
}
