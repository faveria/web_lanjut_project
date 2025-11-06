/*
  ESP32 Hydroponic - Temporary captive portal (no save)
  - Hotspot: "Hydroponic_Config" (password "12345678")
  - Captive portal (DNS redirect) so phone opens the page automatically
  - After user input SSID+PASS, ESP tries to connect as STA (not saved)
  - If connect success -> wait 2 seconds, close portal, continue normal operation
  - If fail -> return to AP portal
  - Existing sensor/MQTT/relay code unchanged in behavior (only WiFi handling added)
*/

#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>
#include <LiquidCrystal_I2C.h>
#include <PubSubClient.h>
#include <Preferences.h> // kept though we won't save credentials

// ======================
// KONFIGURASI MQTT & TOPIC (tidak diubah)
// ======================
const char* mqtt_server = "148.230.97.142";
const char* mqtt_topic_data = "hyyume/sensor/data";
const char* mqtt_topic_pump = "hyyume/sensor/pump";

// ======================
// PIN SENSOR & RELAY (tidak diubah)
// ======================
#define TdsSensorPin 33
#define PH_SENSOR_PIN 34
#define ONE_WIRE_BUS 19
#define DHTPIN 4
#define DHTTYPE DHT22
#define RELAY_PIN 5

#define I2C_ADDR 0x27
#define LCD_COLUMNS 16
#define LCD_ROWS 2

// ======================
WebServer server(80);
DNSServer dnsServer;            // untuk captive portal redirect
WiFiClient espClient;
PubSubClient client(espClient);

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature ds18b20(&oneWire);
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(I2C_ADDR, LCD_COLUMNS, LCD_ROWS);

Preferences preferences; // not used to store WiFi creds

// ======================
float airTemp = 25.0;
float airTempDHT = 0;
float airHum = 0;
float tdsValue = 0;
float phValue = 0;
bool pumpState = false;

const float VREF = 3.3;
const int SCOUNT = 15;
int analogBuffer[SCOUNT];
int analogBufferIndex = 0;

float calibration_value = 22.81; // kalibrasi pH

bool wifiConnected = false;
bool wifiPreviouslyConnected = false;
unsigned long lastSensorRead = 0;
unsigned long lastLcdUpdate = 0;
unsigned long lastMqttSend = 0;
bool showFirstScreen = true;
unsigned long lastPumpOffTime = 0; // waktu terakhir pompa dimatikan

// ======================
// Captive portal variables
// ======================
const char* apSSID = "HyYume_Config";
const char* apPASS = "12345678";
IPAddress apIP(192,168,4,1);
const byte DNS_PORT = 53;

String inputSSID = "";
String inputPASS = "";
volatile bool gotWiFiCredentials = false;
volatile bool tryingToConnect = false;

// ======================
// FILTER MEDIAN
// ======================
int getMedianNum(int bArray[], int iFilterLen) {
  int bTemp[iFilterLen];
  memcpy(bTemp, bArray, iFilterLen * sizeof(int));
  for (int j = 0; j < iFilterLen - 1; j++)
    for (int i = 0; i < iFilterLen - 1 - j; i++)
      if (bTemp[i] > bTemp[i + 1]) {
        int tmp = bTemp[i];
        bTemp[i] = bTemp[i + 1];
        bTemp[i + 1] = tmp;
      }
  if (iFilterLen & 1)
    return bTemp[(iFilterLen - 1) / 2];
  else
    return (bTemp[iFilterLen / 2] + bTemp[iFilterLen / 2 - 1]) / 2;
}

// ======================
// BACA SENSOR pH
// ======================
float readPH() {
  int buffer_arr[10];
  for (int i = 0; i < 10; i++) {
    buffer_arr[i] = analogRead(PH_SENSOR_PIN);
    delay(20);
  }
  for (int i = 0; i < 9; i++)
    for (int j = i + 1; j < 10; j++)
      if (buffer_arr[i] > buffer_arr[j]) {
        int tmp = buffer_arr[i];
        buffer_arr[i] = buffer_arr[j];
        buffer_arr[j] = tmp;
      }
  unsigned long int avgval = 0;
  for (int i = 2; i < 8; i++) avgval += buffer_arr[i];
  float volt = (float)avgval * 3.3 / 4095.0 / 6;
  return -5.70 * volt + calibration_value;
}

