#ifndef MODES_H
#define MODES_H

#include "sensors.h"
#include "pump.h"

extern PubSubClient mqtt;

/* ===== STATE ===== */
String currentMode = "MANUAL";
bool forceOverride = false;
bool manualOverrideOff = false;

/* ===== SCHEDULED ("SHABBAT") ===== */
int shabbatTimes = DEFAULT_TIMES_NORMAL;
int shabbatDurationMin = DEFAULT_DURATION_NORMAL;
int shabbatDoneToday = 0;

unsigned long shabbatStartMillis = 0;
bool shabbatRunning = false;

// מתחיל לרוץ רק אחרי SAVE מה-WEB
bool shabbatScheduleActive = false;

/* ===== STATUS ===== */
void publishModeStatus() {
  mqtt.publish(TOPIC_MODE, currentMode.c_str(), true);
}

/* ===== SHABBAT MODE ===== */
void handleShabbatMode() {
  if (!shabbatScheduleActive) return;  

  unsigned long now = millis();

  if (!shabbatRunning && shabbatDoneToday < shabbatTimes) {
    turnPumpOn();
    shabbatStartMillis = now;
    shabbatRunning = true;
  }

  if (shabbatRunning &&
      now - shabbatStartMillis >= (unsigned long)shabbatDurationMin * 60000UL) {

    turnPumpOff();
    shabbatRunning = false;
    shabbatDoneToday++;
  }

  // איפוס "יומי" לפי millis 
  static unsigned long lastReset = 0;
  if (now - lastReset >= 86400000UL) {
    shabbatDoneToday = 0;
    lastReset = now;
  }
}

/* ===== MAIN MODE HANDLER ===== */
void handleMode() {

  static bool wasShabbat = false;

  /* ===== SHABBAT ===== */
  if (currentMode == "SHABBAT") {

    // איפוס override-ים
    manualOverrideOff = false;
    // במצב שבת לא משחקים בכפייה/ידני
    forceOverride = false;

    // כניסה חדשה לשבת
    if (!wasShabbat) {
      shabbatRunning = false;
      shabbatDoneToday = 0;
    }

    wasShabbat = true;
    handleShabbatMode();
    return;
  }

  wasShabbat = false;

  /* ===== NON-SHABBAT ===== */
  if (manualOverrideOff) return;

  switch (currentMode[0]) {
    case 'M': // MANUAL
      // השליטה נעשית ב-mqttCallback דרך TOPIC_PUMP
      break;

    case 'T': // TEMP
      if (!isnan(currentTemp) && currentTemp >= TEMP_HIGH_TH && !isLightStrong())
        turnPumpOn();
      else
        turnPumpOff();
      break;

    case 'S': // SOIL
      if (currentSoil <= SOIL_DRY_TH && !isLightStrong())
        turnPumpOn();
      else
        turnPumpOff();
      break;
  }
}

#endif
