import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
// import sequelize from './config/sequelize';
import path from 'path';


//initialize express
const app = express();

//allow requests from cross origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// test sequelize db connection
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch((err) => {
//     console.error('Unable to connect to the database:', err);
//   });

//api docs route
app.use('/api/v1/apidocs', express.static(path.join(__dirname, '../docs')));

app.use('/api/v1', routes);

//export the app for testing
export default app;