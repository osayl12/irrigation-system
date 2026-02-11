/*
פרויקט : Smart Irrigation System

שם מלא: דינה נאש
ת.ז: 311487185

שם מלא : אוסיל חאמד
ת.ז: 208913798

*/

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

const app = express();

/* ---------- middleware ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

/* ---------- routes ---------- */
app.use("/", require("./routes"));

app.get("/", (req, res) => {
  res.send("Backend is running ");
});


app.listen(PORT || 3000, () => {
  console.log(`🚀 Local: http://localhost:${PORT || 3000}`);
});
