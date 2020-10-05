const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const colors = require('colors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const users = require('./routes/usersRoutes');
const auth = require('./routes/authRoutes');
const messages = require('./routes/messageRoutes');
const initial = require('./routes/initial');

// Load ENV
dotenv.config({
  path: './config/config.env',
});

// Connect to Mongo DB
connectDB();

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Cors
app.use(cors());

// Mount routers
app.use('/', initial);
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);
app.use('/api/v1/messages', messages);

// Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

// Handler : Handle unhandeled rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error : ${err}`.red);
  server.close(() => {
    process.exit(1);
  });
});
