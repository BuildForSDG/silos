import {} from 'dotenv/config';
import app from './app';


//setup the port
const port = process.env.NODE_ENV === 'test' ? process.env.TEST_PORT : process.env.PORT;

//start the server
app.listen(port, () => console.log(`server started at Port ${port}`));
