#ifndef WIFI_MQTT_H
#define WIFI_MQTT_H

#include <ArduinoJson.h>
#include "config.h"
#include "pump.h"
#include <time.h>

/* ===== OBJECTS ===== */
WiFiClient espClient;
PubSubClient mqtt(espClient);

/* ===== GLOBALS ===== */

extern String currentMode;
extern bool forceOverride;

extern int shabbatTimesCount;
extern int shabbatDurationMin;
extern int shabbatDoneToday;
extern bool shabbatRunning;
extern bool shabbatScheduleActive;
extern int shabbatStartMin;
extern int shabbatEndMin;

extern int currentLight;



/* ===== WIFI ===== */
void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}


/* ===== helper: "HH:MM" -> minutes from midnight ===== */
int parseHHMMToMin(const char* s) {
  if (!s) return 0;
  int h = 0, m = 0;
  // פורמט צפוי: "10:00"
  if (sscanf(s, "%d:%d", &h, &m) != 2) return 0;
  if (h < 0) h = 0;
  if (h > 23) h = 23;
  if (m < 0) m = 0;
  if (m > 59) m = 59;
  return h * 60 + m;
}

/* ===== MQTT CALLBACK ===== */
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (unsigned int i = 0; i < length; i++) msg += (char)payload[i];

  // ---- SCHEDULE (SHABBAT) ----
  if (String(topic) == TOPIC_SCHEDULE) {
    DynamicJsonDocument doc(256);
    DeserializationError err = deserializeJson(doc, msg);
    if (err) return;

    // חובה: times + duration
    shabbatTimesCount = doc["times"] | 0;
    shabbatDurationMin = doc["duration"] | 0;

    // אופציונלי: start/end ("HH:MM")
    const char* startStr = doc["start"];
    const char* endStr = doc["end"];

    if (startStr && endStr) {
      shabbatStartMin = parseHHMMToMin(startStr);
      shabbatEndMin = parseHHMMToMin(endStr);
    }

    // הפעלה של מצב מתוזמן
    shabbatScheduleActive = true;
    shabbatDoneToday = 0;
    shabbatRunning = false;
  }



  if (String(topic) == TOPIC_MODE) {
    currentMode = msg;
    forceOverride = false;
  }

  // ---- PUMP ----
  if (String(topic) == TOPIC_PUMP) {
    if (currentMode == "SHABBAT") return;

    if (msg == "FORCE_ON") {
      forceOverride = true;
      turnPumpOn();
    } else if (msg == "ON") {
      // הגנת אור במצב ידני בלבד: אם אור חזק -> רק אזהרה (לא מפעילים)
      if (currentMode == "MANUAL" && currentLight > LIGHT_STRONG_TH) {
        mqtt.publish(TOPIC_WARN,
                     ("{\"message\":\"Strong light detected\",\"type\":\"LIGHT\",\"light_raw\":" + String(currentLight) + "}").c_str(), true);
        return;
      }
      turnPumpOn();
    } else if (msg == "OFF") {
      forceOverride = false;
      turnPumpOff();
    }
  }
}

/* ===== MQTT CONNECT ===== */
void connectMQTT() {
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
  mqtt.setCallback(mqttCallback);

  while (!mqtt.connected()) {
    mqtt.connect("ESP32_IRRIGATION", "", "");
    delay(1000);
  }

  mqtt.subscribe(TOPIC_PUMP);
  mqtt.subscribe(TOPIC_MODE);
  mqtt.subscribe(TOPIC_SCHEDULE);
}

#endif
