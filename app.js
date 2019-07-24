const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const winston = require('./config/winston');

const authRoutes = require('./routes/authRoutes');
const snippetRouter = require('./routes/snippetRoutes.js');
const categoryRouter = require('./routes/categoryRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(xss());
app.use(compression());
app.use(cookieParser());
app.use(hpp({ whitelist: ['id'] }));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else app.use(morgan('combined', { stream: winston.stream }));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/', bodyParser.json(), authRoutes);
app.use('/api', limiter);
app.use('/api/v1/snippets', bodyParser.json(), snippetRouter);
app.use('/api/v1/categories', bodyParser.json(), categoryRouter);

app.get('/', (req, res) => res.send('Coding hello!'));

module.exports = app;
