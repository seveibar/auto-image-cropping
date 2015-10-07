var express = require('express');
var bodyParser = require('body-parser');
var PythonShell = require('python-shell');
var fs = require("fs");
var app = express();

app.use('/bower_components', express.static('bower_components'));
app.use('/imgs', express.static('imgs'));
app.use('/work', express.static('work'));

app.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  limit: '50mb',
  extended: true
}));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

var pythonRunning = false;
app.post('/gen', function(req, res){
  if (pythonRunning){
    res.send("wait");
    return;
  }else{
    res.send("ok");
  }

  var source = req.body.source;
  var fg_mat = req.body.fg_mat;
  var bg_mat = req.body.bg_mat;

  base64ToImage(source, "work/source.png");
  base64ToImage(fg_mat, "work/fg_mat.png");
  base64ToImage(bg_mat, "work/bg_mat.png");

  pythonRunning = true;
  PythonShell.run("mflow.py", {
    "pythonPath": "/usr/bin/python",
    "scriptPath": "./mflow",
    "args": ["work/source.png", "work/fg_mat.png", "work/bg_mat.png", "work/out.png"]
  }, function(err){
    pythonRunning = false;
    if (err){
      console.log("Python Failed!!!", err);
    }else{
      console.log("Output generated.");
    }
  });

});


function base64ToImage(imgData, imgDest){
  var buff = new Buffer(imgData
    .replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
    fs.writeFile(imgDest, buff, function (err) {
      if (err){
        console.error("Error occured writing", imgDest);
      }
      console.log(imgDest, "written successfully");
    });
}


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
