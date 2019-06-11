// Variable to set which page is being shown
let currentPage = 'cashflow';

// Variables for top buttons
const cashFlowBtn = document.getElementById('btn__cashflow');
const breakevenBtn = document.getElementById('btn__breakeven');
const mortgageCalcBtn = document.getElementById('btn__mortgage');

// Variables for input fields
// Could I make these all parseFloat(document.getELem....)?
const salesPrice = document.getElementById('salesPrice');
const downPayment = document.getElementById('downPayment');
const closingCosts = document.getElementById('closingCosts');
const mortgageTerm = document.getElementById('mortgageTerm');
const interestRate = document.getElementById('interestRate');
const pmi = document.getElementById('pmi');
const taxes = document.getElementById('taxes');
const insurance = document.getElementById('insurance');
const maintenance = document.getElementById('maintenance');
const hoaDues = document.getElementById('hoaDues');
const utilities = document.getElementById('utilities');
const propManagement = document.getElementById('propManagement');
const vacancy = document.getElementById('vacancy');
const rent = document.getElementById('rent');

// Grab all input fields; this is kinda a duplicate of inputs below but one is
// an array and the other is a NodeList
const inputFields = [].slice.call(document.querySelectorAll('.form__item'));
console.log(inputFields);

// Grab all labels
const labelEls = [].slice.call(document.querySelectorAll('label'));

// Do I need this?
const labelIds = labelEls.map(el => el.id);

// Variable for the answer section that shows the calculated amount (regardless of
// which page is currently visible)
const answer = document.getElementById('answer');
const errorMsg = document.getElementById('error');

// Store all input field names inside array for each calculation and loop over array when
// figuring out which input fields to show/hide when top button clicked
const cashflowInputs = [
  'salesPrice',
  'downPayment',
  'closingCosts',
  'mortgageTerm',
  'interestRate',
  'pmi',
  'taxes',
  'insurance',
  'maintenance',
  'hoaDues',
  'utilities',
  'propManagement',
  'vacancy',
  'rent',
];

const breakevenInputs = [
  'downPayment',
  'closingCosts',
  'mortgageTerm',
  'interestRate',
  'pmi',
  'taxes',
  'insurance',
  'maintenance',
  'hoaDues',
  'utilities',
  'propManagement',
  'vacancy',
  'rent',
];

const mortgageInputs = [
  'salesPrice',
  'downPayment',
  'closingCosts',
  'mortgageTerm',
  'interestRate',
  'pmi',
  'taxes',
  'insurance',
];

// Arrays to push the inputs into when running showInputs function
let show = [];
let hide = [];
let showLabels = [];
let hideLabels = [];

function showInputs(inputArray) {
  inputFields.map(input => {
    inputArray.includes(input.id) ? show.push(input) : hide.push(input);
    inputArray.includes(input.id)
      ? showLabels.push(document.getElementById(`${input.id}Label`))
      : hideLabels.push(document.getElementById(`${input.id}Label`));
  });

  // Do stuff here to show and hide inputs & their labels:
  show.map(input => {
    input.style.display = 'inline-block';
  });

  showLabels.map(input => {
    input.style.display = 'inline-block';
  });

  hide.map(input => {
    input.style.display = 'none';
  });

  hideLabels.map(input => {
    input.style.display = 'none';
  });

  // Then clear out show/hide arrays:
  show.length = 0;
  showLabels.length = 0;
  hide.length = 0;
  hideLabels.length = 0;
}

function handlePage(arg) {
  currentPage = arg; // set currentPage to coordinate with when calculate button is clicked to run calculation

  if (arg === 'cashflow') {
    // Change button colors
    cashFlowBtn.style.backgroundColor = '#143642';
    breakevenBtn.style.backgroundColor = '#0F8B8D';
    mortgageCalcBtn.style.backgroundColor = '#0F8B8D';

    showInputs(cashflowInputs);
  } else if (arg === 'breakeven') {
    // Change button colors
    breakevenBtn.style.backgroundColor = '#143642';
    cashFlowBtn.style.backgroundColor = '#0F8B8D';
    mortgageCalcBtn.style.backgroundColor = '#0F8B8D';

    showInputs(breakevenInputs);
  } else if (arg === 'mortgage') {
    // Change button colors
    mortgageCalcBtn.style.backgroundColor = '#143642';
    cashFlowBtn.style.backgroundColor = '#0F8B8D';
    breakevenBtn.style.backgroundColor = '#0F8B8D';

    showInputs(mortgageInputs);
  }
}

