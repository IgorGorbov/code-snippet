const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/authRoutes');
const snippetRouter = require('./routes/snippetRoutes.js');
const categoryRouter = require('./routes/categoryRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(cookieParser());

app.use('/api/v1/users', bodyParser.json(), userRouter);
app.use('/api/v1/snippets', bodyParser.json(), snippetRouter);
app.use('/api/v1/categories', bodyParser.json(), categoryRouter);

app.get('/', (req, res) => res.send('Coding hello!'));

module.exports = app;
