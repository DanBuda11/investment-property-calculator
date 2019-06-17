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
// Put inputs & labels into arrays
const inputs = Array.from(document.querySelectorAll('.form__item'));
const labels = Array.from(document.querySelectorAll('label'));
// Output sections
const answer = document.getElementById('answer');
const errorMsg = document.getElementById('error');
// Show/hide inputs & labels based on which "page" is shown
function displayInputs(type) {
  inputs.map(input => {
    input.classList.contains(type)
      ? ((input.style.display = 'inline-block'),
        (document.getElementById(`${input.id}Label`).style.display =
          'inline-block'))
      : ((input.style.display = 'none'),
        (document.getElementById(`${input.id}Label`).style.display = 'none'));
  });
}

// Change which "page" is shown
function displayPages(arg) {
  currentPage = arg;

  if (arg === 'cf') {
    cashFlowBtn.style.backgroundColor = '#143642';
    breakevenBtn.style.backgroundColor = '#0F8B8D';
    mortgageBtn.style.backgroundColor = '#0F8B8D';
    ownershipBtn.style.backgroundColor = '#0F8B8D';
    desc.textContent =
      'Calculate the monthly cash flow for an investment property.';
  } else if (arg === 'be') {
    breakevenBtn.style.backgroundColor = '#143642';
    cashFlowBtn.style.backgroundColor = '#0F8B8D';
    mortgageBtn.style.backgroundColor = '#0F8B8D';
    ownershipBtn.style.backgroundColor = '#0F8B8D';
    desc.textContent =
      'Calculate the purchase price for a potential investment property that gives a specific monthly cash flow.';
  } else if (arg === 'mp') {
    mortgageBtn.style.backgroundColor = '#143642';
    cashFlowBtn.style.backgroundColor = '#0F8B8D';
    breakevenBtn.style.backgroundColor = '#0F8B8D';
    ownershipBtn.style.backgroundColor = '#0F8B8D';
    desc.textContent = 'Calculate the monthly mortgage payment for a property.';
  } else {
    ownershipBtn.style.backgroundColor = '#143642';
    mortgageBtn.style.backgroundColor = '#0F8B8D';
    cashFlowBtn.style.backgroundColor = '#0F8B8D';
    breakevenBtn.style.backgroundColor = '#0F8B8D';
    desc.textContent = 'Calculate the monthly ownership costs for a property.';
  }
  clearInputs();
  displayInputs(arg);
}

// Run on load after setting variables to only show cashflow inputs
displayPages(currentPage);

// Can also split inputs into categories w/titles which will make it look better on
// larger screens where I can make more distinct sections

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

// Calculate and display the answer/amount
function runCalculations(e) {
  e.preventDefault();
  answer.textContent = '';
  errorMsg.textContent = '';

  // Start of validation code
  // Maybe pull validation out into a separate function?
  let counter = 0;
  // Validate input fields & make sure none empty prior to running calculation
  // Can I do this by iterating over all input fields instead of checking each individually?
  // If empty, put red border around input fields and change label font color to red
  for (let i = 0; i < inputs.length; i++) {
    // Add another if() to check to see if input field is hidden and skip it from
    // the if() for value === ''

    // Actually check if (inputs[i].style.display !== 'hidden')

    // Prior to checking input fields, need to remove any disabled/hidden fields so
    // it doesn't fuck up the validation
    // Like for breakeven, the Sales Price input will be hidden, so you don't want to
    // validate it if you're calculating breakeven

    if (inputs[i].value === '' && inputs[i].style.display !== 'none') {
      inputs[i].style.borderBottom = '2px solid #A8201A';
      labels[i].style.color = '#A8201A';
      counter++;
    } else {
      inputs[i].style.borderBottom = '2px solid #143642';
      labels[i].style.color = '#143642';
    }
  }

  if (counter > 0) {
    answer.style.padding = '0';
    errorMsg.textContent = 'Invalid Inputs';
    return;
  }

  let result;

  // Can I use this for validation? Check for null/undefined values?
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
