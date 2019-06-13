// Set which "page" to show
let currentPage = 'cf';
// Buttons
const cashFlowBtn = document.getElementById('btn__cashflow');
const breakevenBtn = document.getElementById('btn__breakeven');
const mortgageCalcBtn = document.getElementById('btn__mortgage');
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
  } else if (arg === 'be') {
    breakevenBtn.style.backgroundColor = '#143642';
    cashFlowBtn.style.backgroundColor = '#0F8B8D';
    mortgageCalcBtn.style.backgroundColor = '#0F8B8D';
  } else {
    mortgageCalcBtn.style.backgroundColor = '#143642';
    cashFlowBtn.style.backgroundColor = '#0F8B8D';
    breakevenBtn.style.backgroundColor = '#0F8B8D';
  }
  displayInputs(arg);
}

// Can also split inputs into categories w/titles which will make it look better on
// larger screens where I can make more distinct sections

// PUT A LOT OF NOTES IN THE FUNCTION TO CALCULATE CASH FLOW

// Write out equation here prior to coding:
// sales price - down payment = mortgage amount needed
// mortgage term, interest rate go into mortgage calculation
// PMI is monthly cost added to monthly expense
// Property taxes are annual expense (divide by 12)
// insurance is annual (divide by 12)
// maintenance is annual (divide by 12)
// HOA dues, utilities, prop management all monthly
// vacancy rate (days per year) factored in after calculating gross cash flow
// monthly rent and other income added then subtract total expenses for final number to show on screen

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
function calculate() {
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

  // Capture all the input values into one object and change code to be able to pull from this instead of setting all the const's at the top of the code
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
  let loanAmt = values.price - values.downPmt + values.closing;
  let payment =
    (loanAmt * (values.rate * Math.pow(1 + values.rate, values.term))) /
    (Math.pow(1 + values.rate, values.term) - 1);

  let weightedIncome = rent.value - rent.value * (vacancy.value / 365);

  // Do I want to keep this fixed costs as is? I should probably only include those costs that are in all 3 formulas then add any others back in after
  // I know I at least need:
  // loan amount, mortgage payment amount, divide taxes by 12, divide insurance by 12, divide interest rate by 12, multiply mortgage term by 12
  let fixedCosts =
    parseFloat(pmi.value) +
    parseFloat(taxes.value) / 12 +
    parseFloat(insurance.value) / 12 +
    parseFloat(maintenance.value) / 12 +
    parseFloat(hoaDues.value) +
    parseFloat(utilities.value) +
    parseFloat(propManagement.value);

  // Calculation for Cash Flow page
  if (currentPage === 'cashflow') {
    // Need to solve for the monthly payment:
    // P = monthly payment
    // L = loan amount
    // n = loan term (in months)
    // c = monthly interest rate
    // P = L * [c(1 + c)^n] / [(1 + c)^n - 1]

    // Calculate cash flow
    let grossExpense = payment + fixedCosts;
    let final = weightedIncome - grossExpense;
    let finalFixed = Math.round(final);

    // Before showing final cash flow, check if positive or
    // negative and style accordingly

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
  } else if (currentPage === 'breakeven') {
    // Output needs to be the sales price at which the breakeven cashflow
    // occurs, and additionally the sales price at which desired cashflow
    // occurs

    // For now make separate variables for this page but later try
    // and use the ones from cashflow page in case user wants to switch
    // back and forth between pages

    // Equation:
    // Add all expenses together and take rent and subtract all expenses
    // to solve for sales price; will need to reverse calculate mortgage
    // amount after taking out all expenses
    // Rent - all expenses other than mortgage = X
    // then calculate sales prices based on mortgage of X amount

    let remainder = weightedIncome - fixedCosts;
    // remainder will equal monthly mortgage payment so solve for loan amount

    // So:
    // P / [c(1 + c)^n] / [(1 + c)^n - 1] = L

    // then add down payment back which gives sales price
    let salesPrice = loanAmt + parseFloat(downPayment.value);

    answer.style.color = '#143642';
    answer.innerHTML = '$' + Math.round(salesPrice);

    // Also will need to check for any empty fields on submit and provide obvious error messages
    // Don't empty form fields on submit - allow user to change 1 or more and recalculate

    //			P = L * [c(1 + c)^n] / [(1 + c)^n - 1]
    // P is monthly payment
    // L is loan amount
    // n is MONTHS of loan term
    // c is MONTHLY interest rate

    // Breakeven price is the sales price which gives a $0 monthly cash flow
    // So take monthly, vacancy-adjusted rent and subtract all non-mortgage costs
    // prop management fees, utilities, hoa dues, annual (monthly) maintenance,
    // insurance, prop taxes, PMI

    // Then remainder should be what needs to equal monthly payment, then solve
    // for loan amount and add down payment back (?) which gives sales price

    // Variables needed for calculation:
    // down payment
    // closing costs
    // mortgage term
    // interest rate
    // PMI
    // prop taxes
    // insurance
    // maintenance
    // HOA dues
    // utilities
    // prop mgmt fees
    // vacancy rate
    // rent

    // calculate sales price that gives an exact $0 cash flow (later to be
    // changed to allow user to set a desired cash flow when calculating)
  } else if (currentPage === 'mortgage') {
    // here's where the simple mortgage calculator goes
    // need sales price, down payment, loan amount, decide on $ vs %, interest rate,
    // loan term, prop tax, homeowners insurance, HOA(?), closing costs(?)
    // Need to solve for monthly mortgage amount then add prop tax, insurance, maybe HOA for final amount
    // Based on down payment amount, purchase price, interest rate, loan term

    // Overall formula is:
    // principal * (monthly rate * (1 + monthly rate)^(payment months total) /
    // ((1 + monthly rate)^(payment months) - 1))

    let totalCost = payment + values.taxes + values.ins;

    answer.style.color = '#143642';
    answer.innerHTML = '$' + Math.round(totalCost);
  }
}

function calculateBreakeven() {
  let nonMortgageCosts =
    parseFloat(bPmi.value) +
    parseFloat(bTaxes.value) / 12 +
    parseFloat(bInsurance.value) / 12 +
    parseFloat(bMaintenance.value) / 12 +
    parseFloat(bHoaDues.value) +
    parseFloat(bUtilities.value) +
    parseFloat(bPropManagement.value);

  let effectiveRent =
    parseFloat(bRent.value) -
    (parseFloat(bVacancy.value) / 365) * parseFloat(bRent.value);

  let remainder = effectiveRent - nonMortgageCosts;

  // Now need to calculate sales price based on remainder being the exact amount of the mortgage payment

  //			P = L * [c(1 + c)^n] / [(1 + c)^n - 1]
  // P is monthly payment
  // L is loan amount
  // n is MONTHS of loan term
  // c is MONTHLY interest rate

  // 6 = 3 * 2
  // i know 6 (P) and I know 2 but not 3
  // so 6 / 2 = 3
  // so P / everything except L = L

  let bInt = parseFloat(bInterestRate.value) / 12;
  let bTerm = parseFloat(bMortgageTerm.value) * 12;
  let blob = Math.pow(1 + bInt, bTerm);

  let bLoanAmt = remainder / ((bInt * blob) / (blob - 1));

  // Need to convert down payment from percentage to dollar amount
  // and redo equation
  let bSalesPrice = bLoanAmt + parseFloat(bClosingCosts.value);
}
