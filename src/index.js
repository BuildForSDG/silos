import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes'

dotenv.config();

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

//setup the port
const port = process.env.NODE_ENV === 'test' ? process.env.TEST_PORT : process.env.PORT;

app.use('/api/v1', routes);

//start the server
app.listen(port, () => console.log(`server started at Port ${port}`));

//export the app for testing
export default app;
