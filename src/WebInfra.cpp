#include "WebInfra.h"

WebInfra::WebInfra()
{
}

void WebInfra::startSerial()
{
    serialLog.begin();
}

void WebInfra::setup(void (*netMessageCallback)(NetMessage, const char *) )
{

    serialLog.begin();
    if (!SPIFFS.begin())
    {
        Logger::log(l_warning, "Formatting file system");
        SPIFFS.format();
        SPIFFS.begin();
    }
    

    Logger::setLevel(l_diagnostics);
    registerComponents();

    if (netMessageCallback != nullptr)
    {
        network.setMessageCallback(netMessageCallback);
    }
    else
    {
        network.setMessageCallback(handleNetworkMessage);
    }

    infra.begin(STRINGIFY(HOST_NAME), network, hallSensor.sensing());

    BDLanguage::addLanguage("en", "English", "/web/en/usertext.txt", nullptr); // no system file for english

    
}

void WebInfra::loop()
{
#ifdef TRACE_METHODS        
     Logger::log(l_diagnostics, "WebInfra::loop()");
#endif     
    network.loop();
    
}



bool WebInfra::restartNeeded()
{
    return BDWebServer::restartNeeded();
}

void WebInfra::registerComponents()
{
    serialLog.registerComponent();
    // telnetLog.registerComponent();
    // webLogger.registerComponent();
    // fileLog.registerComponent();
    // fileLogUI.registerComponent();
    eSPInfo.registerComponent();
    wifiHandler.registerComponent();
    bDTimeZone.registerComponent();
    bDTimeZoneUI.registerComponent();
    locale.registerComponent();
    loggerConfig.registerComponent();
    filesUI.registerComponent();
}

void WebInfra::handleNetworkMessage(NetMessage netMessage, const char *msg)
{
  Logger::log(l_info, "%s:%d", msg, (int)netMessage);
}