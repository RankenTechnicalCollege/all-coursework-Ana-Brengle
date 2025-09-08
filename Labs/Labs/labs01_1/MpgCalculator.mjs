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
    
    miles = await rl.question("Please enter the amount of Miles traveled.");
    miles = parseFloat(miles)

    if (isNaN(miles) || miles <= 0) {
        console.log("You entered a letter. PLease Enter a number, greater than 0");
    }
        
} while ( isNaN(miles) || miles <= 0 )

do {

    gallons = await rl.question("Please enter the amount of Gallons used.");
    gallons = parseFloat(gallons);

     if(isNaN(gallons) || gallons < 0){
        console.log("You entered a letter. PLease Enter a number, greater than 0")
    }
    
} while( gallons == '' || isNaN(gallons) || gallons <= 0)

     mpg = miles/gallons;
     console.log(`You have a MPG of: ${mpg.toFixed(2)}`)

rl.close();