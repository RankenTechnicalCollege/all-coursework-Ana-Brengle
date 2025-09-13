import express from 'express';

const router = express.Router();

import debug from 'debug';

const debugTemp= debug('app:tempRouter')

router.use(express.urlencoded({ extended: false }));


//app.use(express.json());

router.post('/convert', (req,res) => {

    const mode = req.body.mode;
    const temp = parseFloat(req.body.temp);
    
    

    if(mode !== "FtoC" && mode !== "CtoF") {

      res.status(400).send('Please choice either "FtoC" or "CtoF".');
      return;
    }

    if(!temp || temp == "" || isNaN(temp) || temp <= 0) {

      res.status(400).send('Invalid Number please enter a number greater than 0');
      return;
    }

    if(mode == 'FtoC') {
      const tempAnswer = ((temp - 32) * (5/9)).toFixed(2);
      debugTemp(`${temp}F is ${tempAnswer}C`);
      res.status(200).json({message: `${temp}F is ${tempAnswer}C`})
    } else {
      const tempAnswer = ((temp - (9/5)) + 32).toFixed(2);
      debugTemp(`${temp}C is ${tempAnswer}F`);
      res.status(200).json({message: `${temp}C is ${tempAnswer}F`})
    }


})
export {router as tempRouter}