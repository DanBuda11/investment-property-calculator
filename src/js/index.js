// Set which "page" to show
let currentPage = 'cf';
// Buttons
const cashFlowBtn = document.getElementById('btn__cashflow');
const breakevenBtn = document.getElementById('btn__breakeven');
const mortgageBtn = document.getElementById('btn__mortgage');
const ownershipBtn = document.getElementById('btn__ownership');
// Description block
const desc = document.querySelector('.description__text');
// Form
const form = document
  .getElementById('form')
  .addEventListener('submit', runCalculations);
// Put cards, inputs & labels into arrays
const cards = Array.from(document.querySelectorAll('.form__card'));
const inputs = Array.from(document.querySelectorAll('.form__item'));
const labels = Array.from(document.querySelectorAll('label'));
// Output sections
const answer = document.getElementById('answer');
const errorMsg = document.getElementById('error');

// Show/hide inputs & labels based on which "page" is shown
function displayInputs(type) {
  cards.map(card => {
    if (card.contains(card.querySelector(`.${type}`))) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Clear all inputs
function clearInputs() {
  answer.textContent = '';
  errorMsg.textContent = '';
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].style.border = 'none';
    inputs[i].style.borderBottom = '2px solid #143642';
    labels[i].style.color = '#143642';
  }
}

// Change which "page" is shown
function displayPages(arg) {
  currentPage = arg;

  if (arg === 'cf') {
    cashFlowBtn.style.backgroundColor = '#143642';
    breakevenBtn.style.backgroundColor = '#1E9EB5';
    mortgageBtn.style.backgroundColor = '#1E9EB5';
    ownershipBtn.style.backgroundColor = '#1E9EB5';
    desc.textContent =
      'Calculate the monthly cash flow for an investment property.';
  } else if (arg === 'be') {
    breakevenBtn.style.backgroundColor = '#143642';
    cashFlowBtn.style.backgroundColor = '#1E9EB5';
    mortgageBtn.style.backgroundColor = '#1E9EB5';
    ownershipBtn.style.backgroundColor = '#1E9EB5';
    desc.textContent =
      'Calculate the purchase price for a potential investment property that gives a specific monthly cash flow.';
  } else if (arg === 'mp') {
    mortgageBtn.style.backgroundColor = '#143642';
    cashFlowBtn.style.backgroundColor = '#1E9EB5';
    breakevenBtn.style.backgroundColor = '#1E9EB5';
    ownershipBtn.style.backgroundColor = '#1E9EB5';
    desc.textContent = 'Calculate the monthly mortgage payment for a property.';
  } else {
    ownershipBtn.style.backgroundColor = '#143642';
    mortgageBtn.style.backgroundColor = '#1E9EB5';
    cashFlowBtn.style.backgroundColor = '#1E9EB5';
    breakevenBtn.style.backgroundColor = '#1E9EB5';
    desc.textContent = 'Calculate the monthly ownership costs for a property.';
  }
  clearInputs();
  displayInputs(arg);
}

// Run on load after setting variables to only show cashflow inputs
displayPages(currentPage);

// Format & display result on page
function displayResult(result) {
  result = Math.round(result);
  if (result < 0) {
    answer.style.color = '#A8201A';
    result = result * -1;
    currentPage === 'be'
      ? (answer.textContent = `-$${result}`)
      : (answer.textContent = `-$${result}/mo.`);
  } else {
    answer.style.color = `#143642`;
    currentPage === 'be'
      ? (answer.textContent = `$${result}`)
      : (answer.textContent = `$${result}/mo.`);
  }
}

function validate() {}

// Calculate and display the answer/amount
function runCalculations(e) {
  e.preventDefault();
  answer.textContent = '';
  errorMsg.textContent = '';

  // Check for any empty inputs
  let counter = 0;
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value === '' && cards[i].style.display !== 'none') {
      inputs[i].style.borderBottom = '2px solid #A8201A';
      labels[i].style.color = '#A8201A';
      counter++;
    } else {
      inputs[i].style.borderBottom = '2px solid #143642';
      labels[i].style.color = '#143642';
    }
  }
  if (counter > 0) {
    errorMsg.textContent = 'Invalid Inputs';
    return;
  }

  let result;

  const values = {
    price: parseFloat(document.getElementById('salesPrice').value),
    downPmt: parseFloat(document.getElementById('downPayment').value),
    closing: parseFloat(document.getElementById('closingCosts').value),
    term: parseFloat(document.getElementById('mortgageTerm').value) * 12,
    rate: parseFloat(document.getElementById('interestRate').value) / 100 / 12,
    pmi: parseFloat(document.getElementById('pmi').value),
    taxes: parseFloat(document.getElementById('taxes').value) / 12,
    ins: parseFloat(document.getElementById('insurance').value) / 12,
    maint: parseFloat(document.getElementById('maintenance').value) / 12,
    hoa: parseFloat(document.getElementById('hoaDues').value),
    util: parseFloat(document.getElementById('utilities').value),
    propMgmt: parseFloat(document.getElementById('propManagement').value),
    vacancy: parseFloat(document.getElementById('vacancy').value) / 365,
    rent: parseFloat(document.getElementById('rent').value),
    profit: parseFloat(document.getElementById('profit').value),
  };

  // Calculations used in multiple formulas
  const loanAmt = values.price - values.downPmt + values.closing;
  const payment =
    (loanAmt * (values.rate * Math.pow(1 + values.rate, values.term))) /
    (Math.pow(1 + values.rate, values.term) - 1);
  const weightedIncome = values.rent - values.rent * (values.vacancy / 365);
  const fixedCosts =
    values.pmi +
    values.taxes +
    values.ins +
    values.maint +
    values.hoa +
    values.util +
    values.propMgmt;

  // Basic mortgage payment formula is:
  // P = L * [c(1 + c)^n] / [(1 + c)^n - 1]
  // Where:
  // P = payment
  // L = loan amount
  // c = monthly interest rate
  // n = loan term (in months)

  // Calculation for Cash Flow page
  if (currentPage === 'cf') {
    result = weightedIncome - payment - fixedCosts;
    // Calculation for Breakeven page
  } else if (currentPage === 'be') {
    let loan =
      (weightedIncome - values.profit - fixedCosts) /
      ((values.rate * Math.pow(1 + values.rate, values.term)) /
        (Math.pow(1 + values.rate, values.term) - 1));

    result = loan + values.downPmt - values.closing;
    // Calculation for Mortgage Payment page
  } else if (currentPage === 'mp') {
    result = payment;
    // Calculation for Ownership Costs page
  } else if (currentPage === 'ow') {
    result =
      payment +
      values.pmi +
      values.taxes +
      values.ins +
      values.maint +
      values.hoa;
  }
  displayResult(result);
}
