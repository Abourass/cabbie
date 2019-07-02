'use strict';

const createError = require('http-errors');
const compression = require('compression');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const csrf = require('csurf');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('http');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const pancake = require('anandamide-pancake');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const dayjs = require('dayjs');
const ip = require('ip');
const fs = require('fs');
const debug = require('debug')('cabbie:server');
const logger = require('morgan');
const rfs = require('rotating-file-stream');
const chalk = require('chalk');

require('dotenv').config(); // =====================================> dotEnv provides support for our .env file <=============
const app = express(); // ==========================================> Initialize Express <====================================

const env = process.env.NODE_ENV || 'development'; // ==============> Discover environment we are working in <================

const logDirectory = path.join(__dirname, 'log'); // ===============> Log Folder for development runs <=======================
if (env === 'development') { // ====================================> If in dev create log files locally <====================
  fs.existsSync('./log') || fs.mkdirSync('./log');
  const accessLogStream = rfs('access.log', {size: '10M', interval: '1d', compress: 'gzip', path: logDirectory}); // create a rotating write stream - 1d means 1 day (I.E. rotates daily)
  app.use(logger(':method :url RETURNED :status FROM :referrer | :remote-addr [:date[clf]] | THIS TOOK :response-time[digits] MS', {stream: accessLogStream}));
}

app.use(helmet()); // ==============================================> Helmet middleware <=====================================
app.use(bodyParser.urlencoded({extended: false})); // ==============> Required for CSRF Protection <==========================
app.use(cookieParser()); // ========================================> Cookie Parser Middleware <==============================
app.use(csrf({cookie: true})); // ==================================> Let CSRF Use Cookies <==================================

const indexRoute = require('./routes/index'); // ===================> Load Routes <===========================================

mongoose.connect(process.env.mongoURI, {useNewUrlParser: true}) // ======> Connect to our Database <==========================
  .then(() => debug(chalk.blue.inverse(' Atlas has shouldered the burden | Database Aloft! '))).catch(err => debug(err));

function shouldCompress(req, res, next) { // =======================> Compression Middleware <================================
  if (req.headers['x-no-compression']) { return false; } // ========> Don't compress responses w/ no-compression header <=====
  return compression.filter(req, res); // ==========================> fallback to standard filter function <==================
}
app.use(compression({threshold: 0, filter: shouldCompress})); // ===> Compress all responses <================================
app.use(logger('dev', {// ==========================================> Log Errors to console.error via debug <=================
  skip: function(req, res) { return res.statusCode < 400; },
  stream: {write: msg => debug(chalk.red(msg))},
}));
app.use(bodyParser.json()); // =====================================> Body Parser Middleware <=================================
app.use(methodOverride('_method')); // =============================> Method Override Middleware <=============================

const {truncate} = require('./helpers/hbs');
app.engine('.handlebars', exphbs({
  helpers: {truncate: truncate},
  defaultLayout: 'main',
  partialsDir: ['./views/partials/'],
  extname: '.handlebars',
}));
app.set('view engine', 'handlebars');

const sess = {// ==================================================> Create Session Object for Use <==========================
  secret: 'cabbieCat',
  name: 'CabbieCatTheWonderCat',
  resave: false,
  saveUninitialized: false, // =====================================> The line below this is the session store <===============
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {path: '/', httpOnly: true, secure: 'auto', maxAge: 60000 * 60 * 24},
};
app.use(session(sess)); // =========================================> Express session middleware <=============================

app.use(flash()); // ===============================================> Flash Messaging / Notification middleware <==============
app.use((req, res, next) => { // ===================================> Set Global Variables <===================================
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(express.static(path.join(__dirname, 'public'), {maxAge: '30 days'})); // ==========> Set static folders <==============

app.use('/', indexRoute); // =======================================> Index Routes <===========================================

app.use((req, res, next) => {
  res.send('404 - Route Not Found'); // ============================> catch 404 and forward to error handler <=================
});

app.use((err, req, res, next) => { // ==============================> Error Handler <==========================================
  res.locals.message = err.message; // =============================> set locals, only providing error in development <========
  res.locals.error = (req.app.get('env') === 'development') ? err : {};
  res.status(403);
  res.send('Error 403');
  res.status(err.status || 500);
  res.send('Error 500');
  if (!err){ return next(); }
});

module.exports = app;
