#ifndef PUMP_H
#define PUMP_H

#include "config.h"

bool pumpOn = false;
unsigned long pumpStartMillis = 0;

extern PubSubClient mqtt;

void publishPumpStatus() {
  mqtt.publish(TOPIC_STATUS, pumpOn ? "ON" : "OFF", true);
}

void saveIrrigation() {
  unsigned long durationSec = (millis() - pumpStartMillis) / 1000;
  float liters = (durationSec / 60.0) * PUMP_LITERS_PER_MIN;

  HTTPClient http;
  http.begin(String(SERVER_BASE) + "/esp/irrigation");
  http.addHeader("Content-Type", "application/json");


  String body =
    "{\"pot_id\":" + String(POT_ID) + ",\"count\":" + String(durationSec) + ",\"liters\":" + String(liters, 2) + "}";

  http.POST(body);
  http.end();
}

void turnPumpOn() {
  if (!pumpOn) {
    pumpOn = true;
    pumpStartMillis = millis();

    //  LOW מפעיל ריליי
    digitalWrite(RELAY_PIN, LOW);

    publishPumpStatus();  // עדכון מיידי ל-WEB
  }
}

void turnPumpOff() {
  if (pumpOn) {
    pumpOn = false;

    digitalWrite(RELAY_PIN, HIGH);

    saveIrrigation();     // שמירת זמן השקיה
    publishPumpStatus();  // עדכון מיידי ל-WEB
  }
}

#endif
