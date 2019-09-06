


/*

  Converts spherical coordinates (phi,theta,distance) to cartesian coordinates (x,y,z)
  https://mathinsight.org/spherical_coordinates

*/

struct Coords {
  float x;
  float y;
  float z;
};

Coords spherical2cartesian(long phi, long theta, long distance)
{
  Coords c;
  
  c.x = distance * sin(radians(phi)) * sin(radians(theta));
  c.y = distance * sin(radians(phi)) * cos(radians(theta));
  c.z = distance * cos(radians(phi));

  return c; 
}



/*

  A map function, but with floating values
  https://forum.arduino.cc/index.php?topic=3922.0

*/
float mapFloat(long x, long in_min, long in_max, long out_min, long out_max)
{
  return (float)(x - in_min) * (out_max - out_min) / (float)(in_max - in_min) + out_min;
}




/*

  Material adjustments
  
  Because the LIDAR is not perfectly in the center of rotations,
  we have to adjust the origin point and the distance length...
  
*/

void distanceCorrection(float *phi, float *theta, float *distance)
{
//  phi += mapFloat(phi, -180, 180, 4, -4);
//  phi += mapFloat(abs(phi), 0, 180, 4, 0);
  *distance = *distance + mapFloat(*theta, 0, 180, -8, 4);
}

void cartesianCorrection(Coords *c)
{
  c->x = c->x + mapFloat(c->x, -180, 180, 4, -4);
  c->y = c->y + mapFloat(abs(c->x), 0, 180, 4, 0);
  c->z = c->z + mapFloat(c->y, 0, 180, -8, 4);
}

