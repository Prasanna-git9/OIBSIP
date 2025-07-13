const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let lastInput = '';
let resultDisplayed = false;

function updateDisplay() {
  display.textContent = currentInput || '0';
}

function isOperator(char) {
  return ['+', '-', '*', '/'].includes(char);
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const btnValue = button.textContent;

    if (button.id === 'clear') {
      currentInput = '';
      lastInput = '';
      resultDisplayed = false;
      updateDisplay();
      return;
    }

    if (button.id === 'delete') {
      if (resultDisplayed) {
        currentInput = '';
        resultDisplayed = false;
      } else {
        currentInput = currentInput.slice(0, -1);
      }
      updateDisplay();
      return;
    }

    if (button.id === 'equals') {
      if (currentInput === '') return;

      // Prevent ending with operator
      if (isOperator(currentInput.slice(-1))) {
        currentInput = currentInput.slice(0, -1);
      }

      try {
        // Evaluate expression safely
        let evalResult = Function(`'use strict'; return (${currentInput})`)();
        // Fix floating precision issues (limit decimals)
        evalResult = Math.round(evalResult * 1000000000) / 1000000000;
        display.textContent = evalResult;
        currentInput = evalResult.toString();
        resultDisplayed = true;
      } catch {
        display.textContent = "Error";
        currentInput = '';
      }
      return;
    }

    if (button.classList.contains('operator')) {
      if (currentInput === '') return; // no operator at start
      if (isOperator(currentInput.slice(-1))) {
        // Replace last operator with new one
        currentInput = currentInput.slice(0, -1) + button.dataset.op;
      } else {
        currentInput += button.dataset.op;
      }
      updateDisplay();
      resultDisplayed = false;
      return;
    }

    if (button.id === 'decimal') {
      // Prevent multiple decimals in the current number chunk
      let lastNumber = currentInput.split(/[\+\-\*\/]/).pop();
      if (!lastNumber.includes('.')) {
        currentInput += '.';
      }
      updateDisplay();
      return;
    }

    if (button.classList.contains('number')) {
      if (resultDisplayed) {
        currentInput = btnValue;
        resultDisplayed = false;
      } else {
        currentInput += btnValue;
      }
      updateDisplay();
      return;
    }
  });
});

updateDisplay();
