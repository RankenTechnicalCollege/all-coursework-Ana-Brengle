import express from 'express';

const router = express.Router();

import debug from 'debug';

const debugMpg = debug('app/Mpg');

app.use(express.json());

app.post('/mpg', (req,res) => {
    const milesDriven = req.body.milesDriven;
    const galUsed = req.body.galUsed

    const miles = parseFloat(milesDriven);
    const gallons = parseFloat(galUsed);

    if(isNaN(miles) || miles <= 0) {
        return res.status(400).send('Invalid Miles: must be a number greater than 0.');
    }

    if(isNaN(gallons) || miles <= 0) {
        return res.status(400).send('Invalid Gallons: must be a number greater than 0.');
    }
    
    const mpg = miles/gallons;
    console.log(`You have a MPG of: ${mpg.toFixed(2)}`);

})

export {router as mpgRouter}