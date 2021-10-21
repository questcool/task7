class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.clear()
  }

  clear() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.tempPrevious = ''
    this.tempOperation = ''
    this.operation = undefined
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }

  negativeNumber() {
    if(this.currentOperand === '') return
    if(this.currentOperand.toString().includes('-')){
      this.currentOperand = this.currentOperand.toString().slice(1)
    } else {
      this.currentOperand = '-'.concat(this.currentOperand.toString())
    }
  }

  appendNumber(number) {
    if(this.currentOperand.length > 11) return
    if (number === '.' && this.currentOperand.includes('.')) return
    this.currentOperand = this.currentOperand.toString() + number.toString()
  }

  chooseOperation(operation) {
    if (this.operation !== undefined){
      this.operation = operation
    }
    if (this.currentOperand === '') return
    if (this.previousOperand !== '') {
      this.compute()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
  }

  compute() {
    let computation
    const prev = parseFloat(this.previousOperand)
    const tempPrev = parseFloat(this.tempPrevious)
    const current = parseFloat(this.currentOperand)
    if(this.previousOperand !== '' && this.currentOperand === ''){
      this.currentOperand = this.previousOperand
      this.previousOperand = ''
      this.operation = undefined
      return
    }
    if(this.previousOperand !== '' && parseFloat(this.currentOperand) === 0 && this.operation === '÷'){
      alert('Деление на ноль невозможно')
      this.currentOperand = ''
      return
    }
    if(this.previousOperand === ''
    && this.currentOperand !== ''
    && this.tempOperation !== undefined
    && this.tempPrevious !== '' ){
      switch (this.tempOperation) {
        case '+':
          computation = current + tempPrev
          break
        case '-':
          computation = current - tempPrev
          break
        case '*':
          computation = tempPrev * current
          break
        case '÷':
          computation = current / tempPrev
          break
        default:
          return
      }
    } else {
      if (isNaN(prev) || isNaN(current)) return
      switch (this.operation) {
        case '+':
          computation = prev + current
          break
        case '-':
          computation = prev - current
          break
        case '*':
          computation = prev * current
          break
        case '÷':
          computation = prev / current
          break
        default:
          return
      }
      this.tempPrevious = this.currentOperand
      this.tempOperation = this.operation
    }
    this.currentOperand = parseFloat(computation.toFixed(8))
    this.operation = undefined
    this.previousOperand = ''

    if(!Number.isFinite(this.currentOperand)){
      alert('Слишком большое число!')
      calculator.clear()
    }
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand)
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
    if(currentOperandTextElement.innerText.length > 15){
      currentOperandTextElement.style.fontSize = '30px'
    } else{
      currentOperandTextElement.style.fontSize = '40px'
    }
  }
}

const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const negativeButton = document.querySelector('[data-negative]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
  })
})

equalsButton.addEventListener('click', button => {
  calculator.compute()
  calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
  calculator.clear()
  calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
  calculator.delete()
  calculator.updateDisplay()
})

negativeButton.addEventListener('click', button => {
  calculator.negativeNumber()
  calculator.updateDisplay()
})

document.addEventListener('keydown', function(event) {
  numberButtons.forEach(button =>{
    if (event.code == `Numpad${button.innerText}`) {
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay()
    }}) 
  if (event.code == 'Delete'){
    calculator.clear()
    calculator.updateDisplay()
  } else if (event.code == 'Backspace') {
    calculator.delete()
    calculator.updateDisplay()
  } else if (event.code == 'NumpadDivide') {
    calculator.chooseOperation(operationButtons[0].innerText)
    calculator.updateDisplay()
  } else if (event.code == 'NumpadMultiply') {
    calculator.chooseOperation(operationButtons[1].innerText)
    calculator.updateDisplay()
  } else if (event.code == 'NumpadAdd') {
    calculator.chooseOperation(operationButtons[2].innerText)
    calculator.updateDisplay()
  } else if (event.code == 'NumpadSubtract') {
    calculator.chooseOperation(operationButtons[3].innerText)
    calculator.updateDisplay()
  } else if (event.code == 'NumpadEnter') {
    event.preventDefault()
    calculator.compute()
    calculator.updateDisplay()
  } else if (event.code == 'NumpadDecimal') {
    calculator.appendNumber(numberButtons[9].innerText)
    calculator.updateDisplay()
  }
});