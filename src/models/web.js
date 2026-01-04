class Web {
  constructor(db) {
    this.db = db;
  }

  getSensors(limit = 100) {
    return this.db.execute(
      `SELECT * FROM sensors ORDER BY id DESC LIMIT ?`,
      [Number(limit)]
    );
  }

  getIrrigations(limit = 100) {
    return this.db.execute(
      `SELECT * FROM irrigation_system ORDER BY id DESC LIMIT ?`,
      [Number(limit)]
    );
  }

  getPots() {
    return this.db.execute(`SELECT * FROM pots ORDER BY id DESC`);
  }

  getStrains() {
    return this.db.execute(`SELECT * FROM strains ORDER BY id DESC`);
  }
  deleteSensor(id) {
  return this.db.execute(
    "DELETE FROM sensors WHERE id = ?",
    [id]
  );
}

deleteIrrigation(id) {
  return this.db.execute(
    "DELETE FROM irrigation_system WHERE id = ?",
    [id]
  );
}
updateSensor(id, fields) {
  const allowed = ["SensorName", "Val_avg", "Pot_id"];
  const keys = Object.keys(fields).filter(k => allowed.includes(k));

  if (keys.length === 0) return Promise.resolve();

  const sql = `
    UPDATE sensors
    SET ${keys.map(k => `${k} = ?`).join(", ")}
    WHERE id = ?
  `;

  const values = keys.map(k => fields[k]);
  values.push(id);

  return this.db.execute(sql, values);
}

updateIrrigation(id, fields) {
  const allowed = ["count", "pot_id"];
  const keys = Object.keys(fields).filter(k => allowed.includes(k));

  if (keys.length === 0) return Promise.resolve();

  const sql = `
    UPDATE irrigation_system
    SET ${keys.map(k => `${k} = ?`).join(", ")}
    WHERE id = ?
  `;

  const values = keys.map(k => fields[k]);
  values.push(id);

  return this.db.execute(sql, values);
}


}

module.exports = Web;
