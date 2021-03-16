#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <FirebaseArduino.h>
#include <Servo.h>

#define rele 12 //D6
#define rele_luz 13 //D7
#define serv 14 //12

Servo servo;
WiFiUDP udp, udp2;
String atual, proxima, button, oxigenio, luz;

NTPClient timeClient(udp, "a.st1.ntp.br" , -3 * 3600, 60000);
NTPClient timeClient2(udp2, "a.st1.ntp.br", 5 * 3600, 60000);

void setup() {
  pinMode(rele, OUTPUT); // Declara o relé como uma saída
  pinMode(rele_luz, OUTPUT); // Declara o relé luz  como uma saída

  digitalWrite(rele, HIGH); // Deixa o rele desativado mesmo estando em HIGH ele considera o inverso
  digitalWrite(rele_luz, HIGH); // Deixa a luz desativada

  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin("RedeWifi", "SenhaWifi");

 while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println(".");
  }

  Serial.println("");
  Serial.print("Conectado! O endereço IP é: ");
  Serial.print(WiFi.localIP());
 

  Firebase.begin("CaminhoDBFirebase", "SenhaDBFirebase");
  timeClient.begin();

}

void girar() {

  servo.attach(serv); //12
  for (int i = 0; i < 1; i++) {
    servo.write(183);
    delay(1000);
    servo.write(3);
    delay(1000);
  }
  servo.detach();

}

void historico() {

  atual = Firebase.getString("Dados/Atual");
  proxima = Firebase.getString("Dados/Proxima");

  Firebase.pushString("Historico/Atual" , atual);
  Firebase.pushString("Historico/Proxima" , proxima);
}

void loop() {

  timeClient.update();
  timeClient2.update();

  if (Firebase.getString("Alimentar/Acao") == "Comida") {
    girar();
    Firebase.setString("Alimentar/Acao", "");
    historico();
  }

  String formattedDate = timeClient.getFormattedDate();

  String dia = formattedDate.substring(0, 10);
  String tempo = timeClient.getFormattedTime().substring(0, 5);
  String AtualCompleto = (dia + " H: " + tempo);
  String getfirebase = Firebase.getString("Dados/Proxima");

  String prxhora = timeClient2.getFormattedTime().substring(0, 5);
  String prxCompleto = (dia + " H: " + prxhora);


  if (AtualCompleto == getfirebase) {
    girar();
    Firebase.setString("Dados/Atual", AtualCompleto);
    Firebase.setString("Dados/Proxima", prxCompleto);
    historico();

    delay(60000);
  }

  button = Firebase.getString("Button/Acao");
  luz = Firebase.getString("Luz/Acao");
  oxigenio = Firebase.getString("Oxigenio/Acao");


  if (button == "Automático") {

    if (tempo >= "07:00" && tempo <= "21:59") {
      digitalWrite(rele, LOW);// bomba de oxigênio liga
    }
    else {
      digitalWrite(rele, HIGH);
    }

    if ((tempo <= "04:30") || (tempo >= "18:30" && tempo <= "23:59")) {
      digitalWrite(rele_luz,  LOW); // led liga
    }
    else {
      digitalWrite(rele_luz, HIGH);
    }
  }

  if (luz == "On") {
    digitalWrite(rele_luz, LOW);
  }

  if (luz == "Off") {
    digitalWrite(rele_luz, HIGH);
  }

  if (oxigenio == "Off") {
    digitalWrite(rele, HIGH);
  }

  if (oxigenio == "On") {
    digitalWrite(rele, LOW);
  }

  delay(200);

}
