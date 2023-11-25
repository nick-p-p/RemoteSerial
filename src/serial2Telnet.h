#pragma once
#include <Arduino.h>
#include <Logger.h>

#include <WiFi.h>

class serial2Telnet
{
public:
    serial2Telnet();
    /**
     * initializee the networking so telnet clients can connect
     */
    void begin();

    void loop();

private:
    boolean disconnected();


    WiFiServer server;
    WiFiClient client;
};