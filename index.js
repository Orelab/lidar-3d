
const express = require('express');
const app = express();

const serv = require('http');
const http = serv.Server(app);
var io = require('socket.io')(http);

var SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
var port = new SerialPort('/dev/ttyUSB0');
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

const fs = require('fs');
const filename =  new Date().toISOString();

app.use(express.static('public'));


http.listen(3000, function()
{
  console.log('Listening orders on port 3000 !');
});


parser.on('data', function(data){
  io.emit('data', data);

  fs.appendFile("log/"+filename+".txt", data+"\n", function(err){}); 
});

