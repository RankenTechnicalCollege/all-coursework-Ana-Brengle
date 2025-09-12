import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import debug from 'debug';
import { mpgRouter } from './routes/api/mpg.js';
import { temperatureRouter } from './routes/api/temperature.js';
const debugServer = debug('app:Server');



const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static('awd1111-exam-1/dist'));
app.use('/api/mpg', mpgRouter);
app.use('/api/temperature', temperatureRouter);

const port = process.env.PORT || 5010

app.listen(port,() => {
    debugServer(`Server is now running on port http://localhost:${port}`);
})

app.get('/api', (req, res) => {
    res.send('Hello world')
});