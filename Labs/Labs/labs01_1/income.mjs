import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

let choice;
let income = 0;

do {
    choice = await rl.question("Choice option (1 - Single or 2 - Married filing jointly): ")
    choice = parseFloat(choice);

    if(choice !== 1 && choice !== 2) {
        
        console.log("Didn't choose 1 or 2 pick: Pick a choice!")

    } else if(isNaN(choice)) {

        console.log("You entered a Letter. Enter 1 or 2 please")

    }

} while (choice !== 1 && choice !== 2)



do {
    let incomeInput = await rl.question("Enter a income greater than 0: ");
    income = parseFloat(incomeInput);

    if (isNaN(income) || income <= 0) {
        console.log("Please enter a valid number greater than 0.");
    }
} while (isNaN(income) || income <= 0);

let tax = 0

if (choice === 1)
    {
        if(income >= 626351){

            tax = 188769.75 + (income - 626351) * .37 ;

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

     console.log(`For a taxable income of $${income}, the tax owed is $${tax.toFixed(2)}`);
rl.close();