#pragma once
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "config.h"

extern WiFiClient wifiClient;
static PubSubClient mqttClient(wifiClient);

// משתנה מצב גלובלי
extern String currentMode;

// ===== MQTT CALLBACK =====
inline void onMqttMessage(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (unsigned int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }

  StaticJsonDocument<256> doc;
  if (deserializeJson(doc, msg)) return;

  // ---- MODE ----
  if (String(topic) == TOPIC_MODE) {
    currentMode = doc["mode"].as<String>();
    Serial.print("MODE CHANGED TO: ");
    Serial.println(currentMode);
  }

  // ---- MANUAL PUMP ----
  if (String(topic) == TOPIC_PUMP && currentMode == "MANUAL") {
    bool state = doc["state"];
    setPump(state);
  }
}

// ===== CONNECT =====
inline void connectMQTT() {
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(onMqttMessage);

  while (!mqttClient.connected()) {
    String cid = "esp32-irrigation";
    if (mqttClient.connect(cid.c_str())) {
      mqttClient.subscribe(TOPIC_MODE);
      mqttClient.subscribe(TOPIC_PUMP);
      mqttClient.subscribe(TOPIC_SCHEDULE);
      Serial.println("MQTT CONNECTED");
    } else {
      delay(1500);
    }
  }
}

inline void mqttLoop() {
  if (!mqttClient.connected()) connectMQTT();
  mqttClient.loop();
}
