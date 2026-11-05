(function(){
  // Accordion Q&A
  document.querySelectorAll('.qa > button').forEach(function(b){
    b.addEventListener('click',function(){
      var a=b.nextElementSibling, open=!a.classList.contains('hidden');
      document.querySelectorAll('.qa .a').forEach(function(x){x.classList.add('hidden');});
      document.querySelectorAll('.qa > button .n').forEach(function(x){x.textContent='▸';});
      if(!open){a.classList.remove('hidden');b.querySelector('.n').textContent='▾';}
    });
  });
  // Checklist persist cd_k6
  var cb=document.getElementById('cd-k6-checklist');
  try{if(localStorage.getItem('cd_k6_done')==='1'&&cb)cb.checked=true;}catch(e){}
  if(cb)cb.addEventListener('change',function(){
    try{localStorage.setItem('cd_k6_done',cb.checked?'1':'0');}catch(e){}
  });
})();
