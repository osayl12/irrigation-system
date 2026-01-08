const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost:1883"); 
// אם יש לך broker אחר – שנה כתובת

client.on("connect", () => {
  console.log(" MQTT connected");
});

client.on("error", (err) => {
  console.error(" MQTT error", err);
});

module.exports = client;
