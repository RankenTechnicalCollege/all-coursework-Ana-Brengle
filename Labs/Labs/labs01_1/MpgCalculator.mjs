import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

//const answer = await rl.question('What do you think of Node.js? ');

//console.log(`Thank you for your valuable feedback: ${answer}`);
//const miles = parseInt(prompt("enter miles driven: "));
//const gallons = paseInt(prompt("enter gallons used in total: "));
//const mpg = parseFloat(miles/gallons);

let miles;
let gallons;
let mpg;



do{
    if(miles < 0 || gallons < 0){
        console.log("ENTER A AMOUNT GREATER THAN 0")

    }
    else
    {
       
        miles = await rl.question("Please enter the amount of Miles traveled.");
        parseFloat(miles)
        
       gallons = await rl.question("Please enter the amount of Gallons used.");
        parseFloat(gallons);

        mpg = miles/gallons;
        console.log(`You have a MPG of: ${mpg.toFixed(2)}`)

    }
}while(miles == '' || isNaN(miles) || miles <= 0 || gallons == '' || isNaN(gallons) || gallons <= 0)

rl.close();