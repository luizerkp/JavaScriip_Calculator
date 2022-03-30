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
let operationInProgress = null;
let operationDisplay = null;
let firstNumber = null;
let secondNumber = null;
let operationFinished = false;
let operationStarted = false;

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
        operationStarted = true;

        if (operationFinished) {
            operationFinished = false;
            memoryDisplay.innerText = '';
        }

        let results = null;
        let current = currentDisplay.innerText;
        let memory = memoryDisplay.innerText;
        let operationInProgress = operation.target.innerText;

        // if there is no current number or number in memory, do nothing
        if (current === '' && memory === '') {
            return;
        }

        // if there is no current number, but there is a number in memory, change operation
        if (current === '' && memory !== '') {
            console.log('1st');
            memoryDisplay.innerText = '';
            console.log(currentOperation);
            console.log(firstNumber);
            displayMemory(operationInProgress, firstNumber);
        } 
        
        // if operation is a one argument operation, do the operation
        if (oneArgOps.includes(OpsObj[operationInProgress]) && memory === '') {
            console.log('2nd');       
            oneArgFunctions(operationInProgress);
            startOver();
            return;
        }
        
        // if no memory, store the current number as firstNumber and operation
        if (memoryDisplay.innerText === '') {
            displayMemory(operationInProgress, current);
            console.log('3rd');
        }

        // if there is a number in memory and a curent number, do the operation
        if (current !== '' && memory !== '') {
            console.log('4th');
            if (oneArgOps.includes(OpsObj[operationInProgress])) {
                console.log('2nd'); 
                if (results === null) {
                    firstNumber = twoArgFunctions();
                }      
                oneArgFunctions(operationInProgress);
            }
            else {
                results = twoArgFunctions();     
                currentDisplay.innerText = results;
                memoryDisplay.innerText = '';
                displayMemory(operationInProgress, results);
            }
            secondNumber = null;
        }
    });
});

polarityButton.addEventListener('click', polarity);
deleteNumber.addEventListener('click', deleteLast);
clear.addEventListener('click', clearDisplay);
equalButton.addEventListener('click', equal);

function twoArgFunctions() {
    secondNumber = parseFloat(currentDisplay.innerText);
    console.log(`${firstNumber} ${currentOperation} ${secondNumber}`);
    let twoArgResults = funtionOpsObj[currentOperation](firstNumber, secondNumber);
    console.log(twoArgResults);
    return twoArgResults;
}

function oneArgFunctions(operationInProgress) {
    let oneArgNumber = firstNumber || parseFloat(currentDisplay.innerText);
    memoryDisplay.innerText = '';
    displayMemory(operationInProgress, oneArgNumber);
    results = funtionOpsObj[currentOperation](oneArgNumber);
    currentDisplay.innerText = results;
}

function displayCurrent(number) {

    if (operationStarted) {
        currentDisplay.innerText = '';
        operationStarted = false;
    }

    let node = document.createTextNode(number);
    currentDisplay.appendChild(node);
}

function displayMemory(operation, currentNumber) {
    // let current = currentDisplay.innerText;
    let node = null;

    currentOperation = OpsObj[operation];

    // saves the current number and operation to memory
    if (typeof currentNumber === 'number') {
        firstNumber = currentNumber;
    } else {
        firstNumber = parseFloat(currentNumber);
    }
    operationDisplay = operation;

    // changes how operation is displayed
    if (operationDisplay === '%') {
        operationDisplay = '% x ';
    }
    if (operationDisplay === 'x!') {
        operationDisplay = '!';
    }
    if (operationDisplay === 'xʸ') {
        operationDisplay = '^';
    }

    if (operationDisplay === '√' || operationDisplay === 'log') {
        node = document.createTextNode(`${operationDisplay}(${currentNumber})`);
    }
    else {
        node = document.createTextNode(`${currentNumber}${operationDisplay}`);
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

function equal() {
    operationFinished = true;

    if (memoryDisplay.innerText === '' || operationStarted || currentOperation === null) {
        return;
    }
    else if (currentDisplay.innerText === '') {
        currentDisplay.innerText = firstNumber;
        memoryDisplay.innerText = '';
    }else {
        secondNumber = parseFloat(currentDisplay.innerText);
        let results = funtionOpsObj[currentOperation](firstNumber, secondNumber);
        currentDisplay.innerText = results;
        if (currentOperation === 'power') {
            memoryDisplay.innerText = `${firstNumber}${operationDisplay}(${secondNumber}) =`;
        }
        else {
            memoryDisplay.innerText = `${firstNumber}${operationDisplay}${secondNumber} =`;
        }
    }
    console.log(firstNumber);
    console.log(secondNumber);
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
        equalButton.click();
    }
    else if (keyboardInputs.includes(input)){
        operations.forEach(function(operation){
            let operattionId = operation.id;
            if (OpsObj[input] === operattionId) {
                operation.click();
            }
        });
    }
}

function startOver(){
    firstNumber = null;
    secondNumber = null;
    currentOperation = null;
    operationDisplay = null;
    operationFinished = true;
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
    console.log(`${base} to the power of ${power}`);
    return Math.pow(base, power); 
}

function root(number){
    return Math.sqrt(number);
}

function percent(first, second) {
    return (first / 100) * second;
}

function log(number){  
    return Math.log10(number);
}

function factorial (number){
    if (number=== 0) {
      return 1;
    } else {
      return number * factorial(number - 1);
    }
}

// Need to add error handling 