/*

3D LIDAR Scanner

https://behindthesciences.com/electronics/arduino-time-of-flight-range-finder/

*/


#include <Wire.h>
#include <VL53L0X.h>
#include <Servo.h>
#include "functions.h"

VL53L0X sensor;
Servo x_servo;
Servo y_servo;

int h_stp=15;            // horizontal step
int v_stp=5;            // vertical step
int del=50;             // delay
int min_range=500;       // a range from 500 to 2500 corresponds to a range from 0 to 180 degrees
int max_range=2500;

int x=min_range;
int y=max_range;




void setup()
{
  Serial.begin(9600);
  Wire.begin();

  sensor.init();
  sensor.setTimeout(500);
  sensor.startContinuous();

  x_servo.attach(4);
  y_servo.attach(5);
  x_servo.writeMicroseconds(x);
  y_servo.writeMicroseconds(y);

  delay(10000);
}



void loop()
{
  if(y<0) return;
  
  y-=v_stp;

  for(x=min_range ; x<max_range ; x+=h_stp)
  {
    play(x, y);
  }
  /*   
  y-=v_stp;
  
  for(x=max_range ; x>min_range ; x-=h_stp)
  {
    play(x, y);
  }
  */
}



void play(int x, int y)
{
  x_servo.writeMicroseconds(x);
  y_servo.writeMicroseconds(y);
  
  delay(del);

  float distance = sensor.readRangeContinuousMillimeters();

  if( distance>60000 )
  {
    distance=0;
  }

  if( sensor.timeoutOccurred() )
  {
    distance=0;
  }

  Serial.print( distance );
  Serial.print("\t");
  Serial.print( mapFloat(x,min_range,max_range,0,180) );
  Serial.print("\t");
  Serial.print( mapFloat(y,min_range,max_range,0,180)-35 );
  Serial.println();
  /*

  float theta = mapFloat(x,min_range,max_range,-90,90);
  float phi = mapFloat(y,min_range,max_range,-90,90);
  float distance = sensor.readRangeContinuousMillimeters();

  //distanceCorrection(&phi, &theta, &distance);
    
  Coords c=spherical2cartesian(phi, theta, distance);
  
  //cartesianCorrection(&c);

  Serial.print( -c.x );
  Serial.print("\t");
  Serial.print( c.y );
  Serial.print("\t");
  Serial.print( c.z );
  Serial.println();
  */
}

