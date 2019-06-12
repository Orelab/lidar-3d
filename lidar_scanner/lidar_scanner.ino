/*

3D LIDAR Scanner

https://behindthesciences.com/electronics/arduino-time-of-flight-range-finder/

*/


#include <Wire.h>
#include <VL53L0X.h>
#include <Servo.h>

VL53L0X sensor;
Servo x_servo;
Servo y_servo;

int x=0;
int y=180;
int stp=2;  // step
int del=0;  // delay



void setup()
{
  Serial.begin(9600);
  Wire.begin();

  sensor.init();
  sensor.setTimeout(500);
  sensor.startContinuous();

  x_servo.attach(4);
  y_servo.attach(5);
}



void loop()
{
  y-=stp;

  for(x=0 ; x<180 ; x+=stp)
  {
    play(x, y);
  }
      
  y-=stp;
  
  for(x=180 ; x>0 ; x-=stp)
  {
    play(x, y);
  }
}



void play(int x, int y)
{
  x_servo.write(x);
  y_servo.write(y);
  delay(del);

  Serial.print(sensor.readRangeContinuousMillimeters());
  if (sensor.timeoutOccurred()) { Serial.print(" TIMEOUT"); }
  Serial.print("\t");
  Serial.print(x);
  Serial.print("\t");
  Serial.print(y);
  Serial.println();
}


