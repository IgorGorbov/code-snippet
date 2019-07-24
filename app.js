const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const winston = require('./config/winston');

const authRoutes = require('./routes/authRoutes');
const snippetRouter = require('./routes/snippetRoutes.js');
const categoryRouter = require('./routes/categoryRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else app.use(morgan('combined', { stream: winston.stream }));

app.use(cookieParser());

app.use('/', bodyParser.json(), authRoutes);
app.use('/api/v1/snippets', bodyParser.json(), snippetRouter);
app.use('/api/v1/categories', bodyParser.json(), categoryRouter);

app.get('/', (req, res) => res.send('Coding hello!'));

module.exports = app;
