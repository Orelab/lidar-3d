# A 3D lidar

The aim of this project is to build a tool which scans the environment.
The collected data are provided to an application which reproduce the scanned world in 3D.
Each recording is saved into a file which can be loaded later by clicking on it, from the left side of the app.

Please note that this project is a work in progress, and a learning subject...

![screenshot of the 3D render](https://github.com/Orelab/lidar-3d/blob/master/demo.jpg)

## Technologies

- material : Arduino + servos or steppers + VL53L0X or TF-Mini
- software : NodeJS + Express + ThreeJS

## Installation / launch
```
git clone git@github.com:Orelab/lidar-3d.git
cd lidar-3d
npm install
# configure now the port of your USB_PORT scanner in the file index.js (first line)
npm start
```
## Scanner building

Please, be patient ;)


