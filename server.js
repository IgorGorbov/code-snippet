require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const port = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    const server = app.listen(port, () => console.log(`Server running on port ${port} ...`));

    process.on('unhandledRejection', err => {
      console.log('UNHANDLED REJECTION! Shutting down ...');
      console.log(err.name, err.message);
      server.close(() => process.exit(1));
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM RECEIVED.');
      server.close(() => console.log('Shutting down gracefully. Process terminated.'));
    });
  })
  .catch(err => console.log('Sequelize sync error', err));
