var express = require('express');
var app = express();
var fs = require("fs");
const url = require('url');
const crypto = require("crypto");
let algorithm = "sha512"

//setInterval(intervalFunc, 1000);

app.use(function (req, res, next) { 
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Cache-Control','public, max-age=3600');
  next();
});

app.use(express.static(__dirname + "/public"));

app.get('/test', function (req, res) {
 res.sendFile(__dirname + '/html/test.html');
})
 
app.get('/generateOTP', function (req, res) {
 const queryObject = url.parse(req.url,true).query;
 var phone = queryObject.phoneNum;
 if (phone != undefined){
     var dateObj = new Date();
     day = dateObj.getUTCDate();
     hour = dateObj.getHours();
     if (((phone.replace(/[^0-9]/g,'')).length != 10) || phone.length != 10){
  	console.log("error");
  	res.end(JSON.stringify({ Error: "Phone number is not valid"}));
     } else {
      	res.setHeader('Content-Type', 'application/json');
          str = phone + day + hour;
          let digest = crypto.createHash(algorithm).update(str).digest("hex") 
          numeric_Str = digest.replace(/[^1-9]/g,'');
      	res.end(JSON.stringify({ OTP1: numeric_Str.slice(-6) }));
    }
  } else {
  res.end(JSON.stringify({ Error: "URL missing params"}));
 }
})

app.get('/validateOTP', function (req, res) {

 const queryObject = url.parse(req.url,true).query;
 var phone = queryObject.phoneNum;
 var otp = queryObject.otp;

  if (phone != undefined && otp != undefined){
     var dateObj = new Date();
     day = dateObj.getUTCDate();
     hour = dateObj.getHours();
     hour2 = dateObj.getHours()-1;
     if (((phone.replace(/[^0-9]/g,'')).length != 10) || phone.length != 10){
      res.end(JSON.stringify({ Error: "Phone number is not valid"}));
     } else if (((otp.replace(/[^0-9]/g,'')).length != 6) || otp.length != 6){
      res.end(JSON.stringify({ Error: "OTP should be 6 digits"}));
     }else {
          res.setHeader('Content-Type', 'application/json');
          str = phone + day + hour;
          str2 =  phone + day + hour2;
          let digest1 = crypto.createHash(algorithm).update(str).digest("hex") 
          otp1 = digest1.replace(/[^1-9]/g,'').slice(-6);
          let digest2 = crypto.createHash(algorithm).update(str2).digest("hex") 
          otp2 = digest2.replace(/[^1-9]/g,'').slice(-6);
          if (otp == otp1 || otp == otp2){
              res.end(JSON.stringify({ Success: "OK"}));
          } else {
              res.end(JSON.stringify({ Error: "OTP validation failed"}));
          }

    }
 } else {
  res.end(JSON.stringify({ Error: "URL missing params"}));
 }

})


app.get('*', function(req, res){
res.sendFile(__dirname + '/html/error.html');
});

//Initialize server
var server = app.listen(8080, function () {
 var host = server.address().address
 var port = server.address().port
 console.log("Example app listening at http://%s:%s", host, port)
})