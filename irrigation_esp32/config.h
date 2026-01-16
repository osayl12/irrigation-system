#pragma once

/* ===== WIFI ===== */
#define WIFI_SSID     "Osayl"
#define WIFI_PASSWORD "osayl12345"

/* ===== MQTT ===== */
#define MQTT_HOST "172.20.10.4"
#define MQTT_PORT 1883

#define TOPIC_PUMP     "irrigation/pump"
#define TOPIC_MODE     "irrigation/mode"
#define TOPIC_SCHEDULE "irrigation/schedule"
#define TOPIC_STATUS   "irrigation/status"
#define TOPIC_WARN     "irrigation/warn"

/* ===== SERVER ===== */
#define SERVER_BASE "http://172.20.10.4:3000"
#define POT_ID 1

/* ===== GPIO ===== */
#define DHT_PIN 16
#define LIGHT_SENSOR_PIN 36
#define SOIL_SENSOR_PIN 39
#define RELAY_PIN 23

/* ===== THRESHOLDS ===== */
#define LIGHT_STRONG_TH 2500     // תכוון לפי בדיקה
#define SOIL_DRY_TH     800      // 0 = יבש
#define TEMP_HIGH_TH    30.0
