// adds footer content to the page
const footer = document.querySelector('.footer');
const footerPara = document.createElement('p');
let date = new Date().getFullYear();
footerPara.textContent = `Copyright © ${date} Luis Tamarez All Rights Reserved`;
footer.appendChild(footerPara);

const keyboardInputs = ['+', '-', '/', '*', 'x', 'X', '%'];
const oneArgOps = ['log', 'root', 'factorial'];

const OpsObj = {
    '+': 'add',
    '-': 'subtract',
    'x': 'multiply',
    'X': 'multiply',
    '*': 'multiply',
    '÷': 'divide',
    '/': 'divide',
    '%': 'percent',
    'x!': 'factorial',
    'xʸ': 'power',
    '√': 'root',
    'log': 'log'
};


const numbers = document.querySelectorAll(".number");
const decimal = document.querySelector("#decimal");
const polarityButton = document.querySelector('#polarity');
const equalButton = document.querySelector("#equal");
const operations = document.querySelectorAll(".operation");
const currentDisplay = document.querySelector('#current');
const memoryDisplay = document.querySelector('#memory');
const deleteNumber = document.querySelector('#delete');
const clear = document.querySelector("#clear");

let currentOperation = null;
let firstNumber = null;
let secondNumber = null;

const funtionOpsObj = {
    'add': add,
    'subtract': subtract,
    'multiply': multiply,
    'divide': divide,
    'power': power,
    'root': root,
    'percent': percent,
    'log': log,
    'factorial': factorial
};

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
        // if there is not current display don't do anything
        operationInProgess = OpsObj[currentOperation];
        console.log('operationInProgess', operationInProgess);
        let results = null;
        
        if (currentDisplay.innerText === '') {
            return;
        } 
        else if (oneArgOps.includes(operationInProgess)) {
            console.log('one arg');
            firstNumber = currentDisplay.innerText;
            results = funtionOpsObj[operationInProgess](firstNumber);
            displayMemory(operation.target.innerText);
            currentDisplay.innerText = results;
            startOver();
        }
        else if (memoryDisplay.innerText === '') {
            displayMemory(operation.target.innerText);
        }
        else {
            secondNumber = parseFloat(currentDisplay.innerText);
            results = funtionOpsObj[operationInProgess](firstNumber, secondNumber);
            currentDisplay.innerText = results;
            memoryDisplay.innerText = '';
            displayMemory(operation.target.innerText);
        }
    });
});

polarityButton.addEventListener('click', polarity);
deleteNumber.addEventListener('click', deleteLast);
clear.addEventListener('click', clearDisplay);
equalButton.addEventListener('click', equal);

function displayCurrent(number) {
    let node = document.createTextNode(number);
    currentDisplay.appendChild(node);
}

function displayMemory(operation=null) {
    let current = currentDisplay.innerText;
    let node = null;
    
    // saves the current number and operation to memory
    firstNumber = parseFloat(current);
    currentOperation = operation;
    console.log(operation);
        
    if (memoryDisplay === '') {
        node = document.createTextNode(current);
    }
    else {
        // changes how operation is displayed
        if (operation === '%') {
            operation = 'percent';
        }
        if (operation === 'x!') {
            operation = '!';
        }
        if (operation === 'xʸ') {
            operation = 'e';
        }

        node = document.createTextNode(`${current}${operation}`)
    }

    currentDisplay.innerText = '';
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

function equal() {
    if (memoryDisplay.innerText === '') {
        return;
    }
    else if (currentDisplay.innerText === '') {
        currentDisplay.innerText = firstNumber;
        memoryDisplay.innerText = '';
    }else {
        secondNumber = parseFloat(currentDisplay.innerText);
        operationInProgess = OpsObj[currentOperation];
        let results = funtionOpsObj[operationInProgess](firstNumber, secondNumber);
        currentDisplay.innerText = results;
        memoryDisplay.innerText = `${firstNumber}${currentOperation}${secondNumber} =`;
    }
    startOver();
}

function interpretKeyboardInput(input){
    if (input >= 0 && input <= 9)
    {
        displayCurrent(input);
    }
    else if (input === '.')
    {
        decimal.click();
    }
    else if (input === '-' && currentDisplay.innerText === '')
    {
        polarityButton.click();
    }
    else if (input === 'Delete' || input === 'Backspace')
    {
        deleteNumber.click();
    }
    else if (input === 'End'){
        clear.click();
    }
    else if (input === 'Enter' || input === '='){
        //equal.click();
        console.log('equal');
    }
    else if (keyboardInputs.includes(input)){
        console.log(OpsObj[input]);
    }
}

function startOver(){
    firstNumber = null;
    secondNumber = null;
    currentOperation = null;
}
// Math operations
function add(first, second) {
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

// curently working on the operations funtionallity line 73-94
// Need to add error handling 
// Need to fix one number operations
// !!! Why is operationInProgess not working? why is it undefined?