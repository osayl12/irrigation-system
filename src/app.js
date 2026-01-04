require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

const routes = require("./routes");
app.use("/", routes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
