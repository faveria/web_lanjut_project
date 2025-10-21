#include <WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>
#include <LiquidCrystal_I2C.h>
#include <PubSubClient.h>

// ======================
// KONFIGURASI WIFI & MQTT
// ======================
const char* ssid = "Z9";
const char* password = "12345678";
const char* mqtt_server = "148.230.97.142";
const char* mqtt_topic_data = "hyyume/sensor/data";
const char* mqtt_topic_pump = "hyyume/sensor/pump"; // topik kontrol pompa

// ======================
// PIN SENSOR & RELAY
// ======================
#define TdsSensorPin 33
#define SensorPin 34
#define ONE_WIRE_BUS 13
#define DHTPIN 4
#define DHTTYPE DHT11
#define RELAY_PIN 26

#define I2C_ADDR 0x27
#define LCD_COLUMNS 16
#define LCD_ROWS 2

// ======================
// OBJEK
// ======================
WiFiClient espClient;
PubSubClient client(espClient);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature ds18b20(&oneWire);
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(I2C_ADDR, LCD_COLUMNS, LCD_ROWS);

// ======================
// VARIABEL SENSOR
// ======================
float airTemp = 25.0;
float airTempDHT = 0;
float airHum = 0;
float tdsValue = 0;
float voltage = 0;
float phValue = 0;
bool pumpState = false;

const float VREF = 3.3;
const int SCOUNT = 15;
int analogBuffer[SCOUNT];
int analogBufferTemp[SCOUNT];
int analogBufferIndex = 0;

int buf[10];
int temp;
unsigned long int avgValuePH;
bool wifiPreviouslyConnected = true;

unsigned long lastDisplaySwitch = 0;
bool showFirstScreen = true;  // bergantian tampilan

// ======================
// FUNGSI MEDIAN FILTER (TDS)
// ======================
int getMedianNum(int bArray[], int iFilterLen) {
  int bTemp[iFilterLen];
  for (byte i = 0; i < iFilterLen; i++) bTemp[i] = bArray[i];
  for (byte j = 0; j < iFilterLen - 1; j++) {
    for (byte i = 0; i < iFilterLen - 1 - j; i++) {
      if (bTemp[i] > bTemp[i + 1]) {
        int temp = bTemp[i];
        bTemp[i] = bTemp[i + 1];
        bTemp[i + 1] = temp;
      }
    }
  }
  if ((iFilterLen & 1) > 0)
    return bTemp[(iFilterLen - 1) / 2];
  else
    return (bTemp[iFilterLen / 2] + bTemp[iFilterLen / 2 - 1]) / 2;
}

// ======================
// FUNGSI BACA pH
// ======================
float readPH() {
  for (int i = 0; i < 10; i++) {
    buf[i] = analogRead(SensorPin);
    delay(10);
  }
  for (int i = 0; i < 9; i++) {
    for (int j = i + 1; j < 10; j++) {
      if (buf[i] > buf[j]) {
        temp = buf[i];
        buf[i] = buf[j];
        buf[j] = temp;
      }
    }
  }
  avgValuePH = 0;
  for (int i = 2; i < 8; i++) avgValuePH += buf[i];
  float voltagePH = (float)avgValuePH * 3.3 / 4095 / 6;
  float phValue = (-7.34 * voltagePH) + 25.42;
  return phValue;
}

// ======================
// CALLBACK MQTT
// ======================
void callback(char* topic, byte* message, unsigned int length) {
  String msg = "";
  for (int i = 0; i < length; i++) {
    msg += (char)message[i];
  }
  msg.trim();

  Serial.print("Pesan dari ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(msg);

  if (String(topic) == mqtt_topic_pump) {
    if (msg.equalsIgnoreCase("ON")) {
      digitalWrite(RELAY_PIN, HIGH);
      pumpState = true;
      Serial.println("💧 Pompa HIDUP (via MQTT)");
    } else if (msg.equalsIgnoreCase("OFF")) {
      digitalWrite(RELAY_PIN, LOW);
      pumpState = false;
      Serial.println("💧 Pompa MATI (via MQTT)");
    }
  }
}

// ======================
// RECONNECT MQTT
// ======================
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Menghubungkan ke MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("Terhubung!");
      client.subscribe(mqtt_topic_pump);
    } else {
      Serial.print("Gagal, rc=");
      Serial.print(client.state());
      Serial.println(" coba lagi 5 detik...");
      delay(5000);
    }
  }
}

