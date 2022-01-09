#include <WiFiManager.h> // https://github.com/tzapu/WiFiManager
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ESP8266HTTPUpdateServer.h>

ESP8266WebServer server(80);
ESP8266HTTPUpdateServer httpUpdater;

const int gpio = 16;
unsigned long gpioTime = 0;

const int GPIO_STATE_ON = 1;
const int GPIO_STATE_OFF = 0;

void handleRoot() {
  server.send(200, "text/plain", "hello from Intercom!\r\n");
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

  digitalWrite(gpio, GPIO_STATE_ON);
  String timeoutString = server.arg("timeout");

  int timeout = 30000;
  if (timeoutString != String("")) {
    timeout = timeoutString.toInt();
  }

  gpioTime = millis() + timeout;
  Serial.println ( "Open door for " + String(timeout) + " ms" );
  server.send(200, "application/json", "{\"state\":\"open\",\"timeout\":" + String(timeout) + "}");
}



void setup() {
  pinMode(gpio, OUTPUT);
  digitalWrite(gpio, GPIO_STATE_OFF);
  WiFi.mode(WIFI_STA);
  Serial.begin(9600);
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

  if (MDNS.begin("intercom")) {
    Serial.println("MDNS responder started");
  }


  server.on("/", handleRoot);

  server.on("/open", handleOpen);

  server.onNotFound(handleNotFound);
  cors();
  httpUpdater.setup(&server);
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  // put your main code here, to run repeatedly:
  server.handleClient();
  MDNS.update();
  if (gpioTime > 0) {
    if (gpioTime < millis()) {
      Serial.println ( "reset timer " + gpioTime);
      gpioTime = 0;
      digitalWrite(gpio, GPIO_STATE_OFF);
    }
      delay(1000);
  }
 
}
