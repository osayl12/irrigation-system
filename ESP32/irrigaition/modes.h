#ifndef MODES_H
#define MODES_H

#include <time.h>
#include "sensors.h"
#include "pump.h"

extern PubSubClient mqtt;

/* ===== WATER CONSUMPTION ===== */
// כמה ליטר לדקה המשאבה שלך (תמדוד או תעריך)
// לדוגמה: 2.0 L/min
#define PUMP_LITERS_PER_MIN 2.0

/* ===== TEMP MODE SCHEDULE ===== */
int tempTimes = 0;
int tempDurationMin = 0;
int tempDoneToday = 0;
unsigned long tempStartMillis = 0;
bool tempRunning = false;

/* ===== STATE ===== */
String currentMode = "MANUAL";
bool forceOverride = false;
bool manualOverrideOff = false;

/* ===== SHABBAT ===== */
int shabbatTimes = 0;
int shabbatDurationMin = 0;
int shabbatDoneToday = 0;
unsigned long shabbatStartMillis = 0;
bool shabbatRunning = false;
bool shabbatScheduleActive = false;

/* ===== STATUS ===== */
void publishModeStatus() {
  mqtt.publish(TOPIC_MODE, currentMode.c_str(), true);
}

/* ===== SHABBAT MODE ===== */
void handleShabbatMode() {
  if (!shabbatScheduleActive) return;


  if (!shabbatRunning && shabbatDoneToday < shabbatTimes) {
    turnPumpOn();
    shabbatStartMillis = millis();
    shabbatRunning = true;
  }

  /* --- סיום השקיה --- */
  if (shabbatRunning && millis() - shabbatStartMillis >= (unsigned long)shabbatDurationMin * 60000UL) {

    turnPumpOff();
    shabbatRunning = false;
    shabbatDoneToday++;
  }

  // איפוס אמיתי לפי תאריך (בחצות)
  static int lastYday = -1;  // day-of-year האחרון שראינו

  struct tm timeinfo;
  if (getLocalTime(&timeinfo)) {
    if (lastYday == -1) {
      lastYday = timeinfo.tm_yday;  // אתחול פעם ראשונה
    } else if (timeinfo.tm_yday != lastYday) {
      // התאריך התחלף => עברנו חצות
      shabbatDoneToday = 0;
      lastYday = timeinfo.tm_yday;
    }
  }
}

/* ===== MAIN MODE HANDLER ===== */
void handleMode() {

  /* ===== SHABBAT ===== */
  if (currentMode == "SHABBAT") {
    handleShabbatMode();
    return;
  }

  // אם המשתמש כיבה ידנית – לא עושים כלום
  if (manualOverrideOff) return;

  switch (currentMode[0]) {

    case 'M':  // MANUAL
      // השליטה נעשית דרך MQTT (TOPIC_PUMP)
      break;

    case 'T':  // TEMP
      if (!tempRunning && tempDoneToday < tempTimes && !isLightStrong()) {
        turnPumpOn();
        tempStartMillis = millis();
        tempRunning = true;
      }

      if (tempRunning && millis() - tempStartMillis >= (unsigned long)tempDurationMin * 60000UL) {

        turnPumpOff();
        tempRunning = false;
        tempDoneToday++;
      }
      break;

    case 'S':  // SOIL
      if (!pumpOn && currentSoil <= SOIL_DRY_ON && !isLightStrong())
        turnPumpOn();

      if (pumpOn && currentSoil >= SOIL_WET_OFF)
        turnPumpOff();
      break;
  }
}

#endif
