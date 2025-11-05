const resultInput = document.getElementById('result');
const buttons = document.querySelector('.buttons');

let currentInput = '0';
let operator = null;
let previousInput = null;
let waitingForSecondOperand = false;

function updateDisplay() {
    resultInput.value = currentInput;
}

function clearAll() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

function inputDigit(number) {
    if (waitingForSecondOperand === true) {
        currentInput = number;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? number : currentInput + number;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForSecondOperand === true) {
        currentInput = '0.';
        waitingForSecondOperand = false;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function calculate(prev, current, op) {
    const p = parseFloat(prev);
    const c = parseFloat(current);

    if (isNaN(p) || isNaN(c)) return current;

    switch (op) {
        case '+':
            return p + c;
        case '-':
            return p - c;
        case '*':
            return p * c;
        case '/':
            if (c === 0) {
                return 'Error';
            }
            return p / c;
        default:
            return current;
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (previousInput === null) {
        previousInput = inputValue;
    } else if (operator) {
        const result = calculate(previousInput, currentInput, operator);

        if (result === 'Error') {
            currentInput = 'Error';
            operator = null;
            previousInput = null;
            waitingForSecondOperand = false;
        } else {
            currentInput = String(result);
            previousInput = result;
        }
        updateDisplay();
        if (nextOperator === '=') {
            operator = null;
            waitingForSecondOperand = false;
            return;
        }
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

function handleButtonClick(event) {
    const target = event.target;
    const value = target.dataset.value;

    if (!value) return;
    if (currentInput === 'Error') {
        if (value !== 'C') {
            return;
        }
    }

    if (/\d/.test(value)) {
        inputDigit(value);
    } else if (value === '.') {
        inputDecimal();
    } else if (value === 'C') {
        clearAll();
    } else if (value === '+' || value === '-' || value === '*' || value === '/' || value === '=') {
        handleOperator(value);
    }
}

buttons.addEventListener('click', handleButtonClick);

updateDisplay();