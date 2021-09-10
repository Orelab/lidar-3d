var USB_PORT = '/dev/ttyUSB0';



/*
  USB Lidar communication

  When data is received, it is transfered :
  - at the Webserver, throw socket
  - saved in a file, with NodeFS

*/
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
var port = new SerialPort(USB_PORT, {
  baudRate: 115200
});
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));



// Webserver interface

const express = require('express');
const app = express();

const serv = require('http');
const http = serv.Server(app);
var io = require('socket.io')(http);


// Filesystem file storage

const path = require('path');
const fs = require('fs');
const filename =  new Date().toISOString();

app.use(express.static('public'));


app.get('/files', function(req, res){
  const directoryPath = path.join(__dirname, 'log');
  var content = [];

  fs.readdir(directoryPath, function(err, files){
      if(err){
        res.send(content);
        return;
      }

      for(var i=0 ; i<files.length ; i++){
        content.push({
          file: files[i],
          size: fs.statSync(__dirname+'/log/'+files[i]).size,
          extension: path.extname(__dirname+'/log/'+files[i])
        })
      }
      res.setHeader('Content-Type', 'application/json');
      res.send( content.sort((a,b)=>(a.size<b.size)?1:-1) );
  });
});

app.get('/file/:filename', function(req, res){
  const filename = decodeURIComponent(req.params.filename);

  fs.readFile('log/'+filename, 'utf8', function(err,data){
    res.send(data);
  });
});

app.get('/delete/:filename', function(req, res){
  const filename = decodeURIComponent(req.params.filename);

  fs.rename('log/'+filename, 'trash/'+filename, function(err){
    res.send(err ? 'ko' : 'ok');
  });
});

app.get('/rename/:oldname/:newname', function(req, res){
  const oldname = decodeURIComponent(req.params.oldname);
  const newname = decodeURIComponent(req.params.newname);
    
  fs.rename('log/'+oldname, 'log/'+newname, function(err){
    res.send(err ? 'ko' : 'ok');
  });
});

http.listen(3000, function(){
  console.log('Listening orders on port 3000 !');
});



parser.on('data', function(data){
  io.emit('data', data);
  console.log(data);
  fs.appendFile(__dirname+"/log/"+filename+".txt", data+"\n", function(err){}); 
});
