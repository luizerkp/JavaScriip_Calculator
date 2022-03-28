// adds footer content to the page
const footer = document.querySelector('.footer');
const footerPara = document.createElement('p');
let date = new Date().getFullYear();
footerPara.textContent = `Copyright © ${date} Luis Tamarez All Rights Reserved`;
footer.appendChild(footerPara);

const opsObj = {
    'add': '+',
    'subtract' : '-',
    'multiply': 'x',
    'equal': '=',
    'divide': '/',
    'percent': '%',
}

const numbers = document.querySelectorAll(".number");
const decimal = document.querySelector("#decimal");
const polarityButton = document.querySelector('#polarity');
const equal = document.querySelector(".equal");
const operations = document.querySelectorAll(".operation");
const currentDisplay = document.querySelector('#current');
const memoryDisplay = document.querySelector('#memory');
const deleteNumber = document.querySelector('#delete');
const clear = document.querySelector("#clear");

document.addEventListener('keydown', function (e) {
    interpretKeyboardInput(e.key);
})

numbers.forEach(number => {
    number.addEventListener('click',function (number) {
        number = number.target.innerText;
        displayCurrent(number);
    });
});

decimal.addEventListener('click', function (decimal) {
    if (currentDisplay.innerText === '') {
        displayCurrent('0.');
    }
    else{
        displayCurrent('.');
    }
    decimal.target.disabled = true;
});

operations.forEach(operation => {
    operation.addEventListener('click', function (operation) {
        console.log(operation.target.id);
    });
});

polarityButton.addEventListener('click', polarity);
deleteNumber.addEventListener('click', deleteLast);
clear.addEventListener('click', clearDisplay);

function displayCurrent(number) {
    let node = document.createTextNode(number);
    currentDisplay.appendChild(node);
}

function displayMemory(operation=null) {
    let current = currentDisplay.innerText;
    let currentMemory = memoryDisplay.innerText;
    let node = null;
    if (memoryDisplay) {
        node = document.createTextNode(current);
    }
    else {
        node = document.createTextNode(`${current} ${operation}`)
    }
    memoryDisplay.appendChild(node);
   
}

function deleteLast(){
    let currentNumbers = currentDisplay.innerText;
    if (!currentNumbers) {
        return;
    }

    let newNumbers = currentNumbers.slice(0, currentNumbers.length - 1);
    currentDisplay.innerText = '';

    // if the new  number does not have a decimal point, enable the decimal button
    if (!newNumbers.includes('.') && decimal.disabled === true) {
        decimal.disabled = false;
    }
    displayCurrent(newNumbers);
}

function polarity(){
    let current = currentDisplay.innerText;
    if (current === '') {
        return displayCurrent('-');
    }
    else if(current === '-') {
        return currentDisplay.innerText = '';
    }
    let newNumber = current * -1;
    currentDisplay.innerText = '';
    displayCurrent(newNumber);
}

function clearDisplay() {
    currentDisplay.innerText = '';
    memoryDisplay.innerText = '';
    if (decimal.disabled) {
        decimal.disabled = false;
    }
}

function interpretKeyboardInput(input){
    if (input >= 0 && input <= 9)
    {
        displayCurrent(input);
    }
    console.log(input);
}

// Math operations
function sum(first, second) {
    return first + second;
}

function subtract(first, second) {
    return first - second;
}
  
function divide(first, second) {
    return first / second;
}

function multiply(first, second) {
    return first * second;
}

function power(base, power){
    return Math.pow(base, power); 
}

function root(number){
    return Math.sqrt(number);
}

function percent(first, second) {
    return (first / 100) * second;
}

function log(number){
    return Math.log(number);
}

function factorial (number){
    if (number=== 0) {
      return 1;
    } else {
      return number * factorial(number - 1);
    }
}

  

// notes need to work on memory diplay now display memory funtion is written but need to call it and test that works
// as inteded. Next move on to creating all the opeartions funtions and figure out how to call them. Finally make sure 
// it all works as intended. NOTE: Created opsObj for keyboard opeartions input.