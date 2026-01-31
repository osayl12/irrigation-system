/*
class Web {
  constructor(db) {
    this.db = db;
  }

  /* ---------- READ ---------- */
/*
  getSensors() {
    return this.db.execute("SELECT * FROM sensors ORDER BY id DESC");
  }

  getIrrigations() {
    return this.db.execute("SELECT * FROM irrigation_system ORDER BY id DESC");
  }

  /* ---------- DELETE ---------- */
/*
  deleteSensor(id) {
    return this.db.execute("DELETE FROM sensors WHERE id = ?", [id]);
  }

  deleteIrrigation(id) {
    return this.db.execute("DELETE FROM irrigation_system WHERE id = ?", [id]);
  }

  /* ---------- UPDATE ---------- */
/*
  updateSensor(id, fields) {
    const allowed = ["SensorName", "Val_avg", "Pot_id"];
    const keys = Object.keys(fields).filter(k => allowed.includes(k));
    if (!keys.length) return;

    const sql = `
      UPDATE sensors
      SET ${keys.map(k => `${k}=?`).join(",")}
      WHERE id=?
    `;

    return this.db.execute(sql, [...keys.map(k => fields[k]), id]);
  }

  updateIrrigation(id, fields) {
    const allowed = ["count", "pot_id"];
    const keys = Object.keys(fields).filter(k => allowed.includes(k));
    if (!keys.length) return;

    const sql = `
      UPDATE irrigation_system
      SET ${keys.map(k => `${k}=?`).join(",")}
      WHERE id=?
    `;

    return this.db.execute(sql, [...keys.map(k => fields[k]), id]);
  }
}

module.exports = Web;
*/
