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
const decimal = document.querySelector(".decimal");
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

operations.forEach(operation => {
    operation.addEventListener('click', function (operation) {
        console.log(operation.target.id);
    })
})

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
    displayCurrent(newNumbers);
    
}

function clearDisplay() {
    currentDisplay.innerText = '';
    memoryDisplay.innerText = '';
}

function interpretKeyboardInput(input){
    if (input >= 0 && input <= 9)
    {
        displayCurrent(input);
    }
    console.log(input);
}