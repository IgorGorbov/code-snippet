const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.get('/', (req, res) => res.send('Coding hello!'));

module.exports = app;
