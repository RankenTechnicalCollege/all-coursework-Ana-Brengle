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



window.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('txtUserInput');


    document.getElementById("btnVCount").addEventListener("click", function(){
        document.getElementById("output").innerText = (`Answer: ${vowelCount(input.value)}`)
    })
    
    document.getElementById('btnRevString').addEventListener("click", function(){
        document.getElementById("output").innerText = (`Answer: ${reverse(input.value)}`)
    })

     document.getElementById('btnCapWords').addEventListener("click", function(){
        document.getElementById("output").innerText = (`Answer: ${capitalize(input.value)}`)
    })
    document.getElementById("btnCount").addEventListener("click", function(){
        document.getElementById("output").innerText = (`Answer: ${countWords(input.value)}`)
    })
    document.getElementById("btnConString").addEventListener("click", function(){
        const addWord = prompt('Add your Name: ');
        document.getElementById("output").innerText = (`Hello my name is ${createUser(input.value, addWord)}`)
    })
} )
    



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



function reverse(string){
    let a = "";
    
    for(let i = string.length - 1; i >= 0; i--) {
        a += string[i];
    } return a;
};


const capitalize = function (string) {
    return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
    
}

const countWords = (str) => {

    let c = 0;
    let words = false;

    for(const char of str){
        if (/\s/.test(char)) {
            words = false;
        } else if(!words) {
            words = true;
            c++;
        }
    }
    return c;
}

const createUser = (str1, str2) => str1 + " " +  str2;








