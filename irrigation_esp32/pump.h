#pragma once
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.h"

static bool pumpOn = false;
static unsigned long pumpStartMs = 0;
static unsigned long pumpDurationMs = 0;

inline void setPump(bool on) {
  pumpOn = on;
  digitalWrite(RELAY_PIN, on ? LOW : HIGH);

  if (on) {
    pumpStartMs = millis();
  } else if (pumpStartMs > 0) {
    unsigned long dur = millis() - pumpStartMs;
    pumpStartMs = 0;

    if (dur > 5000) {
      HTTPClient http;
      http.begin(String(SERVER_BASE) + "/esp/irrigation");
      http.addHeader("Content-Type", "application/json");

      StaticJsonDocument<128> doc;
      doc["count"] = max(1, (int)(dur / 60000));
      doc["pot_id"] = POT_ID;

      String body;
      serializeJson(doc, body);
      http.POST(body);
      http.end();
    }
  }
}

inline void updatePumpTimer() {
  if (pumpOn && pumpDurationMs > 0 &&
      millis() - pumpStartMs >= pumpDurationMs) {
    pumpDurationMs = 0;
    setPump(false);
  }
}