// ======================
// MQTT functions (tidak diubah)
// ======================
void sendPumpStatus() {
  if (wifiConnected) {
    String payload = "{\"suhu_air\":" + String(airTemp, 1) +
                     ",\"suhu_udara\":" + String(airTempDHT, 1) +
                     ",\"kelembapan\":" + String(airHum, 1) +
                     ",\"tds\":" + String(tdsValue, 0) +
                     ",\"ph\":" + String(phValue, 2) +
                     ",\"pompa\":\"" + String(pumpState ? "ON" : "OFF") + "\"}";
    client.publish(mqtt_topic_data, payload.c_str());
    Serial.println("📤 Status pompa dikirim ke MQTT");
  }
}

void callback(char* topic, byte* message, unsigned int length) {
  String msg = "";
  for (int i = 0; i < length; i++) msg += (char)message[i];
  msg.trim();

  if (String(topic) == mqtt_topic_pump) {
    if (msg.equalsIgnoreCase("ON")) {
      digitalWrite(RELAY_PIN, LOW);
      pumpState = true;
      Serial.println("💧 Pompa HIDUP (via MQTT)");
      sendPumpStatus();
    } else if (msg.equalsIgnoreCase("OFF")) {
      digitalWrite(RELAY_PIN, HIGH);
      pumpState = false;
      lastPumpOffTime = millis(); // Catat waktu pompa dimatikan
      Serial.println("💧 Pompa MATI (via MQTT)");
      sendPumpStatus();
    }
  }
}

void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Menghubungkan MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("Terhubung!");
      client.subscribe(mqtt_topic_pump);
    } else {
      Serial.print("Gagal, rc=");
      Serial.println(client.state());
      delay(3000);
    }
  }
}

// ======================
// Portal HTML
// ======================
const char* portalIndex = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hydroponic WiFi Setup</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-align: center;
      background: linear-gradient(135deg, #e6f2ff 0%, #cce5ff 100%);
      margin: 0;
      padding: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    .container {
      background: white;
      width: 85%;
      max-width: 320px;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0, 100, 200, 0.15);
    }
    
    h2 {
      color: #2c80ff;
      margin-bottom: 8px;
      font-weight: 600;
      font-size: 20px;
    }
    
    p {
      color: #666;
      margin-bottom: 20px;
      font-size: 14px;
    }
    
    .form-group {
      margin-bottom: 16px;
      text-align: left;
    }
    
    label {
      display: block;
      margin-bottom: 6px;
      color: #555;
      font-weight: 500;
      font-size: 13px;
    }
    
    input {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid #e1e8ff;
      border-radius: 6px;
      font-size: 14px;
      box-sizing: border-box;
      transition: all 0.3s;
    }
    
    input:focus {
      outline: none;
      border-color: #2c80ff;
      box-shadow: 0 0 0 3px rgba(44, 128, 255, 0.1);
    }
    
    button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(to right, #2c80ff, #5a9cff);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 8px;
    }
    
    button:hover {
      background: linear-gradient(to right, #1a6fe6, #4a8cf0);
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(44, 128, 255, 0.3);
    }
    
    .wifi-icon {
      font-size: 40px;
      color: #2c80ff;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="wifi-icon">📶</div>
    <h2>Hydroponic WiFi Setup</h2>
    <p>Masukkan SSID & Password WiFi</p>
    <form action="/connect" method="POST">
      <div class="form-group">
        <label for="ssid">Nama WiFi</label>
        <input type="text" id="ssid" name="ssid" placeholder="Nama WiFi" required>
      </div>
      <div class="form-group">
        <label for="pass">Password WiFi</label>
        <input type="password" id="pass" name="pass" placeholder="Password WiFi">
      </div>
      <button type="submit">Hubungkan</button>
    </form>
  </div>
</body>
</html>
)rawliteral";

void handleRoot() {
  server.send(200, "text/html", portalIndex);
}

void handleConnect() {
  inputSSID = server.arg("ssid");
  inputPASS = server.arg("pass");
  Serial.printf("Diterima kredensial: SSID='%s'\n", inputSSID.c_str());

  // send immediate feedback page (user will see this while ESP tries to connect)
  String resp = "<html><body><h3>Mencoba menghubungkan ke SSID: ";
  resp += inputSSID;
  resp += "</h3><p>Jika berhasil, portal akan ditutup dalam 2 detik.</p></body></html>";
  server.send(200, "text/html", resp);

  gotWiFiCredentials = true;   // signal main loop to attempt connection
}

void handleNotFound() {
  // redirect anything to captive portal index
  server.sendHeader("Location", String("http://") + apIP.toString(), true);
  server.send (302, "text/plain", "");
}

// ======================
// Start captive portal
// ======================
void startCaptivePortal() {
  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(apIP, apIP, IPAddress(255,255,255,0));
  WiFi.softAP(apSSID, apPASS);

  // start DNS redirect
  dnsServer.start(DNS_PORT, "*", apIP);

  // endpoints
  server.on("/", handleRoot);
  server.on("/connect", HTTP_POST, handleConnect);
  server.onNotFound(handleNotFound);
  server.begin();

  Serial.print("📶 AP aktif: ");
  Serial.println(apSSID);
  Serial.print("AP IP: ");
  Serial.println(apIP);

  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Hubungkan ke:");
  lcd.setCursor(0,1);
  lcd.print(apSSID);
}

// ======================
// Try connect to provided WiFi (temporary)
// ======================
bool tryConnectToProvidedWiFi(const String& ssidTemp, const String& passTemp, unsigned long timeoutMs = 15000) {
  if (ssidTemp.length() == 0) return false;

  // Switch to STA and attempt
  WiFi.mode(WIFI_STA);
  WiFi.disconnect(true);
  delay(200);
  WiFi.begin(ssidTemp.c_str(), passTemp.c_str());

  Serial.printf("🔸 Mencoba konek ke SSID: %s\n", ssidTemp.c_str());
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Menghubungkan:");
  lcd.setCursor(0,1);
  if (ssidTemp.length() > 12) lcd.print(ssidTemp.substring(0,12));
  else lcd.print(ssidTemp);

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && (millis() - start) < timeoutMs) {
    delay(200);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("✅ WiFi Connected!");
    lcd.clear();
    lcd.print("WiFi OK:");
    lcd.setCursor(0,1);
    lcd.print(WiFi.localIP());
    return true;
  } else {
    Serial.println("❌ Gagal konek WiFi.");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("WiFi gagal!");
    delay(1000);
    lcd.clear();
    return false;
  }
}

