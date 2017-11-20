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
const otherIncome = document.getElementById('otherIncome');

const clear = document.getElementById('clear');
const calculate = document.getElementById('calculate');

const answer = document.getElementById('answer');
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

// Also will need to check for any empty fields on submit and provide obvious error messages
// Don't empty form fields on submit - allow user to change 1 or more and recalculate

//			P = L * [c(1 + c)^n] / [(1 + c)^n - 1]
// P is monthly payment
// L is loan amount
// n is MONTHS of loan term
// c is MONTHLY interest rate

// Math.pow(7, 2) = 49

function calculateForm() {
	// e.preventDefault();
	console.log('calc working');
	console.log('salesPrice amount: ', salesPrice.value);
	// answer.innerHTML ='hi';
	console.log('dp', downPayment.value);
	console.log('closing', closingCosts.value);
	let loanAmt = parseFloat(salesPrice.value) - parseFloat(downPayment.value) + parseFloat(closingCosts.value); // this is L
	console.log('loanAmt: ', loanAmt);
	let mInt = parseFloat(interestRate.value) / 100 / 12; // this is c
	console.log('mInt: ', mInt);
	let mTerm = parseFloat(mortgageTerm.value) * 12; // this is n
	console.log('mTerm: ', mTerm);

	let inner = Math.pow(1 + mInt, mTerm);
	let first = mInt * inner;
	let second = inner - 1;
	let final = loanAmt * first / second;
	console.log('final: ', final);



	// let payment = loanAmt * (mInt * Math.pow((1 + mInt), mTerm)) / (Math.pow((1 + mInt), mTerm) - 1);
	// console.log('payment: $', payment);

	// let test = 4.5 / 12;
	// console.log('test: ', test);
}













