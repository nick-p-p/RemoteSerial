#include <Arduino.h>

#define FW_VERSION "2023-01-06 01"
#define SERIAL_BUFFER_SIZE  1024

// Includes so dependencies work
#include <SPIFFS.h>
#include <ETH.h>

#include "WebInfra.h"
WebInfra webInfra;

#include "serial2Telnet.h"
serial2Telnet s2t;

void setup() {
  Serial.setRxBufferSize(SERIAL_BUFFER_SIZE);
  Serial.begin(115200);
  webInfra.setup(nullptr);
  s2t.begin();
}

void loop() {
  s2t.loop();
  delay(10);
}