// ======================
// SETUP
// ======================
void setup() {
  Serial.begin(115200);
  ds18b20.begin();
  dht.begin();
  lcd.init();
  lcd.backlight();
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // default pompa mati

  lcd.setCursor(0, 0);
  lcd.print("Connecting WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi terkoneksi!");
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("WiFi Connected!");
  lcd.setCursor(0, 1);
  lcd.print(WiFi.localIP().toString());
  delay(2000);
  lcd.clear();

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

// ======================
// LOOP
// ======================
void loop() {
  // === HANDLE WIFI LOST ===
  if (WiFi.status() != WL_CONNECTED) {
    if (wifiPreviouslyConnected) {
      wifiPreviouslyConnected = false;
      if (pumpState) {
        digitalWrite(RELAY_PIN, LOW);
        pumpState = false;
        Serial.println("⚠️ WiFi terputus! Pompa otomatis dimatikan.");
      }
    }
    WiFi.begin(ssid, password);
    delay(1000);
  } else {
    if (!wifiPreviouslyConnected) {
      wifiPreviouslyConnected = true;
      Serial.println("✅ WiFi tersambung kembali. Pompa tetap MATI.");
    }
  }

  // MQTT reconnect
  if (!client.connected() && WiFi.status() == WL_CONNECTED) reconnectMQTT();
  client.loop();

  // ==== BACA SENSOR ====
  ds18b20.requestTemperatures();
  airTemp = ds18b20.getTempCByIndex(0);
  airTempDHT = dht.readTemperature();
  airHum = dht.readHumidity();

  analogBuffer[analogBufferIndex] = analogRead(TdsSensorPin);
  analogBufferIndex++;
  if (analogBufferIndex == SCOUNT) analogBufferIndex = 0;
  for (int i = 0; i < SCOUNT; i++) analogBufferTemp[i] = analogBuffer[i];

  int medianValue = getMedianNum(analogBufferTemp, SCOUNT);
  voltage = medianValue * (VREF / 4095.0);
  float compensationCoefficient = 1.0 + 0.02 * (airTemp - 25.0);
  float compensationVoltage = voltage / compensationCoefficient;
  tdsValue = (133.42 * pow(compensationVoltage, 3)
            - 255.86 * pow(compensationVoltage, 2)
            + 857.39 * compensationVoltage) * 0.5;

  phValue = readPH();

  // ==== SERIAL MONITOR ====
  Serial.print("Udara: "); Serial.print(airTempDHT, 1);
  Serial.print("°C | RH: "); Serial.print(airHum, 1);
  Serial.print("% | Air: "); Serial.print(airTemp, 1);
  Serial.print("°C | TDS: "); Serial.print(tdsValue, 0);
  Serial.print(" ppm | pH: "); Serial.print(phValue, 2);
  Serial.print(" | Pompa: "); Serial.println(pumpState ? "ON" : "OFF");

  // ==== LCD BERGANTIAN ====
  unsigned long currentMillis = millis();
  if (currentMillis - lastDisplaySwitch >= 1500) { // ganti setiap 1,5 detik
    lastDisplaySwitch = currentMillis;
    showFirstScreen = !showFirstScreen;
  }

  lcd.clear();
  if (showFirstScreen) {
    lcd.setCursor(0, 0);
    lcd.print("Ud:");
    lcd.print(airTempDHT, 1);
    lcd.print((char)223);
    lcd.print("C Rh:");
    lcd.print((int)airHum);
    lcd.print("%");

    lcd.setCursor(0, 1);
    lcd.print("pH:");
    lcd.print(phValue, 1);
    lcd.print(" TDS:");
    lcd.print((int)tdsValue);
  } else {
    lcd.setCursor(0, 0);
    lcd.print("Air:");
    lcd.print(airTemp, 1);
    lcd.print((char)223);
    lcd.print("C");

    lcd.setCursor(0, 1);
    lcd.print("Pompa:");
    lcd.print(pumpState ? "ON " : "OFF");
  }

  // ==== KIRIM DATA KE MQTT ====
  if (WiFi.status() == WL_CONNECTED) {
    String payload = "{\"suhu_air\":" + String(airTemp, 1) +
                     ",\"suhu_udara\":" + String(airTempDHT, 1) +
                     ",\"kelembapan\":" + String(airHum, 1) +
                     ",\"tds\":" + String(tdsValue, 0) +
                     ",\"ph\":" + String(phValue, 2) +
                     ",\"pompa\":\"" + String(pumpState ? "ON" : "OFF") + "\"}";
    client.publish(mqtt_topic_data, payload.c_str());
  }

  delay(500);
}
