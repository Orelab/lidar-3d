/*
  http://mochr.cz/3d-scanner/
  https://wiki.mchobby.be/index.php?title=DRV8825#Codification_rouge.2C_bleu.2C_vert.2C_noir
  https://github.com/grbl/grbl/wiki/Connecting-Grbl
  https://lebearcnc.com/reglage-des-drivers-pour-moteurs-pas-pas-pololu-a4988-drv8825-drv8824-et-drv4834/

*/


#include <SoftwareSerial.h>
#include "TFMini.h"

SoftwareSerial mySerial(7, 4);
TFMini tfmini;

#define pinEnable  8          // Activation des driver/pilote

#define pinStepH   2          // Signal de PAS (avancement)
#define pinDirH    5          // Direction 
#define pinStopH   9          // horizontal root switch

#define pinStepV   3          // Signal de PAS (avancement)
#define pinDirV    6          // Direction 
#define pinStopV  10          // vertical root switch

#define latency    1          // Latency, in milliseconds
#define step       200*8      // full step : un tour = 200 ; microstep 1/32 : un tour = 200*32

int x = 0;
int y = 0;



void setup()
{
  Serial.begin(115200);
  while (!Serial);

  mySerial.begin(TFMINI_BAUDRATE);

  tfmini.begin(&mySerial);

  pinMode( pinEnable, OUTPUT );

  pinMode( pinDirH, OUTPUT );
  pinMode( pinStepH, OUTPUT );
  pinMode( pinStopH, INPUT_PULLUP );

  pinMode( pinDirV, OUTPUT );
  pinMode( pinStepV, OUTPUT );
  pinMode( pinStopV , INPUT_PULLUP );

  home_h();
  home_v();
}



void loop()
{
  // Initialisation

  //digitalWrite( pinStepH, LOW );

  // Avance X

  digitalWrite( pinDirH, HIGH );
  
  for( x=0; x<step; x++)
  {
    digitalWrite( pinStepH, HIGH );
    delay(latency);
    digitalWrite( pinStepH, LOW );
    delay(latency);

    read(x,y);
  } 
  
  // Arrière X

  digitalWrite( pinDirH, LOW ); 
  
  for( x=0; x<step; x++)
  {
    digitalWrite( pinStepH, HIGH );
    delay(latency);
    digitalWrite( pinStepH, LOW );
    delay(latency);

    //read(x,y);
  } 


  // Avance Y

  digitalWrite( pinDirV, LOW );

  digitalWrite( pinStepV, HIGH );
  delay(latency);
  digitalWrite( pinStepV, LOW );
  delay(latency);

  y++;

  if( y >= step/3 )
  {
    Serial.println("End of scan !");
    while(true);
  }
}



void home_h()
{
  digitalWrite(pinDirH, LOW);

  while(true)
  {
    digitalWrite( pinStepH, HIGH );
    delay(1);
    digitalWrite( pinStepH, LOW );
    delay(1);

    if( ! digitalRead(pinStopH) )
    {
      return;
    }
  }
}



void home_v()
{
  digitalWrite(pinDirV, HIGH);

  while(true)
  {
    digitalWrite( pinStepV, HIGH );
    delay(20);
    digitalWrite( pinStepV, LOW );
    delay(20);

    if( ! digitalRead(pinStopV) )
    {
      return;
    }
  }
}




void read(int x, int y)
{
  uint16_t distance = tfmini.getDistance();
//  uint16_t strength = tfmini.getRecentSignalStrength();

  if (distance > 60000)
  {
    distance = 0;
  }

  Serial.print(distance);
  Serial.print("\t");
  Serial.print(x);
  Serial.print("\t");
  Serial.print(y);
  Serial.println();
}
