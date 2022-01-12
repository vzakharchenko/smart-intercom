#include <WiFiManager.h> // https://github.com/tzapu/WiFiManager
#include <ESP8266WebServer.h>
#include <ESP8266HTTPUpdateServer.h>
#include "Storage.h"
#include "SSDP.h"
#define SSDP_DEVICE_TYPE "urn:intercom:device:vzakharchenko:1";

ESP8266WebServer server(80);
ESP8266HTTPUpdateServer httpUpdater;

const String ssdpDeviceType = SSDP_DEVICE_TYPE;

SSDPClass2 SSDP2;

Storage storage;

unsigned long gpioTime = 0;

const char MAIN_page[] PROGMEM = R"=====(
<!DOCTYPE html>
<html>
<body>
<div style="text-align: center;">
    <h1>Intercom Settings</h1><br>
    <form action="/config">
        <label for="fgpio">Gpio number</label><br>
        <input type="number" id="fgpio" name="fgpio" value='GPIO_NUMBER' min="1"><br>
        <label for="level">Gpio Level:</label><br>
        <select id="level" name="level" size="1"><br>
            <option SELECTED_HIGH value="HIGH">HIGH</option><br>
            <option SELECTED_LOW value="LOW">LOW</option><br>
        </select><br>
        <label for="ftimeout">Timeout(seconds)</label><br>
        <input type="number" id="ftimeout" name="ftimeout" value='GPIO_TIMEOUT' min="1"><br>
        <input type="submit" value="Save"><br>
    </form>
    <hr>
    <a href="https://github.com/vzakharchenko/smart-intercom">https://github.com/vzakharchenko/smart-intercom</a>
</div>

</body>
</html>
)=====";


void handleRoot() {

 String s = MAIN_page; //Read HTML contents
 s.replace("GPIO_NUMBER",String(storage.getGpio()));
 s.replace("GPIO_TIMEOUT",String(storage.getGpioTimeout()));
 if (storage.getGpioStateOn() == 0) {
   s.replace("SELECTED_LOW","selected");
   s.replace("SELECTED_HIGH","");
 } else {
   s.replace("SELECTED_LOW","");
   s.replace("SELECTED_HIGH","selected");
 }
 server.send(200, "text/html",s); //Send web page
}

void handleInfo() {
  server.send(200, "application/json", "{\"gpio\":\"" + String(storage.getGpio()) + "\",\"currentTime\":\"" + millis() + "\",\"gpioTime\":" + String(gpioTime) + "}");
}

void handleSaveConfig(){
  String timeoutString = server.arg("ftimeout");


  if (timeoutString != String("")) {
    storage.setGpioTimeout(timeoutString.toInt());
  }
    String levelString = server.arg("level");

  if (levelString != String("LOW")) {
    storage.setGpioStateOn(1);
     storage.setGpioStateOff(0);
  } else {;
     storage.setGpioStateOn(0);
     storage.setGpioStateOff(1);
  }

  String gpioString = server.arg("fgpio");
  
  if (gpioString != String("")) {
    storage.setGpio( gpioString.toInt());
  }
  storage.save();
server.sendHeader("Location", String("/"), true);
server.send ( 302, "text/plain", "");
}

void cors () {
  String origin = server.arg("origin");
  server.sendHeader("Access-Control-Allow-Origin", String(origin));
  server.sendHeader("Access-Control-Max-Age", "10000");
  server.sendHeader("Access-Control-Allow-Credentials", "true");
  server.sendHeader("Access-Control-Allow-Methods", "PUT,POST,GET,OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "*");
}

void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
}

void handleOpen() {

  digitalWrite(storage.getGpio(),  storage.getGpioStateOn());
  String timeoutString = server.arg("timeout");

  int timeout = storage.getGpioTimeout()*1000;
  if (timeoutString != String("")) {
    timeout = timeoutString.toInt();
  }

  gpioTime = millis() + timeout;
  Serial.println ( "Open door for " + String(timeout) + " ms" );
  server.send(200, "application/json", "{\"state\":\"open\",\"timeout\":" + String(timeout) + "}");
}

void handleDescription() {
  SSDP2.schema(server.client());
}

void handleSubscription() {
  Serial.println ( "handleSubscription " );
  server.sendHeader("SID", SSDP2.getUuid());
  server.sendHeader("TIMEOUT", "Second-28800");
  server.send ( 200 );
}

void setup() {
//Serial.begin(115200);
  Serial.end();
  
  WiFi.mode(WIFI_STA);

  WiFiManager wm;
  bool res;
  res = wm.autoConnect("IntercomAP");
  if (!res) {
    Serial.println("Failed to connect");
    ESP.restart();
  }
  else {
    //if you get here you have connected to the WiFi
    Serial.println("connected...yeey :)");
  }

  server.on("/", handleRoot);

  server.on("/open", handleOpen);
  server.on("/config", handleSaveConfig);
  server.on("/info", handleInfo);
    server.on("/description.xml", handleDescription);
  server.on ( "/subscribe", handleSubscription );
  server.onNotFound(handleNotFound);
  cors();
  httpUpdater.setup(&server);
  server.begin();
  Serial.println("HTTP server started");
   storage.load();
  storage.save();

  SSDP2.setSchemaURL("description.xml");
  SSDP2.setHTTPPort(80);
  SSDP2.setName("smart-intercom");
  SSDP2.setSerialNumber("001788102201");
  SSDP2.setURL("index.html");
  SSDP2.setModelName("smart-intercom");
  SSDP2.setModelNumber("smart-intercom");
  SSDP2.setModelURL("https://github.com/vzakharchenko/smart-intercom");
  SSDP2.setManufacturer("SonOff");
  SSDP2.setManufacturerURL("https://github.com/vzakharchenko/smart-intercom");
  SSDP2.setDeviceType(ssdpDeviceType);
  SSDP2.begin();
  Serial.println ( "SSDP2 server started" );


  pinMode(storage.getGpio(), OUTPUT);
  digitalWrite(storage.getGpio(), storage.getGpioStateOff());
}

void loop() {
  // put your main code here, to run repeatedly:
  server.handleClient();

  if (gpioTime > 0) {
    if (gpioTime < millis()) {
      Serial.println ( "reset timer " + gpioTime);
      gpioTime = 0;
      digitalWrite(storage.getGpio(),  storage.getGpioStateOff());
    }
  }

}
