#ifndef WIFI_MQTT_H
#define WIFI_MQTT_H

#include "config.h"
#include "pump.h"

/* ===== OBJECTS ===== */
WiFiClient espClient;
PubSubClient mqtt(espClient);

/* ===== GLOBALS ===== */
extern String currentMode;
extern bool forceOverride;
extern bool manualOverrideOff;

extern int shabbatTimes;
extern int shabbatDurationMin;
extern int currentLight;
extern bool pumpOn;

// חשוב: אלה מגיעים מ-modes.h ולכן חייב extern כאן
extern bool shabbatScheduleActive;
extern int shabbatDoneToday;
extern bool shabbatRunning;

bool pendingManualOn = false;

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
  for (unsigned int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }

  if (String(topic) == TOPIC_SCHEDULE) {
    int comma = msg.indexOf(',');
    if (comma > 0) {
      shabbatTimes = msg.substring(0, comma).toInt();
      shabbatDurationMin = msg.substring(comma + 1).toInt();

      // SAVE בוצע -> מפעיל את התזמון בשבת
      shabbatScheduleActive = true;
      shabbatDoneToday = 0;
      shabbatRunning = false;
    }
  }

  if (String(topic) == TOPIC_MODE) {
    currentMode = msg;
    forceOverride = false;
    manualOverrideOff = false;

    // יציאה משבת -> לא לרוץ עד SAVE הבא
    if (msg != "SHABBAT") {
      shabbatScheduleActive = false;
      shabbatRunning = false;
    }
  }

  if (String(topic) == TOPIC_PUMP) {

    // במצב שבת – לא שליטה ידנית
    if (currentMode == "SHABBAT") return;

    if (msg == "FORCE_ON") {
      forceOverride = true;
      manualOverrideOff = false;
      pendingManualOn = false;

      currentMode = "MANUAL";  
      turnPumpOn();
    }


    else if (msg == "ON") {

      // אם מצב ידני + אור חזק -> התראה, לא מפעיל עד אישור
      if (currentMode == "MANUAL" && currentLight > LIGHT_STRONG_TH) {
        pendingManualOn = true;

        mqtt.publish(
          TOPIC_WARN,
          ("{\"message\":\"Strong light detected. Not recommended to irrigate now\","
           "\"type\":\"LIGHT\","
           "\"light_raw\":"
           + String(currentLight) + "}")
            .c_str(),
          true);

        return;
      }

      manualOverrideOff = false;
      pendingManualOn = false;
      turnPumpOn();
    }

    else if (msg == "OFF") {
      forceOverride = false;
      manualOverrideOff = true;
      pendingManualOn = false;
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
