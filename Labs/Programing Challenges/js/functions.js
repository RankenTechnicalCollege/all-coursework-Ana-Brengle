/*
//Function Declaration
function add(a,b) {
    return a + b;
}

//Function Expression
const AddExpression = function add3(a,b,c){
    return a + b + c;
}

//Arrow function
//6 ways to declare arrow functions -
//Arrow functions are anonymous function, meaning they have no name
//No Parameters
const greet = () => "HELLO!";

//1 parameter
const add100 = a => a + 100;

//Multiple parameters
const multiply = (a,b,c) => a * b * c;

//function body with multiple statements
const greet2 = (name = "Guest") =>  {
    const greeting = `Hello, ${name}!`;
    return greeting;
}

//Return an object
const createUser = (name, age) => ({name,age});

document.getElementById("btnSucker").addEventListener("click", function(){
    document.getElementById("outPut").innerHTML = `Answer: ${}`;
});

//Higher-order functions - function can be an argument
//Higher Order Function - Function as Argument

function doMathOperation(a,b,operation){
    return operation(a,b);
}*/


const vowelCount = (string) => {
    let count = 0;

    for(let i = 0; i < string.length; i++){
        let c = string[i].toLowerCase();
        if (c == "a" || c == "e" || c == "i" || c == "o" || c == "u"){
            count ++;
        
        }
    }
    return count;
};
document.getElementById("btnVCount").addEventListener("click", function(){
    document.getElementById("output1").innerHTML = `Answer: ${vowelCount(document.getElementById('txtVowelCount').value)}`
} )


function reverse(string){
    let a = "";
    
    for(let i = string.length - 1; i >= 0; i--) {
        a += string[i];
    } return a;
};
document.getElementById("btnRevString").addEventListener("click", function(){
    document.getElementById("output2").innerHTML = `Answer: ${reverse(document.getElementById('txtReverseString').value)}`
})

const capitalize = function firstLetter(string){
    if(!string) return '';
    return string[0].toUpperCase() + string.slice(1);
}

