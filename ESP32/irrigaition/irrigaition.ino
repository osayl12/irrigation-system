#include "config.h"
#include "wifi_mqtt.h"
#include "modes.h"

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  // מצב בטוח: משאבה כבויה
  digitalWrite(RELAY_PIN, HIGH);

  Serial.begin(115200);
  dht.begin();

  connectWiFi();
  connectMQTT();

  // קריאה ראשונית כדי לקבוע ברירת מחדל לפי חום (לא קשור לשבת)
  readSensors();

  // ברירת מחדל: רגיל 2x120, חם 3x180
  if (!isnan(currentTemp) && currentTemp >= TEMP_HIGH_TH) {
    shabbatTimes = DEFAULT_TIMES_HOT;
    shabbatDurationMin = DEFAULT_DURATION_HOT;
  } else {
    shabbatTimes = DEFAULT_TIMES_NORMAL;
    shabbatDurationMin = DEFAULT_DURATION_NORMAL;
  }

  // מצב שמרני: מצב שבת לא ירוץ עד SAVE
  shabbatScheduleActive = false;

  publishModeStatus();
  publishPumpStatus();
  publishSensors();
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
         "\"light_raw\":" + String(currentLight) + "}").c_str(),
        true
      );
    }
  }

  handleMode();

  static unsigned long lastPub = 0;
  if (millis() - lastPub >= 3000) {
    publishSensors();
    publishPumpStatus();
    publishModeStatus();
    lastPub = millis();
  }
}
