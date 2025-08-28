import {getRandomColor, getRandomNumber} from './utiles.js';


const randomNumber = getRandomNumber();
const randomColor = getRandomColor();

// Get the HTML elements to display the results
const numberElement = document.getElementById('random-number');
const colorElement = document.getElementById('color-name');

// Set the text content of the elements
numberElement.textContent = `Random Number: ${randomNumber}`;
colorElement.textContent = `Random Color: ${randomColor}`;
