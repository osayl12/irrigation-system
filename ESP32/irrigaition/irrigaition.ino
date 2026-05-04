
/*
פרויקט : Irrigation System

שם מלא: דינה נאש
ת.ז: 311487185

שם מלא : אוסיל חאמד
ת.ז: 208913798

*/

#include "config.h"
#include "wifi_mqtt.h"
#include <time.h>
#include "modes.h"

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  // מצב בטוח: משאבה כבויה
  digitalWrite(RELAY_PIN, HIGH);

  Serial.begin(115200);
  dht.begin();

  connectWiFi();
  connectMQTT();

  // Israel time – handles DST automatically (UTC+2 winter, UTC+3 summer)
  configTzTime("IST-2IDT,M3.4.4/2,M10.5.0", "pool.ntp.org", "time.nist.gov");

  struct tm timeinfo;
  for (int i = 0; i < 20; i++) {
    if (getLocalTime(&timeinfo)) break;
    delay(500);
  }

  // קריאה ראשונית כדי לקבוע ברירת מחדל לפי חום (לא קשור לשבת)
  readSensors();
  publishSensors();

  if (!isnan(currentTemp) && currentTemp >= TEMP_HIGH_TH) {
    tempTimes = 3;
    tempDurationMin = 180;
  } else {
    tempTimes = 2;
    tempDurationMin = 120;
  }

  // מצב שמרני: מצב שבת לא ירוץ עד SAVE
  shabbatScheduleActive = false;

  publishModeStatus();
  publishPumpStatus();
}

void loop() {
  mqtt.loop();
  readSensors();

  // הגנת אור – לא בשבת, ולא במצב ידני בכפייה
  if (currentMode != "SHABBAT" && currentMode != "MANUAL") {
    if (isLightStrong() && pumpOn && !forceOverride) {
      turnPumpOff();
      mqtt.publish(
        TOPIC_WARN,
        ("{\"message\":\"Pump stopped – strong light\","
         "\"type\":\"LIGHT\","
         "\"light_raw\":"
         + String(currentLight) + "}")
          .c_str(),
        true);
    }
  }

  handleMode();

  static unsigned long lastPub = 0;
  if (millis() - lastPub >= 1000) {
    publishSensors();
    publishPumpStatus();
    publishModeStatus();
    lastPub = millis();
  }
}
