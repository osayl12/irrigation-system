class Esp {
  constructor(db) {
    this.db = db;
  }

  // sensors table
  createAvgSensor(name, val, potId) {
    const sql = `
      INSERT INTO sensors (SensorName, Val_avg, date, Pot_id)
      VALUES (?, ?, CURDATE(), ?)
    `;
    return this.db.execute(sql, [name, val, potId]);
  }

  // irrigation_system table (DB קיים!)
  createIrrigation(potId, durationCount) {
    const sql = `
      INSERT INTO irrigation_system (date, time, count, pot_id)
      VALUES (CURDATE(), CURTIME(), ?, ?)
    `;
    return this.db.execute(sql, [durationCount, potId]);
  }
}

module.exports = Esp;
