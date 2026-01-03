require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const db = require("./models/db");

db.query("SELECT 1")
  .then(() => console.log("✅ Database connected successfully"))
  .catch(err => console.error("❌ DB connection failed:", err));


app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Irrigation System Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
