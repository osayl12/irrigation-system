#ifndef WIFI_MQTT_H
#define WIFI_MQTT_H

#include <ArduinoJson.h>
#include "config.h"
#include "pump.h"

/* ===== OBJECTS ===== */
WiFiClient espClient;
PubSubClient mqtt(espClient);

/* ===== GLOBALS ===== */
extern String currentMode;
extern bool forceOverride;
extern int shabbatTimes;
extern int shabbatDurationMin;
extern bool shabbatScheduleActive;
extern int shabbatDoneToday;
extern bool shabbatRunning;
extern int currentLight;

/* ===== WIFI ===== */
void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

/* ===== MQTT CALLBACK ===== */
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (unsigned int i = 0; i < length; i++) msg += (char)payload[i];

  if (String(topic) == TOPIC_SCHEDULE) {
    DynamicJsonDocument doc(256);
    deserializeJson(doc, msg);
    shabbatTimes = doc["times"];
    shabbatDurationMin = doc["duration"];
    shabbatScheduleActive = true;
    shabbatDoneToday = 0;
    shabbatRunning = false;
  }

  if (String(topic) == TOPIC_MODE) {
    currentMode = msg;
    forceOverride = false;
  }

  if (String(topic) == TOPIC_PUMP) {
    if (currentMode == "SHABBAT") return;

    if (msg == "FORCE_ON") {
      forceOverride = true;
      turnPumpOn();
    } else if (msg == "ON") {
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
