import express from 'express';
import debug from 'debug';
const debugMPG = debug('app:mpgRouter');

const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.post('/calc', (req, res) => {
    const info = req.body;

    if(info == undefined){
        res.status(400).send('Please enter numbers')
    }

    const milesDriven = parseFloat(req.body.milesDriven);
    const gallonsUsed = parseFloat(req.body.gallonsUsed);

    if(!milesDriven || milesDriven == "" || isNaN(milesDriven) || milesDriven <= 0){
        res.status(400).send('Invalid number for Miles Driven: Enter a number greater than 0');
        return;
    }

    if(!gallonsUsed|| gallonsUsed == "" || isNaN(gallonsUsed) || gallonsUsed <= 0){
        res.status(400).send('Invalid number for Gallons Used: Enter a number greater than 0');
        return;
    }

    const mpg = (milesDriven/gallonsUsed).toFixed(2);
    debugMPG(`You have a Miles per Gallon of:${mpg}`);
    res.status(200).json({message:`You have a Miles per Gallon of:${mpg}`});



})
export {router as mpgRouter}