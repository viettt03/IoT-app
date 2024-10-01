#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#define DHTPIN 4        // Pin nối với cảm biến DHT
#define DHTTYPE DHT11   // Chọn loại cảm biến (DHT11 hoặc DHT22)
#define LDR 34
// Định nghĩa các chân LED
const int led1 = 18;    // GPIO 21 cho LED1
const int led2 = 19;
const int led3 = 21;

// Định nghĩa chân cảm biến ánh sáng (DO)

// Định nghĩa WiFi và MQTT Broker
const char* ssid = "Wifi-Free";
const char* password = "Wifi-Free";
const char* mqtt_server = "192.168.0.102";  // IP broker
const char* mqtt_user = "viettt03";  // Username của MQTT
const char* mqtt_pass = "2003";  // Password của MQTT

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

// Hàm kết nối WiFi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
}

// Hàm xử lý khi nhận dữ liệu từ MQTT
void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  if (message.startsWith("all")) {
    int state = message.substring(4, 5).toInt();
    
    // Bật/tắt tất cả các đèn
    digitalWrite(led1, state);
    digitalWrite(led2, state);
    digitalWrite(led3, state);

    String ledStatus = "all:" + String(state);
    client.publish("home/device/status", ledStatus.c_str());
    Serial.println(ledStatus);  // In ra thông báo trạng thái
    
  } else {
    int led = message.substring(0, 1).toInt();
    int state = message.substring(2, 3).toInt();

    // Điều khiển đèn đơn lẻ
    if (led == 1) {
      digitalWrite(led1, state);
    } else if (led == 2) {
      digitalWrite(led2, state);
    } else if (led == 3) {
      digitalWrite(led3, state);
    }

    // Pub lại thông báo khi đèn bật thành công
    String ledStatus = String(led) + ":" + String(state);
    client.publish("home/device/status", ledStatus.c_str());
    Serial.println(ledStatus);  // In ra thông báo trạng thái
  }
}

// Hàm kết nối tới MQTT broker
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client", mqtt_user, mqtt_pass)) {  // Kết nối với username và password
      Serial.println("connected");
      client.subscribe("home/device/control");  // Đăng ký lắng nghe lệnh điều khiển LED
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  // Cài đặt Serial, WiFi, MQTT và cảm biến
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1234);
  client.setCallback(callback);

  // Thiết lập chân cho LED và cảm biến ánh sáng
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);
  pinMode(LDR, INPUT);  // Cảm biến ánh sáng (DO) là đầu vào

  // Khởi tạo cảm biến DHT
  dht.begin();
}

void loop() {
  // Đảm bảo kết nối MQTT
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Đọc giá trị từ cảm biến DHT
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Đọc giá trị từ cảm biến ánh sáng (0 hoặc 1)
  int lightSensorValue = analogRead(LDR);
  // Kiểm tra nếu dữ liệu cảm biến hợp lệ
  if (!isnan(temperature) && !isnan(humidity)) {
    // Tạo chuỗi dữ liệu để gửi qua MQTT
    String payload1 =String(temperature) + " " + String(humidity) + " " + String(lightSensorValue);
    String payload ="Temp: "+ String(temperature) + " Humidity: " + String(humidity) + " Light: " + String(lightSensorValue);
    
    // Gửi dữ liệu tới MQTT topic
    client.publish("home/sensor", payload1.c_str());

    Serial.println(payload);
  }

  delay(2000);  // Đọc dữ liệu mỗi 2 giây
}