(function(){
  // Decision widgets: persist to localStorage cd_k5_*
  document.querySelectorAll('.decision-btns').forEach(function(box){
    var c=box.getAttribute('data-case');
    var saved=null;
    try{saved=JSON.parse(localStorage.getItem('cd_k5_'+c)||'null');}catch(e){}
    var termsBox=document.querySelector('[data-terms="'+c+'"]');
    function paint(v){
      box.querySelectorAll('.cbtn').forEach(function(b){b.classList.toggle('sel',b.getAttribute('data-v')===v);});
      if(termsBox)termsBox.classList.toggle('hidden',!(v==='conditional'||v==='restructure'));
    }
    if(saved&&saved.v){paint(saved.v);
      var w=document.getElementById('why-'+c); if(w&&saved.w)w.value=saved.w;
      var tm=document.getElementById('terms-'+c); if(tm&&saved.t)tm.value=saved.t;
      var s=document.getElementById('saved-'+c); if(s)s.textContent='Tersimpan '+saved.at;
    }
    box.querySelectorAll('.cbtn').forEach(function(b){
      b.addEventListener('click',function(){paint(b.getAttribute('data-v'));persist();});
    });
    function persist(){
      var v=box.querySelector('.cbtn.sel');
      var w=document.getElementById('why-'+c), tm=document.getElementById('terms-'+c);
      var rec={v:v?v.getAttribute('data-v'):null,w:w?w.value:'',t:tm?tm.value:'',at:new Date().toLocaleString('id-ID')};
      try{localStorage.setItem('cd_k5_'+c,JSON.stringify(rec));}catch(e){}
      var s=document.getElementById('saved-'+c); if(s)s.textContent='Tersimpan '+rec.at;
    }
    ['why-','terms-'].forEach(function(p){
      var el=document.getElementById(p+c); if(el)el.addEventListener('input',persist);
    });
    // Reveal
    var rb=document.getElementById('reveal-'+c);
    if(rb)rb.addEventListener('click',function(){
      var key=document.getElementById('key-'+c);
      if(key)key.classList.toggle('hidden');
      rb.textContent=key.classList.contains('hidden')?'Buka kunci builder':'Tutup kunci';
    });
  });
})();
