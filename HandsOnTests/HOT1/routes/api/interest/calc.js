import express from 'express';

const router = express.Router();
import debug from 'debug';
const debugInterest = debug('app:Interest');



//router.use(express.urlencoded({ extended: false }));

router.post('/calc', (req, res) => {
  
     const principal = req.body.principal;
     const interestRate = req.body.interestRate;
     const years = req.body.years;

     if(!principal || principal == '' || isNaN(principal) || principal <= 0) {
        res.status(400).send('Invalid number for Principle: Enter a number greater than 0');
        return;
     }

     if(!interestRate || interestRate == '' || isNaN(interestRate) || interestRate <= 0) {
        res.status(400).send('Invalid number for Interest Rate: Enter a number greater than 0');
        return;
     }

     if(!years || years == '' || isNaN(years) || years <= 0) {
        res.status(400).send('Invalid number for Years: Enter a number greater than 0');
        return;
     }

     const finalAmount = principal * ((1 + interestRate / 100 / 12) ** (years * 12)).toFixed(2)
     debugInterest(`After ${years} year with an interest rate of ${interestRate}, the total investment will be $${finalAmount}`);
     res.status(200).json({message:`After ${years} years with an interest rate of ${interestRate}, the total investment will be $${finalAmount}`});
});
export {router as interestRouter}