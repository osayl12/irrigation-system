class Esp {
  constructor(db) {
    this.db = db;
  }

  createSensor(sensor, value, potId) {
    return this.db.execute(
      `INSERT INTO sensors (SensorName, Val_avg, date, Pot_id)
       VALUES (?, ?, CURDATE(), ?)`,
      [sensor, value, potId]
    );
  }

  createIrrigation(count, potId) {
    return this.db.execute(
      `INSERT INTO irrigation_system (date, time, count, pot_id)
       VALUES (CURDATE(), CURTIME(), ?, ?)`,
      [count, potId]
    );
  }
}

module.exports = Esp;
