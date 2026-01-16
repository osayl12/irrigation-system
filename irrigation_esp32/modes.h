#pragma once
#include "sensors.h"
#include "pump.h"
#include "config.h"

static String currentMode = "MANUAL";
static unsigned long lastSoilMs = 0;
static unsigned long lastTempMs = 0;

inline void runModes() {

  switch (currentMode[0]) {

    /* ===== MANUAL ===== */
    case 'M':
  // MANUAL MODE
  // אין קוד כאן בכוונה
  // המשאבה נשלטת רק דרך MQTT      break;

    /* ===== TEMP ===== */
    case 'T': {
      float t = readTemp();
      int light = readLight();
      if (t < TEMP_HIGH_TH || light > LIGHT_STRONG_TH) break;

      if (millis() - lastTempMs > 15UL * 60UL * 1000UL && !pumpOn) {
        int min = (t >= 35) ? 3 : (t >= 32) ? 2 : 1;
        pumpDurationMs = min * 60UL * 1000UL;
        setPump(true);
        lastTempMs = millis();
      }
      break;
    }

    /* ===== SOIL ===== */
    case 'S': {
      int soil = readSoil();
      int light = readLight();
      bool dry = soil <= SOIL_DRY_TH;

      if (dry && light < LIGHT_STRONG_TH &&
          millis() - lastSoilMs > 10UL * 60UL * 1000UL &&
          !pumpOn) {

        pumpDurationMs = 60UL * 1000UL;
        setPump(true);
        lastSoilMs = millis();
      }
      break;
    }

    /* ===== SHABBAT ===== */
  case 'H': {
  int nowMin = minutesNow();
  if (nowMin < 0) break;

  int startMin = minutesOf(scheduleCfg.startHour, scheduleCfg.startMin);
  int endMin   = minutesOf(scheduleCfg.endHour, scheduleCfg.endMin);

  if (nowMin < startMin || nowMin >= endMin) {
    if (pumpOn) setPump(false);
    break;
  }

  float t = readTemp();
  bool hot = (t >= TEMP_HIGH_TH);

  int timesPerDay = hot ? 3 : 2;
  int durationMin = hot ? 180 : 120;

  int windowMin = endMin - startMin;
  int slotSize  = windowMin / timesPerDay;

  int slotIndex = (nowMin - startMin) / slotSize;
  if (slotIndex >= timesPerDay) slotIndex = timesPerDay - 1;

  int slotStart = startMin + slotIndex * slotSize;
  int slotEnd   = slotStart + durationMin;

  if (nowMin >= slotStart && nowMin < slotEnd) {
    if (!pumpOn) setPump(true);
  } else {
    if (pumpOn) setPump(false);
  }

  break;
}

  }

  updatePumpTimer();
}
