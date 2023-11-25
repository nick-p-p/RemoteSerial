#include "serial2Telnet.h"

serial2Telnet::serial2Telnet() : server(23)
{
}

void serial2Telnet::begin()
{
    Logger::log(l_diagnostics, "serial2Telnet::begin");
    server.begin();
    client = server.available();
}

void serial2Telnet::loop()
{
    if (!disconnected())
    {
        while (Serial.available())
        {
            int c = Serial.read();
            if (c != -1)
            {
                client.write((char)c);
            }
            if (c == 10)
            {
                client.flush();
            }
        }
    }
}

boolean serial2Telnet::disconnected()
{
    if (!server)
    {
        Serial.println("S2T no server");
        return true;
    }

    if (!client)
    {
        client = server.available();
    }

    if (client)
    {
        if (client.connected())
        {
            return false;
        }
        client.stop();
        client = server.available();
        return !(client && client.connected());
    }

    return true;
}