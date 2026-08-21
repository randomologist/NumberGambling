let market_val = 500;
let rent_val = 100;
let bank = 300;
let bank_num = document.getElementById("bank-value");
bank_num.innerText = bank;
let rent_num = document.getElementById("rent-amount");
rent_num.innerText = rent_val;
let market_num = document.getElementById("market-value");
market_num.innerText = "$"+market_val;
let attacher = document.getElementById("attach-btn");
let att_state = false
attacher.addEventListener('click',function(){
  att_state = !att_state;
  if(att_state == true){
    attacher.innerText="Detach";
  }
  else{
    attacher.innerText = "Attach";
  }
})
let logged = false;
let loaner = document.getElementById("loan-btn");
let loan_box = document.getElementById("loan-input");
let loan_state = false
let loan_val = NaN
loaner.addEventListener('click',function(){
  //console.log("init" + loan_val);
  if(loan_state == false){ //was not borrowing and now is
    loan_val = loan_box.valueAsNumber;
    //console.log("loanchange" + loan_val);
    if(isNaN(loan_val)){
      alert("Fill in the amount you want to borrow");
    }
    else if(loan_val <=0){
      alert("Borrowing amount must be greater than 0")
      loan_box.select();
    }
    else if(loan_val > market_val){
      alert("Borrowing amount cannot exceed market value")
      loan_box.select();
    }
    else{//loan went through
      loan_state = true;
      bank += loan_val;
      loan_box.disabled = true;
      loaner.innerText="Pay back";
    }
  }
  else if(loan_state == true){
    //console.log(loan_state);
    if(bank < loan_val){
      alert("You cannot afford to pay back your loan")
    }
    else{//payback went through
      //console.log("loanval" + loan_val);
      loan_state = false;
      loan_box.disabled = false;
      bank -= loan_val;
      loaner.innerText="Borrow";
      if(logged ==true){
        console.log("Paid back $" + loan_val);
        logged = false;
      }
    }
  }
  bank_num.innerText=bank;
})
let countdown = 10;
let count_num = document.getElementById("rent-time");
count_num.innerText = ` in ${countdown} days`;
let time = document.getElementById("continue-btn");
let day_num = document.getElementById("day-num");
let days = 0;
let change=document.getElementById("market-change");
time.addEventListener('click',function(){
  let flux = Math.floor(Math.random()*(-20-21)+21);
  market_val +=flux;
  change.innerText = " [" + ((flux>0)?"+"+Math.abs(flux):flux) +"]";
  market_num.innerText = "$"+market_val;
  flux_color = (flux>0)?"green":"red";
  market_num.style.color= flux_color;
  change.style.color = flux_color;
  if(loan_state==true){
    console.log("Borrowed $" + loan_val);
    logged=true;
  }
  if(market_val < loan_val){ //payback ceiling
    loan_val = market_val;
    loan_box.value = market_val;
    //console.log(loan_box.value);
    //console.log("boxchanged?" + loan_val);
  }
  if(att_state ==true){
    bank+=flux;
    bank_num.innerText=bank;
  }
  countdown -=1;
  if(countdown == 1){
    count_num.innerText="!";
  }
  else{count_num.innerText = ` in ${countdown} days`;}
  if(countdown<=0){//rent check
    if(bank - rent_val <0){
      document.getElementById("current").innerHTML = 
        `<main>
          <div>Game Over</div>
          <div>You lasted ${days} days</div>
          <div>Market: ${market_val}</div>
          <div>Last rent cost: ${rent_val}</div>
        </main>`;
    }
    else{
      bank = bank-rent_val;
      rent_val+=20;
      countdown = 10;
      count_num.innerText = ` in ${countdown} days`;
      bank_num.innerText=bank;
      rent_num.innerText=rent_val;
    }
  }
  days +=1;
  day_num.innerText = days;
})