const inputs = document.querySelectorAll('.form__item');
console.log(inputs);
const labels = document.querySelectorAll('label');

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

function clearForm() {
  answer.innerHTML = '';
  errorMsg.innerHTML = '';
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].style.border = 'none';
    inputs[i].style.borderBottom = '2px solid #143642';
    labels[i].style.color = '#143642';
  }
}

// Function to run whenever Calculate button clicked
function calculateAmt() {
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

  // Variables used in multiple calculations
  let weightedIncome = rent.value - rent.value * (vacancy.value / 365);
  let loanAmt =
    parseFloat(salesPrice.value) -
    parseFloat(downPayment.value) +
    parseFloat(closingCosts.value); // this is L

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
  let mInt = parseFloat(interestRate.value) / 100 / 12; // this is c
  let mTerm = parseFloat(mortgageTerm.value) * 12; // this is n

  // Calculation for Cash Flow page
  if (currentPage === 'cashflow') {
    // Need to solve for the monthly payment:
    // P = monthly payment
    // L = loan amount
    // n = loan term (in months)
    // c = monthly interest rate
    // P = L * [c(1 + c)^n] / [(1 + c)^n - 1]

    let payment =
      (loanAmt * (mInt * Math.pow(1 + mInt, mTerm))) /
      (Math.pow(1 + mInt, mTerm) - 1); // this is P

    // Calculate cash flow
    let grossExpense = payment + fixedCosts;
    let final = weightedIncome - grossExpense;
    let finalFixed = Math.round(final);
    console.log('finalFixed: ', finalFixed);

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
    console.log('breakeven calc computing');

    // Breakeven page code

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
    // let mInt = parseFloat(interestRate.value) / 100 / 12; // this is c
    // let mTerm = parseFloat(mortgageTerm.value) * 12; // this is n

    let loanAmount =
      remainder /
      (mInt * Math.pow(1 + mInt, mTerm)) /
      (Math.pow(1 + mInt, mTerm) - 1);
    console.log('Loan Amount is: ', loanAmount);

    // then add down payment back which gives sales price
    let salesPrice = loanAmount + parseFloat(downPayment.value);

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

    // Calculate loan principal (P)
    // salesPrice - downPayment + closingCosts
    // let loanAmt =
    //   parseFloat(salesPrice.value) -
    //   parseFloat(downPayment.value) +
    //   parseFloat(closingCosts.value);
    console.log('loanAmt: ', loanAmt);
    let mTaxes = parseFloat(taxes.value) / 12;
    console.log('mTaxes: ', mTaxes);
    let mIns = parseFloat(insurance.value) / 12;
    console.log('mIns: ', mIns);
    console.log('mInt: ', mInt);
    console.log('mTerm: ', mTerm);
    console.log('pmi: ', parseFloat(pmi.value));

    // let top = ((1 + mInt) ^ mTerm) * mInt;
    // let bottom = ((1 + mInt) ^ mTerm) - 1;

    // let mortgageAmt =
    //   loanAmt * (top / bottom) + mTaxes + mIns + parseFloat(pmi.value);

    let payment =
      (loanAmt * (mInt * Math.pow(1 + mInt, mTerm))) /
      (Math.pow(1 + mInt, mTerm) - 1); // this is P

    // let mortgageAmt =
    //   (loanAmt * (mInt * ((1 + mInt) ^ mTerm))) / (((1 + mInt) ^ mTerm) - 1) +
    //   mTaxes +
    //   mIns +
    //   parseFloat(pmi.value);

    let totalCost = payment + mTaxes + mIns;

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
  console.log('nonMortgageCosts: ', nonMortgageCosts);

  let effectiveRent =
    parseFloat(bRent.value) -
    (parseFloat(bVacancy.value) / 365) * parseFloat(bRent.value);
  console.log('effectiveRent: ', effectiveRent);

  let remainder = effectiveRent - nonMortgageCosts;
  console.log('remainder: ', remainder);

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
  console.log('bLoanAmt: ', bLoanAmt);

  // Need to convert down payment from percentage to dollar amount
  // and redo equation
  let bSalesPrice = bLoanAmt + parseFloat(bClosingCosts.value);
  console.log('bSalesPrice: ', bSalesPrice);
}

// Possible solution for buttons: set a variable that changes each
// time a tab is clicked to "change pages" and run an if/else check
// when a bottom button is clicked to check which page is currently
// displayed in order to determine which calculation to run

// For display when changing "pages", show/hide the inputs/labels of inputs that
// are/aren't used by the "page's" calculations (eg: for breakeven, hide the
// sales price input & label)
