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

}

module.exports = Web;