// ======================
// Setup
// ======================
void setup() {
  Serial.begin(115200);

  ds18b20.begin();
  dht.begin();
  lcd.init();
  lcd.backlight();

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // relay off (assuming active LOW)

  // Always start captive portal on boot
  startCaptivePortal();
}

// ======================
// Normal operation helpers
// ======================
void startNormalOperationAfterWiFi() {
  wifiConnected = true;
  wifiPreviouslyConnected = true;

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  reconnectMQTT();
  sendPumpStatus();
}

// go back to AP if connection failed
void enterAPAgain() {
  Serial.println("🔁 Kembali ke AP mode (gagal connect).");
  WiFi.disconnect(true);
  delay(200);
  // restart portal
  startCaptivePortal();
  gotWiFiCredentials = false;
  tryingToConnect = false;
}

// ======================
// Loop
// ======================
void loop() {
  // If AP active, handle captive portal
  if (WiFi.getMode() == WIFI_AP) {
    dnsServer.processNextRequest();
    server.handleClient();

    if (gotWiFiCredentials && !tryingToConnect) {
      tryingToConnect = true;

      // stop DNS and webserver while attempting connect (we already sent response)
      dnsServer.stop();
      server.stop();

      bool ok = tryConnectToProvidedWiFi(inputSSID, inputPASS, 15000);

      if (ok) {
        // connected as STA
        Serial.println("▶ Koneksi STA berhasil, menutup portal dalam 2 detik...");
        // show message on lcd briefly
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Terhubung! Tutup portal");
        lcd.setCursor(0,1);
        lcd.print("2 detik...");
        delay(2000);

        // ensure AP is fully disabled
        WiFi.softAPdisconnect(true);
        delay(200);

        // begin normal operation (MQTT etc)
        startNormalOperationAfterWiFi();
        // clear flags
        gotWiFiCredentials = false;
        tryingToConnect = false;
      } else {
        // failed -> return to AP mode
        enterAPAgain();
      }
    }

    return; // while AP active, don't continue to normal sensor loop
  }

  // ===== Normal operation (STA mode) =====
  // WiFi status change handling: if lost -> turn pump off; if regained -> stay OFF
  static wl_status_t lastWiFiStatus = WL_CONNECTED;
  wl_status_t currentWiFiStatus = WiFi.status();

  if (currentWiFiStatus != lastWiFiStatus) {
    lastWiFiStatus = currentWiFiStatus;

    if (currentWiFiStatus != WL_CONNECTED) {
      // WiFi lost
      Serial.println("⚠️ WiFi terputus! Pompa dimatikan demi keamanan.");
      digitalWrite(RELAY_PIN, HIGH); // OFF (asumsi active LOW)
      pumpState = false;
      wifiConnected = false;
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("WiFi Lost!");
      lcd.setCursor(0,1);
      lcd.print("Pump OFF");
      // send status (will only publish when wifiConnected true; skipped here)
    } else {
      // WiFi reconnected
      Serial.println("✅ WiFi tersambung kembali.");
      wifiConnected = true;
      reconnectMQTT();  // pastikan MQTT reconnected
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("WiFi OK lagi");
      lcd.setCursor(0,1);
      lcd.print("Pump tetap OFF");
      // sendPumpStatus(); // optional: already called in reconnectMQTT path
    }
  }

  if (wifiConnected && !client.connected()) reconnectMQTT();
  if (wifiConnected) client.loop();

  unsigned long now = millis();

  // Semua sensor berhenti saat pompa ON atau 3 detik setelah OFF
  bool sensorAktif = (!pumpState && (millis() - lastPumpOffTime > 3000));

  if (now - lastSensorRead >= 1000) {
    lastSensorRead = now;

    if (sensorAktif) {
      // Baca semua sensor
      ds18b20.requestTemperatures();
      float airTempNew = ds18b20.getTempCByIndex(0);
      float airTempDHTNew = dht.readTemperature();
      float airHumNew = dht.readHumidity();
      if (!isnan(airTempNew)) airTemp = airTempNew;
      if (!isnan(airTempDHTNew)) airTempDHT = airTempDHTNew;
      if (!isnan(airHumNew)) airHum = airHumNew;

      // TDS
      int sensorValue = analogRead(TdsSensorPin);
      analogBuffer[analogBufferIndex] = sensorValue;
      analogBufferIndex = (analogBufferIndex + 1) % SCOUNT;
      int medianValue = getMedianNum(analogBuffer, SCOUNT);
      float voltage = medianValue * (VREF / 4095.0);
      float compCoeff = 1.0 + 0.02 * (airTemp - 25.0);
      float compVolt = voltage / compCoeff;
      tdsValue = (133.42 * pow(compVolt, 3) - 255.86 * pow(compVolt, 2) + 857.39 * compVolt) * 0.5;

      // pH
      phValue = readPH();
    } else {
      Serial.println("⚠️ Pompa aktif / air belum tenang, semua sensor berhenti sementara.");
    }

    Serial.printf("Udara: %.1f°C | RH: %.1f%% | Air: %.1f°C | TDS: %.0f ppm | pH: %.2f | Pompa: %s | WiFi: %s\n",
                  airTempDHT, airHum, airTemp, tdsValue, phValue,
                  pumpState ? "ON" : "OFF",
                  wifiConnected ? "OK" : "LOST");
  }

  // LCD update tiap 3 detik
  if (now - lastLcdUpdate >= 3000) {
    lastLcdUpdate = now;
    showFirstScreen = !showFirstScreen;
    lcd.clear();
    if (showFirstScreen) {
      lcd.setCursor(0, 0);
      lcd.print("Ud:");
      lcd.print(airTempDHT, 1);
      lcd.print((char)223);
      lcd.print("C H:");
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
      lcd.print("C ");
      lcd.setCursor(0, 1);
      lcd.print("Pump:");
      lcd.print(pumpState ? "ON " : "OFF");
      if (wifiConnected) lcd.print(" Wifi:OK");
      else lcd.print(" LOST");
    }
  }

  // Kirim data sensor ke MQTT tiap 2 detik (sama seperti awal)
  if (now - lastMqttSend >= 1000 && wifiConnected) {
    lastMqttSend = now;
    String payload = "{\"suhu_air\":" + String(airTemp, 1) +
                     ",\"suhu_udara\":" + String(airTempDHT, 1) +
                     ",\"kelembapan\":" + String(airHum, 1) +
                     ",\"tds\":" + String(tdsValue, 0) +
                     ",\"ph\":" + String(phValue, 2) +
                     ",\"pompa\":\"" + String(pumpState ? "ON" : "OFF") + "\"}";
    client.publish(mqtt_topic_data, payload.c_str());
  }

  vTaskDelay(10 / portTICK_PERIOD_MS);
}