#include <SoftwareSerial.h>
#include <TinyGPS++.h>

#define rxPin 7
#define txPin 8
SoftwareSerial SIM900(rxPin,txPin); 
double latitude, longitude;
// static const uint32_t GPSBaud = 9600;
TinyGPSPlus gps;

// long interval = 60000;
// long start_time = 0;
// long wait_time = 0;
void SIM900power() 
   { pinMode(9, OUTPUT);
     digitalWrite(9,LOW); 
     delay(1000); 
     digitalWrite(9,HIGH);
     delay(2000); 
     digitalWrite(9,LOW); 
     delay(3000); 
     }
  

  void setup()
  {
    //Begin serial communication with Arduino and Arduino IDE (Serial Monitor)
    SIM900power();
    Serial.begin(9600);
    
    //Begin serial communication with Arduino and SIM800L
    SIM900.begin(9600);

    Serial.println("Initializing...");
    delay(1000);
  }

  void loop()
  {
    // while(SIM900.available()){
    //   Serial.println(SIM900.readString());
    // }
    // while(Serial.available())  {
    //   SIM900.println(Serial.readString());
    // }
    // wait_time = millis()-start_time;
    // if(wait_time>interval){
    //   sendData();
    //   start_time = millis();
    // }
    
    while (Serial.available() > 0) 
    if (gps.encode(Serial.read())){
      if(getGpsData())
         sendData();
    }
      
    
    
    
  }
 void sendData(){
    
    String lat = String(latitude,6);
    String lng = String(longitude,6);
    String key = "nitap2019";
    
    String at_url = "AT+HTTPPARA=\"URL\",\"http://167.71.236.231/gpsdata.php?&key=" ;
    at_url += key;
    at_url += "&lat=";
    at_url += lat;
    at_url += "&lng=";
    at_url += lng +"\"" ;


    Serial.println("HTTP get method :");
    Serial.print("AT\\r\\n");
    SIM900.println("AT");	/* Check Communication */
    delay(2000);
    // ShowSerialData();	/* Print response on the serial monitor */
    delay(2000);
    /* Configure bearer profile 1 */
    Serial.print("AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\"\\r\\n");		
    SIM900.println("AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\"");	/* Connection type GPRS */
    delay(2000);
    // ShowSerialData();
    delay(2000);
    Serial.print("AT+SAPBR=3,1,\"APN\",\"bsnlnet\"\\r\\n");	
    SIM900.println("AT+SAPBR=3,1,\"APN\",\"bsnlnet\"");	/* APN of the provider */
    delay(2000);
    // ShowSerialData();
    delay(2000);
    Serial.print("AT+SAPBR=1,1\\r\\n");
    SIM900.println("AT+SAPBR=1,1");	/* Open GPRS context */
    delay(2000);
    // ShowSerialData();
    delay(2000);
    Serial.print("AT+SAPBR=2,1\\r\\n");
    SIM900.println("AT+SAPBR=2,1");	/* Query the GPRS context */
    delay(2000);
    // ShowSerialData();
    delay(2000);
    Serial.print("AT+HTTPINIT\\r\\n");
    SIM900.println("AT+HTTPINIT"); /* Initialize HTTP service */
    delay(2000); 
    // ShowSerialData();
    delay(2000);
    Serial.print("AT+HTTPPARA=\"CID\",1\\r\\n");
    SIM900.println("AT+HTTPPARA=\"CID\",1");	/* Set parameters for HTTP session */
    delay(2000);
    // ShowSerialData();
    delay(2000);
    Serial.print(at_url);
    SIM900.println(at_url);	/* Set parameters for HTTP session */
    delay(2000);
    // ShowSerialData();
    delay(2000);
    Serial.print("AT+HTTPACTION=0\\r\\n");
    SIM900.println("AT+HTTPACTION=0");	/* Start GET session */
    delay(3000);
    // ShowSerialData();
    delay(3000);
    Serial.print("AT+HTTPREAD\\r\\n");
    SIM900.println("AT+HTTPREAD");	/* Read data from HTTP server */
    delay(4000);
    // ShowSerialData();
    delay(4000);
    Serial.print("AT+HTTPTERM\\r\\n");  
    SIM900.println("AT+HTTPTERM");	/* Terminate HTTP service */
    delay(2000);
    // ShowSerialData();
    delay(2000);
    Serial.print("AT+SAPBR=0,1\\r\\n");
    SIM900.println("AT+SAPBR=0,1"); /* Close GPRS context */
    delay(2000);
    // ShowSerialData();
    delay(2000);
  
  }
   
   bool getGpsData(){
     if (gps.location.isValid())
      { 
       latitude = gps.location.lat(); // Latitude in degrees (double) 
       longitude = gps.location.lng(); // Longitude in degrees (double) 
       return true; 
      } 
     else return false; 

   }

  //  void ShowSerialData()
  //   {
  //     while(SIM900.available()!=0)	/* If data is available on serial port */
  //     Serial.write(char (SIM900.read()));	/* Print character received on to the serial monitor */
  //   }
  
