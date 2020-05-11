import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fileupload from 'express-fileupload';
// import { process } from 'ipaddr.js';
import routes from './routes';
import sequelize from './config/sequelize';

// initialize express
const app = express();

// allow requests from cross origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileupload({ useTempFiles: true }));

// test sequelize db connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// api docs route
app.use('/api/v1/apidocs', express.static(path.join(__dirname, '../docs')));

app.use('/api/v1', routes);

/* eslint-disable no-unused-vars */
// Catching none-existing routes and other errors
app.use((req, res, next) => {
  const error = new Error('Route not found!');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      message: error.message
    }
  });
});
/* eslint-disable no-unused-vars */
// export the app for testing
export default app;
