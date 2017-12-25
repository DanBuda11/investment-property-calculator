// Variables for each page/tab. Will not need these once
// I switch to a single set of inputs
const cashFlow = document.getElementById('cashFlow');
// const breakeven = document.getElementById('breakeven');

// Variable to set which page is being shown
let currentPage = 1;

// Variables for buttons
const cashFlowBtn = document.querySelector('.btn-cashflow-nav');
const breakevenBtn = document.querySelector('.btn-breakeven-nav');

// Will need to change all from id to class because I need to
// reuse most of them on each tab page
	// Or do I? What if I just greyed out the inputs not being
	// used on each tab and just change the functionality of
	// the buttons when you change pages. That way I only need
	// 1 of each input!!!
		// Don't grey out, just completely hide

// const formGroup = document.querySelector('.form-group');
const inputs = document.querySelectorAll('.form-control');
const labels = document.querySelectorAll('label');
// console.log(labels);
// Variables for input fields
const salesPrice = document.getElementById('salesPrice');
const salesPriceLabel = document.getElementById('salesPriceLabel');
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

// Variables for Clear and Calculate buttons on bottom of page
const clear = document.getElementById('clear');
const calculate = document.getElementById('calculate');

// Variable for the answer section that shows the calculated amount (regardless of
// which page is currently visible)
const answer = document.getElementById('answer');

// Get the current year and set the copyright date to the current year
	// Maybe also make this a range (so next year it would show 2017-2018)
	// Which means an if statement to see if current year 2017 then only show "2017"
	// but if not 2017 show 2017-"current year"
const copyright = document.getElementById('copyright');
const today = new Date();
const year = today.getFullYear();
copyright.textContent = year;

// cashFlowBtn.style.backgroundColor = '#143642';

// Maybe instead of duplicating the HTML and JS shit with (for example) multiple
	// interest rate inputs for different pages, have 1 set of inputs and just grey
	// out the ones not used for certain pages. Will also make it easier to do 
	// multiple calculations when switching pages because the info should still be there

// Can also split inputs into categories w/titles which will make it look better on
// larger screens where I can make more distinct sections

// Functions to "switch pages" by clicking the tabs at the top of
// the page. These will need to be redone as I'm not "showing" or "hiding"
// pages anymore, just replacing buttons and/or button functionality
// and the colors of the top-of-page buttons/tabs
function showCashFlow() {
	// if (cashFlow.style.display = 'none') {
	// 	cashFlow.style.display = 'block';
	// 	breakeven.style.display = 'none';
	// 	cashFlowBtn.style.backgroundColor = '#143642';
	// 	breakevenBtn.style.backgroundColor = '#0F8B8D';
	// 	currentPage = 1;
	// }
	cashFlowBtn.style.backgroundColor = '#143642';
	breakevenBtn.style.backgroundColor = '#0F8B8D';
	currentPage = 1;
	// salesPrice.disabled = false;
	// salesPrice.style.backgroundColor = '#FFF';
	salesPrice.style.display = 'inline-block';
	salesPriceLabel.style.display = 'inline-block';
}

function showBreakeven() {
	// if (breakeven.style.display = 'none') {
	// 	breakeven.style.display = 'block';
	// 	cashFlow.style.display = 'none';
	// 	breakevenBtn.style.backgroundColor = '#143642';
	// 	cashFlowBtn.style.backgroundColor = '#0F8B8D';
	// 	currentPage = 2;
	// 	salesPrice.disabled = true;
	// }
	breakevenBtn.style.backgroundColor = '#143642';
	cashFlowBtn.style.backgroundColor = '#0F8B8D';
	currentPage = 2;
	// salesPrice.disabled = true;
	// salesPrice.style.backgroundColor = '#DAD2D8';
	salesPrice.style.display = 'none';
	salesPriceLabel.style.display = 'none';

}

// When switching between tabs, make sure to populate the input
	// values if any exist from user typing any in on another tab

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

// clear.addEventListener('click', clearForm);
// calculate.addEventListener('submit', calculateForm);

// function clearForm() {
// 	console.log('working');
// 	salesPrice.value === '';
// 	console.log(salesPrice);
// 	console.log(salesPrice.value);
// }


// Do I need this function anymore?
function clearForm() {
	answer.innerHTML = '';
}

// Also will need to check for any empty fields on submit and provide obvious error messages
// Don't empty form fields on submit - allow user to change 1 or more and recalculate
// Put red border around empty input fields and change label font color to red
	// if input field empty when hit Calculate button


// Function to run whenever Calculate button clicked
function calculateAmt() {

	let counter = 0;
	// Validate input fields & make sure none empty prior to running calculation
	// Can I do this by iterating over all input fields instead of checking each individually?
	// If empty, put red border around input fields and change label font color to red
	for (let i = 0; i < inputs.length; i++) {
		
		if (inputs[i].value === '') {
			inputs[i].style.border = '1px solid #A8201A';
			labels[i].style.color = '#A8201A';
			counter++;
		} else {
			inputs[i].style.border = 'none';
			labels[i].style.color = '#143642';
		}
	}

	if (counter > 0) {
		return;
	}

	// Variables used in multiple calculations
	let weightedIncome = rent.value - (rent.value * (vacancy.value / 365));
	let fixedCosts = parseFloat(pmi.value) + (parseFloat(taxes.value) / 12) + (parseFloat(insurance.value) / 12) + (parseFloat(maintenance.value) / 12) + parseFloat(hoaDues.value) + parseFloat(utilities.value) + parseFloat(propManagement.value);

	// Calculation for Cash Flow page
	if (currentPage === 1) {

		// Need to solve for the monthly payment:
			// P = monthly payment
			// L = loan amount
			// n = loan term (in months)
			// c = monthly interest rate
			// P = L * [c(1 + c)^n] / [(1 + c)^n - 1]
		
		let loanAmt = parseFloat(salesPrice.value) - parseFloat(downPayment.value) + parseFloat(closingCosts.value); // this is L
		let mInt = parseFloat(interestRate.value) / 100 / 12; // this is c
		let mTerm = parseFloat(mortgageTerm.value) * 12; // this is n
		let payment = loanAmt * (mInt * Math.pow((1 + mInt), mTerm)) / (Math.pow((1 + mInt), mTerm) - 1); // this is P
		
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
			answer.innerHTML = '$' + finalFixed + '/mo.'
		}

		

	// Calculation for Breakeven page
	} else if (currentPage === 2) {
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




			
	}
	
}





function calculateBreakeven() {
	let nonMortgageCosts = parseFloat(bPmi.value) + (parseFloat(bTaxes.value) / 12) + (parseFloat(bInsurance.value) / 12) + (parseFloat(bMaintenance.value) / 12) + parseFloat(bHoaDues.value) + parseFloat(bUtilities.value) + parseFloat(bPropManagement.value);
	console.log('nonMortgageCosts: ', nonMortgageCosts);

	let effectiveRent = parseFloat(bRent.value) - (parseFloat(bVacancy.value) / 365 * parseFloat(bRent.value));
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
	let blob = Math.pow((1 + bInt), bTerm);

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