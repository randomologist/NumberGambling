function red(num){
  const out = document.createElement('span');
  out.innerText="$"+num;
  out.style.color = "red";
  return out;
}
function green(num){
  const out = document.createElement('span');
  out.innerText="$"+num;
  out.style.color = "green";
  return out;
}
let marketVal = 500;
let rentVal = 100;
let bank = 300;
let viz = document.getElementById("game-viz");
const dayVals = [0];
const marketVals = [500];
let graph = new Chart(viz, {
  type: "line",
  data: {
    labels: dayVals,
    datasets: [{
      fill: false,
      lineTension: 0,
      backgroundColor: "rgba(0,0,255,1.0)",
      borderColor: "rgba(0,0,255,0.1)",
      data: marketVals
    }]
  },
  options: {
    plugins: {
      legend: {display:false},
      title: {
        display: true,
        text: "Market Tracker",
        font: {size:16}
      }
    }
  }
});
const bankNum = document.getElementById("bank-value");
bankNum.innerText = bank;
const rentNum = document.getElementById("rent-amount");
rentNum.innerText = rentVal;
const marketNum = document.getElementById("market-value");
marketNum.innerText = "$"+marketVal;
const logs = document.getElementById("logs");
function dispLog(...elems){
  const entry =  document.createElement("div");
  entry.append(...elems);
  logs.appendChild(entry);
  logs.scrollTop = logs.scrollHeight;
  entry.style.backgroundColor="#61baff";
  return entry;
}
let dayLog = dispLog("Day 0, Bank:$", bank," Market: $", marketVal);
dayLog.setAttribute("id","day0-log");
function upLog(...elems){
  const entry =  document.createElement("div");
  entry.append(...elems);
  dayLog.appendChild(entry);
  dayLog.scrollTop = logs.scrollHeight;
  return entry;
}
function prepSpan(...elems){
  const entry =  document.createElement("span")
  entry.append(...elems);
  return entry;
}
const attacher = document.getElementById("attach-btn");
let attState = false
attacher.addEventListener('click',function(){
  attState = !attState;
  if(attState == true){
    attacher.innerText="Detach";
  }
  else{
    attacher.innerText = "Attach";
  }
})
let logged = false;
let loaner = document.getElementById("loan-btn");
let loanBox = document.getElementById("loan-input");
let loanState = false;
let loanVal = NaN;
let initLoan = NaN;
loaner.addEventListener('click',function(){
  //console.log("init" + loanVal);
  if(loanState == false){ //was not borrowing and now is
    loanVal = loanBox.valueAsNumber;
    initLoan = loanVal;
    //console.log("loanchange" + loanVal);
    if(isNaN(loanVal)){
      alert("Fill in the amount you want to borrow");
    }
    else if(loanVal <=0){
      alert("Borrowing amount must be greater than 0")
      loanBox.select();
    }
    else if(loanVal > marketVal){
      alert("Borrowing amount cannot exceed market value")
      loanBox.select();
    }
    else{//loan went through
      loanState = true;
      bank += loanVal;
      loanBox.disabled = true;
      loaner.innerText="Pay back";
    }
  }
  else if(loanState == true){
    //console.log(loanState);
    if(bank < loanVal){
      alert("You cannot afford to pay back your loan")
    }
    else{//payback went through
      //console.log("loanval" + loanVal);
      loanState = false;
      loanBox.disabled = false;
      bank -= loanVal;
      loaner.innerText="Borrow";
      if(logged ==true){
        upLog("Paid back ",red(loanVal));
        logged = false;
      }
    }
  }
  bankNum.innerText=bank;
})
let countdown = 10;
const countNum = document.getElementById("rent-time");
countNum.innerText = ` in ${countdown} days`;
const time = document.getElementById("continue-btn");
const dayNum = document.getElementById("day-num");
let days = 0;
const change=document.getElementById("market-change");
let lastAtt = false;
time.addEventListener('click',function(){
  let flux = Math.floor(Math.random()*(-20-21)+21);
  let vecFlux = ((flux>0)?"+"+Math.abs(flux):flux)
  marketVal +=flux;
  change.innerText = " [" + vecFlux +"]";
  marketNum.innerText = "$"+marketVal;
  fluxColor = (flux>0)?"green":"red";
  marketNum.style.color= fluxColor;
  change.style.color = fluxColor;
  if(loanState==true){
    if(logged == false){
      upLog("Borrowed ",green(loanVal));
      logged=true;
    }
      //payback ceiling
      //console.log(initLoan);
      loanVal = Math.min(marketVal,initLoan);
      loanBox.value = loanVal;
      //console.log(loanBox.value);
      //console.log("boxchanged?" + loanVal);
  }
  if(lastAtt != attState){
    upLog((attState)?"Attached to ":"Detached from ","market")
    lastAtt = attState;
  }
  if(attState ==true){
    bank+=flux;
    bankNum.innerText=bank;
    let normFlux = Math.abs(flux);
    let attVal = prepSpan((flux>0)?green(normFlux):red(normFlux));
    upLog((flux>=0)?"Gained ":"Lost " ,attVal," from market attachment");
  }
  countdown -=1;
  if(countdown == 1){
    countNum.innerText="!";
  }
  else{countNum.innerText = ` in ${countdown} days`;}
  days +=1;
  dayNum.innerText = days;
  if(countdown<=0){//rent check
    bank = bank-rentVal;
    if(bank<0){
      upLog("Rent cost ", red(rentVal),", You are ",red(Math.abs(bank)), " short!");
      dispLog("Game Over")
      document.getElementById("current").innerHTML = 
        `<main>
          <div>Game Over</div>
          <div>You lasted ${days} days</div>
          <div>Market: ${marketVal}</div>
          <div>Last rent cost: ${rentVal}</div>
        </main>`;
    }
    else{
      upLog("Paid ",red(rentVal), " for rent");
      rentVal+=20;
      countdown = 10;
      countNum.innerText = ` in ${countdown} days`;
      bankNum.innerText=bank;
      rentNum.innerText=rentVal;
    }
  }
  let marketLog = change.cloneNode(true);
  marketLog.removeAttribute("id");
  dayLog = dispLog("Day ",days,", Bank:$", bank," Market: $", marketVal,marketLog);
  dayLog.setAttribute("id",`day${days}-log`);
  prevLog = document.getElementById(`day${days-1}-log`);
  prevLog.style.backgroundColor="white";
  if(bank <0){
    dayLog.style.borderTop = "1px solid red";
    dayLog.style.backgroundColor="lightgray";
    dayLog.style.color="gray";
    marketLog.style.opacity="70%";
  }
  else{
    dayLog.style.borderTop="1px dotted";
  }
  
	dayVals.push(days);
  marketVals.push(marketVal);
  console.log(marketVals);
  graph.update();
})
