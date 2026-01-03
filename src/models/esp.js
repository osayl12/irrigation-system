class Esp {
  constructor(db) {
    this.db = db;
  }

  async createAvgSensor(name, avg, potId) {
    const sql = `
      INSERT INTO sensors (SensorName, Val_avg, date, Pot_id)
      VALUES (?, ?, CURDATE(), ?)
    `;
    return this.db.execute(sql, [name, avg, potId]);
  }
}

module.exports = Esp;
