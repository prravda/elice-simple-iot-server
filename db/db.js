import mysql from 'mysql2';

class DB {
  constructor({host, user, password, database}){
    this.pool = mysql.createPool({
      host,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0
    });
    this.promisePool = this.pool.promise();
  }

  async insertData({device_id, temperature, humidity, created_at}){
    const sql = `INSERT INTO device_data (device_id, temperature, humidity) values (?,?,?);`;
    const [rows] = await this.promisePool.query(sql,[device_id, temperature, humidity]);
    return rows;
  }

  async getLatestData(){
    // 실시간 데이터 조회
    const sql = `SELECT * FROM device_data WHERE idx IN(SELECT MAX(idx) idx FROM device_data GROUP BY device_id);`;
    const [rows] = await this.promisePool.query(sql);
    return rows;
  }

  async getDevices(){
    // 디바이스 리스트 조회
    const sql = `SELECT * FROM device;`;
    const [rows] = await this.promisePool.query(sql);
    return rows;
  }

  async getOneDevice(device_id){
    // 디바이스 정보 조회
    const sql = `SELECT * FROM device where device_id=?;`;
    const [rows] = await this.promisePool.query(sql, [device_id]);
    return rows;
  }

  async getData(device_id, start, end){
    // 히스토리 데이터 조회
    const sql = `SELECT * FROM device_data WHERE device_id=? and (created_at BETWEEN ? AND ?);`
    const [rows] = await this.promisePool.query(sql, [device_id, start, end]);
    return rows;
  }
}

export default DB