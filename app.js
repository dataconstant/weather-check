var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require('body-parser');
var request = require('request');


var app = express();

app.use(bodyparser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

app.get("/",function (req,res) {
  res.render("index")
});

app.post("/",function (req,res) {
  let cityname = req.body.city;
  const apiKey = req.body.apiKey;
  var url = `http://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=${apiKey}`;
  request(url,function (error,response,body) {
    if(error){
      console.log(error);
    }
    else {
      let weather = JSON.parse(body);
      let text =`The temperature is ${weather.main.temp} in ${weather.name}, ${weather.sys.country}`;
      res.render("index",{weather:text});
    }
  });
})




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
