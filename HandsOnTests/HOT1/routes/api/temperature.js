import express from 'express';

const router = express.Router();

import debug from 'debug';

const debugTemperature = debug('app:Temperature')

app.use(express.json());

app.post('/temperature', (req,res) => {

    const mode = req.body.mode;
    const temp = req.body.temp;
    
    const temperature = parseFloat(temp)

    if(mode !== "FtoC" && mode !== "CtoF") {

        return res.status(400).send('Please choice either "FtoC" or "CtoF".');
    }

    if(isNaN(temperature) || temperature <= 0) {

      return res.status(400).send('Invalid Number please enter a number greater than 0');
    }


})
export {router as temperatureRouter}