require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT;


const app = express();

/* ---------- middleware ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

/* ---------- routes ---------- */
const routes = require("./routes");
app.use("/", routes);


app.listen(PORT || 3000, () => {
  console.log(`🚀 Local: http://localhost:${PORT || 3000}`);
});

