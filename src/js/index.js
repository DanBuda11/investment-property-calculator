// Set which "page" to show
let currentPage = 'cf';
// Buttons
const cashFlowBtn = document.getElementById('btn__cashflow');
const breakevenBtn = document.getElementById('btn__breakeven');
const mortgageCalcBtn = document.getElementById('btn__mortgage');
// Description block
const desc = document.querySelector('.description__text');
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
    mortgageCalcBtn.style.backgroundColor = '#0F8B8D';
    desc.textContent =
      'Calculate the monthly cash flow for an investment property.';
  } else if (arg === 'be') {
    breakevenBtn.style.backgroundColor = '#143642';
    cashFlowBtn.style.backgroundColor = '#0F8B8D';
    mortgageCalcBtn.style.backgroundColor = '#0F8B8D';
    desc.textContent =
      'Calculate the purchase price for a potential investment property that gives a monthly cash flow of $0.';
  } else {
    mortgageCalcBtn.style.backgroundColor = '#143642';
    cashFlowBtn.style.backgroundColor = '#0F8B8D';
    breakevenBtn.style.backgroundColor = '#0F8B8D';
    desc.textContent = 'Calculate the monthly mortgage payment for a property.';
  }
  displayInputs(arg);
}

// Can also split inputs into categories w/titles which will make it look better on
// larger screens where I can make more distinct sections

// Clear all inputs
function clearInputs() {
  answer.innerHTML = '';
  errorMsg.innerHTML = '';
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].style.border = 'none';
    inputs[i].style.borderBottom = '2px solid #143642';
    labels[i].style.color = '#143642';
  }
}

// Calculate and display the answer/amount
function runCalculations() {
  answer.innerHTML = '';
  errorMsg.innerHTML = '';
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
    errorMsg.innerHTML = 'Invalid Inputs';
    return;
  }

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
    // Calculate cash flow
    let grossExpense = payment + fixedCosts;
    let final = weightedIncome - grossExpense;
    let finalFixed = Math.round(final);

    // Format calculation style for positive/negative cash flow
    if (finalFixed < 0) {
      answer.style.color = '#a8201a';
      finalFixed = finalFixed * -1;
      answer.innerHTML = '-$' + finalFixed + '/mo.';
    } else {
      answer.style.color = '#143642';
      answer.innerHTML = '$' + finalFixed + '/mo.';
    }

    // Calculation for Breakeven page
  } else if (currentPage === 'be') {
    // find the sales price amount where the cash flow is $0
    // cash flow = weighted rent income - expenses - mortgage payment
    // $0 = weighted rent income - expenses - mortgage payment
    // mortgage payment = loan amount * (interest rate & loan term calculation)
    // mortgage payment = weighted rent income - expenses
    // weighted rent income - expenses = loan amount * (interest & term calculation)
    // (weighted rent income - expenses) / (interest & term calc) = loan amount
    // Also add ability to preset a desired cash flow

    // tempVar should be equal to loan amount
    let tempVar =
      (weightedIncome - fixedCosts) /
      ((values.rate * Math.pow(1 + values.rate, values.term)) /
        (Math.pow(1 + values.rate, values.term) - 1));

    // Then loan amount (tempVar) + downPayment - closingCosts = price
    let price = tempVar + values.downPmt - values.closing;

    // P / [c(1 + c)^n] / [(1 + c)^n - 1] = L

    // then add down payment back which gives sales price
    // let salesPrice = loanAmt + parseFloat(downPayment.value);

    answer.style.color = '#143642';
    answer.innerHTML = '$' + Math.round(price);
  } else if (currentPage === 'mp') {
    // Should I add any other expense to this? HOA? Maintenance? It would then change from being a mortgage payment (inclusive of escrow) to a total monthly cost of home ownership

    let totalCost = payment + values.taxes + values.ins;

    answer.style.color = '#143642';
    answer.innerHTML = '$' + Math.round(totalCost);
  }
}
