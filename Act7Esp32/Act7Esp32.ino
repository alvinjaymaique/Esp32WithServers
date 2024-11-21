#include <WiFi.h>
#include <HTTPClient.h>

#define LED1 32
#define LED2 33
#define LED3 25
#define LED4 26
int LEDS[] = {LED1, LED2, LED3, LED4};
int numLeds = sizeof(LEDS)/sizeof(LEDS[0]);

const char* ssid = "Galaxy A10D96E";
const char* password = "qrui6866";
// const char* serverName = "http://192.168.1.7:3000/update";
const int port1 = 3000;
const int port2 = 3001;
const int port3 = 3002;
const String serverName = "http://192.168.1.7:";
HTTPClient http1, http2, http3;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200); WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { 
    delay(500);
    Serial.print(".");
    Serial.println("Connected to WiFi");
    }
  for (int i=0; i<numLeds; i++){
    pinMode(LEDS[i], INPUT);
  }
  
}

void sendToAllServers(){
  sendToServer(3000);
  sendToServer(3001);
  sendToServer(3002);
}

void sendToServer(int port) {
  String serverName = "http://192.168.1.7:" + String(port) + "/update";
  int randomValue = random(0, 1000);
  HTTPClient http;
  http.begin(serverName);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  int httpResponseCode = http.POST("value=" + String(randomValue));

  if (httpResponseCode == 200) {
    Serial.print("HTTP Response code: ");
    Serial.print(httpResponseCode);
    String responseBody = http.getString();
    Serial.print("   Response: ");
    Serial.println(responseBody);
  } else {
    Serial.print("HTTP Request failed with code: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}



void loop() {
  // put your main code here, to run repeatedly:
  int server1State = digitalRead(LEDS[0]);
  int server2State = digitalRead(LEDS[1]);
  int server3State = digitalRead(LEDS[2]);
  int server4State = digitalRead(LEDS[3]);
  Serial.print(server1State);
  Serial.print(server2State);
  Serial.print(server3State);
  Serial.print(server4State);
  if(WiFi.status() == WL_CONNECTED) {
    if(server4State == HIGH){
      sendToAllServers();
    }else{
      if(server1State == HIGH) sendToServer(3000);
      if(server2State == HIGH) sendToServer(3001);
      if(server3State == HIGH) sendToServer(3002);
    }

  }
  delay(5000);
}
