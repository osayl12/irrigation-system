class Esp {
  constructor(db) {
    this.db = db;
  }

  createSensor(sensor, value, potId) {
    return this.db.execute(
      `INSERT INTO sensors (SensorName, Val_avg, date, Pot_id)
       VALUES (?, ?, CURDATE(), ?)`,
      [sensor, value, potId],
    );
  }

  createIrrigation(count, potId, liters) {
    return this.db.execute(
      `INSERT INTO irrigation_system (date, time, count, pot_id, liters)
     VALUES (CURDATE(), CURTIME(), ?, ?, ?)`,
      [count, potId, liters],
    );
  }
}

module.exports = Esp;
