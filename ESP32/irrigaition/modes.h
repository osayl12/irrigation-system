#ifndef MODES_H
#define MODES_H

#include <time.h>
#include "sensors.h"
#include "pump.h"

extern PubSubClient mqtt;

/* ===== STATE ===== */
String currentMode = "MANUAL";
bool forceOverride = false;
bool manualOverrideOff = false;

/* =========================================================
   TEMP MODE 
   חם: 3 פעמים ביום, 3 שעות
   קר: 2 פעמים ביום, 2 שעות
   + הגנת אור: לא להתחיל באור חזק
   + איפוס בחצות
   ========================================================= */

int tempTimes = 0;
int tempDurationMin = 0;

static int tempLastYday = -1;
static bool tempTriggered[3] = { false, false, false };  // עד 3 פעמים ביום
static unsigned long tempStartMillis = 0;
static bool tempRunning = false;

// שעות קבועות להשקיות TEMP (בחרתי זמנים סבירים: בוקר/צהריים/ערב)
// חם: 3 פעמים
static const int HOT_HOURS[3]  = { 6, 12, 18 }; 
// קר: 2 פעמים
static const int COLD_HOURS[2] = { 7, 19 };

void updateTempPlan() {
  if (!isnan(currentTemp) && currentTemp >= TEMP_HIGH_TH) {
    tempTimes = 3;
    tempDurationMin = 180;  // 3 שעות
  } else {
    tempTimes = 2;
    tempDurationMin = 120;  // 2 שעות
  }
}

void resetTempDailyIfNeeded(const struct tm& timeinfo) {
  if (tempLastYday == -1) tempLastYday = timeinfo.tm_yday;
  if (timeinfo.tm_yday != tempLastYday) {
    tempLastYday = timeinfo.tm_yday;
    tempTriggered[0] = tempTriggered[1] = tempTriggered[2] = false;
    tempRunning = false;
  }
}

void handleTempMode() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return;

  resetTempDailyIfNeeded(timeinfo);
  updateTempPlan();

  // הגנת אור: לא להתחיל אם אור חזק
  if (isLightStrong()) return;

  // אם כבר משקים: לבדוק סיום
  if (tempRunning) {
    if (millis() - tempStartMillis >= (unsigned long)tempDurationMin * 60000UL) {
      turnPumpOff();
      tempRunning = false;
    }
    return;
  }

  // לא משקים כרגע: לבדוק אם הגיע הזמן של השקיה הבאה
  int h = timeinfo.tm_hour;
  int idx = -1;

  if (tempTimes == 3) {
    for (int i = 0; i < 3; i++)
      if (h == HOT_HOURS[i]) idx = i;
  } else {
    for (int i = 0; i < 2; i++)
      if (h == COLD_HOURS[i]) idx = i;
  }

  if (idx == -1) return;
  if (tempTriggered[idx]) return;

  // להפעיל פעם אחת בשעה הזו
  turnPumpOn();
  tempStartMillis = millis();
  tempRunning = true;
  tempTriggered[idx] = true;
}

/* =========================================================
   SOIL MODE
   מפעיל כשיבש, מכבה כשחוזר לערך הרצוי
   + לא מתחיל באור חזק
   ========================================================= */
void handleSoilMode() {
  if (!pumpOn && currentSoil <= SOIL_DRY_ON && !isLightStrong()) {
    turnPumpOn();
  }
  if (pumpOn && currentSoil >= SOIL_WET_OFF) {
    turnPumpOff();
  }
}

/* =========================================================
   SHABBAT / SCHEDULED MODE (לפי בחירת משתמש)
   Start/End/Times/Duration
   לא תלוי חיישנים
   + איפוס בחצות
   ========================================================= */

int shabbatTimesCount = 0;
int shabbatDurationMin = 0;
int shabbatDoneToday = 0;
unsigned long shabbatStartMillis = 0;
bool shabbatRunning = false;
bool shabbatScheduleActive = false;

int shabbatStartMin = 0;
int shabbatEndMin = 0;

void handleShabbatMode() {
  if (!shabbatScheduleActive) return;

  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return;

  // איפוס בחצות
  static int lastYday = -1;
  if (lastYday == -1) lastYday = timeinfo.tm_yday;
  else if (timeinfo.tm_yday != lastYday) {
    shabbatDoneToday = 0;
    shabbatRunning = false;
    lastYday = timeinfo.tm_yday;
  }

  int nowMin = timeinfo.tm_hour * 60 + timeinfo.tm_min;

  // מחוץ לטווח זמן שהלקוח בחר
  if (nowMin < shabbatStartMin || nowMin > shabbatEndMin) return;

  if (shabbatTimesCount <= 0 || shabbatDurationMin <= 0) return;

  int window = shabbatEndMin - shabbatStartMin;
  if (window <= 0) return;

  int gap = window / shabbatTimesCount;
  if (gap <= 0) gap = 1;

  int slotMin = shabbatStartMin + (shabbatDoneToday * gap);

  // התחלת השקיה
  if (!shabbatRunning && shabbatDoneToday < shabbatTimesCount && nowMin >= slotMin) {
    turnPumpOn();
    shabbatStartMillis = millis();
    shabbatRunning = true;
  }

  // סיום השקיה
  if (shabbatRunning && millis() - shabbatStartMillis >= (unsigned long)shabbatDurationMin * 60000UL) {
    turnPumpOff();
    shabbatRunning = false;
    shabbatDoneToday++;
  }
}

/* ===== STATUS ===== */
void publishModeStatus() {
  mqtt.publish(TOPIC_MODE, currentMode.c_str(), true);
}

/* =========================================================
   MAIN MODE HANDLER
   ========================================================= */
void handleMode() {
  // מצב מתוזמן
  if (currentMode == "SHABBAT") {
    handleShabbatMode();
    return;
  }

  // אם המשתמש כיבה ידנית – לא עושים כלום
  if (manualOverrideOff) return;

  switch (currentMode[0]) {
    case 'M':  // MANUAL
      // שליטה נעשית דרך MQTT (TOPIC_PUMP)
      break;

    case 'T':  // TEMP
      handleTempMode();
      break;

    case 'S':  // SOIL
      handleSoilMode();
      break;
  }
}

#endif
