#pragma once
#include <DHT.h>
#include "config.h"

static DHT dht(DHT_PIN, DHT11);

inline void initSensors() {
  dht.begin();
}

inline float readTemp() {
  float t = dht.readTemperature();
  return isnan(t) ? -1000 : t;
}

inline int readSoil() {
  return analogRead(SOIL_SENSOR_PIN);
}

inline int readLight() {
  return analogRead(LIGHT_SENSOR_PIN);
}
