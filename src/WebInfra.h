#pragma once
#include <Arduino.h>

#define STRINGIFY(s) STRINGIFY1(s)
#define STRINGIFY1(s) #s

/**
 * TCP/IP host name for the web site
 */
// #define HOST_NAME "WaterControl" moved to platformio.ini

/* --------------- INFRA --------------------- */
#include <BDInfra.h>
#include <BDWebServer.h>
#include <BDLanguage.h>



/* --------------- NETWORK --------------------- */
#include <MyWifiNetwork.h>
#include <WifiHandler.h>
/* --------------- LOGGING --------------------- */
#include <SerialLog.h>
// #include <TelnetLog.h>
#include <LoggerConfig.h>
// #include <WebLogger.h>
// #include <FileLog.h>


/* --------------- TIME ZONE AND LOCALE --------------------- */
#include <BDLocale.h>
#include <BDTimeZone.h>
#include <BDTimeZoneUI.h>

/* --------------- HALL SENSOR ---------------- */
#include <HallSensor.h>

/* --------------- EXTRAS --------------------- */
#include <ESPInfo.h>
#include <FilesUI.h>


// /* ----------------STATE -----------------------*/
// #include "common/SharedState.h"

class WebInfra
{

public:
    WebInfra();

    void startSerial();

    void setup(void (*netMessageCallback)(NetMessage, const char *) = nullptr);

    void loop();

    bool restartNeeded();

private:
    void registerComponents();

    static void handleNetworkMessage(NetMessage netMessage, const char *msg);

    /**
     * @brief Wifi network with optional LED to indicate in hotspot mode
     */
    MyWifiNetwork network = MyWifiNetwork(nullptr);

    WifiHandler wifiHandler;

    /**
     * @brief infra that starts the web server and calls optional components as required
     */
    BDInfra infra;

    WiFiClient wifiClient;
    
    /**
     * @brief logger to the serial port
     */
    SerialLog serialLog = SerialLog(&Serial);

    /**
     * @brief logger to telnet clients
     */
    // TelnetLog telnetLog;

    /**
     * @brief logger using a websocket
     */
    // WebLogger webLogger;

    /**
     * @brief logger to SPIFFS file with maxEntries and days to retain
     */
    // FileLog fileLog = FileLog("/filelog.txt", 60, 30);

    /**
     * @brief UI for the file logger
     */
    // FileLogUI fileLogUI = FileLogUI(&fileLog);

    /**
     * @brief backend to info.htm that gives details of the ESP32
     */
    ESPInfo eSPInfo;

    /**
     * @brief backend for setting things like units of temperature, length, date order
     */
    BDLocale locale;

    /**
     * @brief backend for time zone handling
     */
    BDTimeZone bDTimeZone;

    /**
     * @brief web support for managing time zones
     */
    BDTimeZoneUI bDTimeZoneUI;

    /**
     * @brief web support for configuring logging level
     */
    LoggerConfig loggerConfig;

    /**
     * @brief web support uploading / downloading files inc firmware
     */
    FilesUI filesUI;

    /**
     * @brief wrapper for the internal hall sensor
     */
    HallSensor hallSensor = HallSensor(90, -90);



};
