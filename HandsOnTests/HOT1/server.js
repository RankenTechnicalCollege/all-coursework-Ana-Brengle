import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import debug from 'debug';
import { mpgRouter } from './routes/api/mpg/calc.js';
import { tempRouter } from './routes/api/temperature/convert.js';
import { taxRouter } from './routes/api/income-tax/calc.js';
import { interestRouter } from './routes/api/interest/calc.js';
const debugServer = debug('app:Server');

const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static('awd1111-exam-1/dist'));
app.use('.routes/api/mpg/calc.js', mpgRouter);
app.use('.routes/api/temperature/convert.js', tempRouter);
app.use('./routes/api/income-tax/calc.js',taxRouter);
app.use('./routes/api/interest/calc.js', interestRouter);

const port = process.env.PORT || 5010

app.listen(port,() => {
    debugServer(`Server is now running on port http://localhost:${port}`);
})

//app.get('/api', (req, res) => {
  //  res.send('Hello world')
//});