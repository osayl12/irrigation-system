#ifndef SENSORS_H
#define SENSORS_H

#include "config.h"

DHT dht(DHT_PIN, DHT11);

float currentTemp = 0;
int currentSoil = 0;
int currentLight = 0;

extern PubSubClient mqtt;

void publishSensors() {
  if (isnan(currentTemp)) currentTemp = -999;

  String payload = "{";
  payload += "\"temp\":" + String(currentTemp, 1) + ",";
  payload += "\"soil\":" + String(currentSoil) + ",";
  payload += "\"light\":" + String(currentLight);
  payload += "}";

  mqtt.publish("irrigation/sensors", payload.c_str(), true);
}

void readSensors() {
  currentTemp = dht.readTemperature();
  currentSoil = analogRead(SOIL_SENSOR_PIN);
  currentLight = analogRead(LIGHT_SENSOR_PIN);
}

bool isLightStrong() {
  return currentLight > LIGHT_STRONG_TH;
}

#endif
