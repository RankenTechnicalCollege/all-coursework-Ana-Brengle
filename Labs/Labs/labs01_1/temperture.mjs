import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

let choice;
let temp;
let convert;

do {
    choice = await rl.question("Choice option (1 or 2): ")
    choice = parseFloat(choice);

    if(choice !== 1 && choice !== 2) {
        
        console.log("Didn't choose 1 or 2 pick: Pick a choice!")
    }

} while (choice !== 1 && choice !== 2)

   do {
      temp = await rl.question(`Please enter a valid temperature greater than 0.\n`)
      temp = parseFloat(temp)

      if (isNaN(temp)||temp <= 0) {

            console.log("Please enter a valid temperature greater than 0.\n");
         }
   } while (isNaN(temp) || temp <= 0)

    if (choice === 1){

        console.log('You have chosen 1 - Celsius to Fahrenheit')
        

            convert = (temp * (9/5)) + 32;
            console.log(`${temp}°C is ${convert.toFixed(2)}°F`);
         
    } else if(choice === 2)
        {

            console.log('You have chosen 2 - Fahrenheit to Celsius')
            

            convert = (temp - 32) * (5/9);
            console.log(`${temp}°F is ${convert.toFixed(2)}°C`);
         
        }
rl.close();