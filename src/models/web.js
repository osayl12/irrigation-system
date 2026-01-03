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
}

module.exports = Web;
