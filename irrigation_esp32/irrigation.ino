#include "config.h"
#include "wifi_client.h"
#include "mqtt_client.h"   // אתה כבר בנית
#include "sensors.h"
#include "pump.h"
#include "modes.h"

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);

  connectWiFi();
  initSensors();
  connectMQTT(); // משתמש ב-currentMode כ־String
}

void loop() {
  mqttLoop();    // שלך
  runModes();
  delay(50);
}
