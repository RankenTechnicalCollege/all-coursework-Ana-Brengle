import express from 'express';
const router = express.Router();
import debug from 'debug';
const debugTax = debug('app:Tax');

router.use(express.urlencoded({ extended: false }));

router.post('/calc', (req, res) => {

    const info = req.body;

    if(info == undefined){
        res.status(400).send('Please Choose Single or Married')
    }

    const mode = req.body.mode;
    const income = req.body.income;

    if(!mode || (mode != "Single" && mode != "Married")) {
        res.status(400).send("'Mode' is required please chose: 'Single' or 'Married'.")
        return;
    }

    if(!income || income == '' || isNaN(income) || income <= 0 ) {
        res.status(400).send('Invalid entry for income. Please enter a valid number greater than 0')
    }

    let tax = 0;

    if(mode == "Single") {
        if(income > 626350) {
            tax = 188769.75 + (income - 626351) * .37;
        } else if (income >= 205526) {

            tax = 57231 + (income - 205526) * .35 ;

        } else if (income >= 197301) {

            tax = 40199 + (income - 197301) * .32;

        } else if (income >= 103351) {
            
            tax = 17651 + (income - 103351) * .24;

        } else if (income >= 48476) {
            
            tax = 5578.50 + (income - 48476) * .22;

        } else if (income >= 11926) {

            tax = 1192.50 + (income - 11926) * .12;

        } else {
            tax = (income * .1);
        }
    } else {
         if (income >= 751601){

            tax = 202154.50 + (income - 751601) * .37;

        } else if (income >= 501051) {
            
            tax = 144462 + (income - 501051 ) * .35;

        } else if (income >= 394601) {

            tax = 80398 + (income - 394601) * .32;

        }else if (income >= 206701) {

            tax = 35302 + (income - 206701) * .24;

        } else if (income >= 96951) {

            tax = 11157 + (income - 96951) * .22;

        } else if (income >= 23851) {

            tax = 2385 + (income - 23851) * .12;
        } else {

            tax = (income * .1);
        }
    }
     debugTax(`For a taxable income of $${income}, the tax owed is $${Math.ceil(tax)}`)
     res.status(200).json({message:`For a taxable income of $${income}, the tax owed is $${Math.ceil(tax)}`});
})
export {router as taxRouter}