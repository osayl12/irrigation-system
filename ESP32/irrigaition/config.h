#ifndef CONFIG_H
#define CONFIG_H

#include <WiFi.h>
#include <PubSubClient.h>
#include <HTTPClient.h>
#include <DHT.h>

/* ===== WIFI ===== */
#define WIFI_SSID "Osayl"
#define WIFI_PASSWORD "osayl12345"

/* ===== MQTT ===== */
#define MQTT_HOST "172.20.10.4"
#define MQTT_PORT 1883

#define TOPIC_PUMP "irrigation/pump"
#define TOPIC_MODE "irrigation/mode"
#define TOPIC_SCHEDULE "irrigation/schedule"
#define TOPIC_WARN "irrigation/warn"
#define TOPIC_STATUS "irrigation/status"
#define TOPIC_SENSORS "irrigation/sensors"


/* ===== SERVER ===== */
#define SERVER_BASE "http://172.20.10.4:3000"
#define POT_ID 1

/* ===== GPIO ===== */
#define DHT_PIN 16
#define LIGHT_SENSOR_PIN 36
#define SOIL_SENSOR_PIN 39
#define RELAY_PIN 23

/* ===== THRESHOLDS ===== */
#define TEMP_HIGH_TH 30.0
#define LIGHT_STRONG_TH 2000

/* ===== SOIL TARGET (ערך רצוי + היסטרזיס) ===== */
#define SOIL_TARGET 380
#define SOIL_HYST 40
#define SOIL_DRY_ON (SOIL_TARGET - SOIL_HYST)
#define SOIL_WET_OFF (SOIL_TARGET + SOIL_HYST)

/* ===== WATER CONSUMPTION (L/min) ===== */
#define PUMP_LITERS_PER_MIN 2.0


#endif
