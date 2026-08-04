let attacher = document.getElementById(attacher-btn);
let att_text = attacher.innerText;
let att_state = false
attacher.addEventListener('click',function(){
  att_state = !att_state;
  if(att_state == true){
    att_text = Detach;
  }
  else{
    att_text = Attach;
  }
})
