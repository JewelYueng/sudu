let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let assets = require('connect-assets');

let routes = require('./routes/index');
let users = require('./routes/users');
global.levels = require ('./models/level');
let mongoose = require('mongoose');
let app = express();

mongoose.connect('mongodb://127.0.0.1/test');

let Cat = mongoose.model('Cat', {
    name: String,
    friends: [String],
    age: Number,
});
// let kitty = new Cat({ name: 'Zildjian', friends: ['tom', 'jerry']});
// kitty.age = 4;
// kitty.save(function (err) {
//     if (err) // ...
//         console.log('meow');
// });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.use(assets({
    helperContext: app.locals,
    // 指定你使用的资源路径。顺序很重要——如果main.js存在于多个目录中，只有第一个目录中的会被编译
    paths: ["./public/stylesheets", "./public/javascripts"]
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
