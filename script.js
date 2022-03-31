// adds footer content to the page
const footer = document.querySelector('.footer');
const footerPara = document.createElement('p');
let date = new Date().getFullYear();
footerPara.textContent = `Copyright © ${date} Luis Tamarez All Rights Reserved`;
footer.appendChild(footerPara);

// keeps track of the current operation of possible keyboard inputs to match in opsObj
const keyboardInputs = ['+', '-', '/', '*', 'x', 'X', '%', '^'];
const oneArgOps = ['log', 'root', 'factorial'];

// translates the operations symbols and keyboard inputs to the operation function names
const opsObj = {
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
    '^': 'power',
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
let errorFound = false;

// object that contains the math operations functions called by the buttons
const functionOpsObj = {
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
    document.activeElement.blur();
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
    else if (operationFinished) {
        memoryDisplay.innerText = '';
        displayCurrent('0.');
    }
    else{
        displayCurrent('.');
    }
    decimal.target.disabled = true;
});

operations.forEach(operation => {
    operation.addEventListener('click', function (operation) {
        // if operation is finisned via clicking '=' button clear memory
        if (operationFinished) {
            operationFinished = false;
            memoryDisplay.innerText = '';
        }

        let results = null;
        let current = currentDisplay.innerText;
        let memory = memoryDisplay.innerText;
        let operationInProgress = operation.target.innerText;


        // if there is no current number or number in memory, do nothing
        if ((current === '' && memory === '') || errorFound) {
            return;
        }

        // if operation is a one argument operation and memory is empty, do the operation
        if (oneArgOps.includes(opsObj[operationInProgress]) && memory === '') {     
            oneArgFunctions(operationInProgress);
            startOver();
            return;
        }

        // if there is no current number, but there is a number in memory, change operation or 
        // do the operation if it is a one argument operation
        if (current === '' && memory !== '') {
            memoryDisplay.innerText = '';
            if (oneArgOps.includes(opsObj[operationInProgress])) {  
                oneArgFunctions(operationInProgress);
                startOver();
                return;
            }
            displayMemory(operationInProgress, firstNumber);
        } 
       
        // if no memory, store the current number as firstNumber and  current operation
        if (memory === '') {
            displayMemory(operationInProgress, current);
        }

        // if there is a number in memory and a curent number, do the operation
        if (current !== '' && memory !== '') {
            if (oneArgOps.includes(opsObj[operationInProgress])) {
                if (results === null) {
                    firstNumber = twoArgFunctions();
                    let error = checkError(firstNumber);

                    // Error handling
                    if (error !== 'valid') {
                        clearDisplay();
                        startOver();
                        currentDisplay.innerText = error;
                        errorFound = true;
                        return;
                    } 
                    // secondNumber = null;
                }      
                oneArgFunctions(operationInProgress);
            }
            else {
                results = twoArgFunctions();
                let error = checkError(results);

                // Error handling
                if (error !== 'valid') {
                    clearDisplay();
                    startOver();
                    currentDisplay.innerText = error;
                    errorFound = true;
                    return;
                } 

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

// executes the operations that require two numbers
function twoArgFunctions() {
    secondNumber = parseFloat(currentDisplay.innerText);
    let twoArgResults = functionOpsObj[currentOperation](firstNumber, secondNumber);
    return twoArgResults;
}

// executes the operations that require one number
function oneArgFunctions(operationInProgress) {
    let oneArgNumber = firstNumber || parseFloat(currentDisplay.innerText);
    memoryDisplay.innerText = '';
    displayMemory(operationInProgress, oneArgNumber);
    results = functionOpsObj[currentOperation](oneArgNumber);
    let error = checkError(results);
    // Error handling
    if (error !== 'valid') {
        clearDisplay();
        startOver();
        currentDisplay.innerText = error;
        errorFound = true;
        return;
    }
    currentDisplay.innerText = results;
}

// displays the current number(s)
function displayCurrent(number) {

    // handles display when after the equals button is clicked
    if (operationFinished) {
       clearDisplay();
        operationFinished = false;
    }

    // handles display when there is an error
    if (errorFound) {
        currentDisplay.innerText = '';
        errorFound = false;
    }

    let node = document.createTextNode(number);
    currentDisplay.appendChild(node);
}


function displayMemory(operation, currentNumber) {
    let node = null;
    currentOperation = opsObj[operation];

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

    currentDisplay.innerText = '';
    memoryDisplay.appendChild(node);
}

// deletes the last number in the current display
function deleteLast(){
    let currentNumbers = currentDisplay.innerText;

    if (!currentNumbers) {
        return;
    }

    if (operationFinished) {
        memoryDisplay.innerText = '';
        operationFinished = false;
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
    if (decimal.disabled && !newNumber.toString().includes('.')) {
        newNumber = newNumber.toString() + '.';
    }

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

    if (memoryDisplay.innerText === '' || currentOperation === null || errorFound) {
        return;
    }
    else if (currentDisplay.innerText === '') {
        currentDisplay.innerText = firstNumber;
        memoryDisplay.innerText = '';
    }else {
        secondNumber = parseFloat(currentDisplay.innerText);
        let results = functionOpsObj[currentOperation](firstNumber, secondNumber);
        currentDisplay.innerText = results;
        let error = checkError(results);

        // Error handling
        if (error !== 'valid') {
            clearDisplay();
            startOver();
            memoryDisplay.innerText = error;
            errorFound = true;
            return;
        }

        if (currentOperation === 'power') {
            memoryDisplay.innerText = `${firstNumber}${operationDisplay}(${secondNumber}) =`;
        }
        else {
            memoryDisplay.innerText = `${firstNumber}${operationDisplay}${secondNumber} =`;
        }
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
    else if ((input === '-' && currentDisplay.innerText === '') || currentDisplay.innerText === '-')
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
            if (opsObj[input] === operattionId) {
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

function checkError(number){
    if (isNaN(number)) {
        return 'Error';
    }
    else if (number === Infinity || number === -Infinity) {
        return number;
    }
    else {      
        return 'valid';
    }
}

function roundToTenDecimals(number){
    return Math.round(number * 10000000000) / 10000000000;
}

// Math operations
function add(first, second) {
    return first + second;
}

function subtract(first, second) {
    return first - second;
}
  
function divide(first, second) {
    let answer = first / second;
    return roundToTenDecimals(answer);
}

function multiply(first, second) {
    return first * second;
}

function power(base, power){
    return roundToTenDecimals(Math.pow(base, power)); 
}

function root(number){
    return roundToTenDecimals (Math.sqrt(number));
}

function percent(first, second) {
    let answer = (first / 100) * second;
    return Math.round(answer * 100) / 100;
}

function log(number){ 
    return roundToTenDecimals(Math.log10(number));
}

function factorial (number){
    return gamma(number + 1);
}

// source Peter Olson's answer on stackoverflow.com @ shorturl.at/aczX2 
// rounded to 2 decimal places for gamma function not accurate enough when using decimal numbers
function gamma(z) {
    let answer = Math.sqrt(2 * Math.PI / z) * Math.pow((1 / Math.E) * (z + 1 / (12 * z - 1 / (10 * z))), z);
    return Math.round (answer * 100) / 100;
}
