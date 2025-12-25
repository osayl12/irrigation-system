class EspModel {
  constructor(db) {
    this.db = db;
  }

  async getByPot(potId) {
    const sql = `
      SELECT sensorname, val_avg, date
      FROM sensors
      WHERE pot_id = ?
      ORDER BY date DESC
    `;
    const [rows] = await this.db.execute(sql, [potId]);
    return rows;
  }

  async create(sensorName, avg, potId) {
    const sql = `
      INSERT INTO sensors (sensorname, val_avg, pot_id, date)
      VALUES (?, ?, ?, CURDATE())
    `;
    const [res] = await this.db.execute(sql, [
      sensorName,
      avg,
      potId,
    ]);
    return res.insertId;
  }
}

module.exports = EspModel;
