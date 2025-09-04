import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

//const answer = await rl.question('What do you think of Node.js? ');

//console.log(`Thank you for your valuable feedback: ${answer}`);

let number;

number = Number(number);

do {

    number = await rl.question('How big do you want the table to be (1-12)?')
    number = parseInt(number)

    if (isNaN(number) || number < 1 || number > 12) {

    console.log('Enter a number between 1-12')
    
}

} while(isNaN(number) || number < 1 || number > 12)



const maxNum = number * number;
const cellWidth = String(maxNum).length + 1; 

for (let i = 1; i <= number; i++) {
    let row = String(i).padStart(cellWidth);
    for (let j = 1; j <= number; j++) {
        row += String(i * j).padStart(cellWidth);
    }
    console.log(row);
}


rl.close();