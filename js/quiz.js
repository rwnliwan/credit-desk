/* Credit Desk — shared quiz + gate engine.
   Tiap halaman modul mendefinisikan: var CD_QUIZ=[{q,opts,ans,why}...]; var CD_GATE="cd_gate_k1";
   Lalu panggil CDQuiz.init(). Gate 80% (4/5). */
(function(){
  "use strict";
  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  window.CDQuiz = {
    init: function(){
      var Q = window.CD_QUIZ || [];
      var wrap = $("quiz-wrap");
      if(!wrap || !Q.length) return;
      /* F5 fix (2026-11-05): acak urutan opsi tiap load agar posisi jawaban tidak tertebak */
      Q.forEach(function(qq){
        var order = qq.opts.map(function(_,i){ return i; });
        for(var s=order.length-1; s>0; s--){ var r=Math.floor(Math.random()*(s+1)); var t=order[s]; order[s]=order[r]; order[r]=t; }
        var newOpts = order.map(function(i){ return qq.opts[i]; });
        qq.ans = order.indexOf(qq.ans);
        qq.opts = newOpts;
      });
      var h = "";
      for(var i=0;i<Q.length;i++){
        h += '<div class="quiz-q" id="qq'+i+'"><h3>'+(i+1)+'. '+esc(Q[i].q)+'</h3>';
        for(var j=0;j<Q[i].opts.length;j++){
          h += '<label class="opt" data-q="'+i+'" data-o="'+j+'"><input type="radio" name="q'+i+'" value="'+j+'" style="margin-right:.5rem">'+esc(Q[i].opts[j])+'</label>';
        }
        h += '<p class="why">'+esc(Q[i].why)+'</p></div>';
      }
      wrap.innerHTML = h;
      var opts = wrap.querySelectorAll(".opt");
      for(var k=0;k<opts.length;k++){
        opts[k].addEventListener("click", function(){
          var q = +this.getAttribute("data-q");
          var others = wrap.querySelectorAll('.opt[data-q="'+q+'"]');
          for(var m=0;m<others.length;m++) others[m].classList.remove("picked");
          this.classList.add("picked");
          var r = this.querySelector("input"); if(r) r.checked = true;
        });
      }
      var btn = $("quiz-submit");
      if(btn) btn.addEventListener("click", function(){ window.CDQuiz.grade(); });
      // tampilkan status lulus lama
      try{
        if(localStorage.getItem(window.CD_GATE)==="lolos"){
          var gb=$("gate-box"); if(gb){ gb.style.display="block"; gb.className="pass";
            gb.innerHTML="<h3>✅ Modul ini sudah LULUS</h3><p>Status tersimpan — kamu bisa mengulang quiz kapan saja.</p>"; }
        }
      }catch(e){}
    },
    grade: function(){
      var Q = window.CD_QUIZ || [];
      var score = 0;
      for(var i=0;i<Q.length;i++){
        var box = $("qq"+i);
        var sel = document.querySelector('input[name="q'+i+'"]:checked');
        var picked = sel ? +sel.value : -1;
        var labels = box.querySelectorAll(".opt");
        for(var j=0;j<labels.length;j++){
          var o = +labels[j].getAttribute("data-o");
          if(o === Q[i].ans) labels[j].classList.add("right");
          else if(o === picked) labels[j].classList.add("wrong");
        }
        box.classList.add("graded");
        if(picked === Q[i].ans) score++;
      }
      var pct = Math.round(score/Q.length*100);
      var gb = $("gate-box"); gb.style.display="block";
      if(pct >= 80){
        gb.className="pass";
        gb.innerHTML="<h3>✅ LULUS — "+score+"/"+Q.length+" ("+pct+"%)</h3><p>Keputusan kreditmu berikutnya menunggu di modul selanjutnya. Status tersimpan di browser ini.</p>";
        try{ localStorage.setItem(window.CD_GATE,"lolos"); }catch(e){}
      } else {
        var was = false; try{ was = localStorage.getItem(window.CD_GATE)==="lolos"; }catch(e){}
        gb.className="fail";
        gb.innerHTML="<h3>Belum lolos — "+score+"/"+Q.length+" ("+pct+"%)</h3><p>Butuh ≥80%. Pelajari pembahasan di tiap soal, lalu coba lagi."+
          (was?" Status <strong>LULUS</strong>-mu yang lama tetap tersimpan.":"")+"</p>";
      }
      gb.scrollIntoView({behavior:"smooth",block:"center"});
    }
  };

  /* Decision verdict picker (dipakai di section Keputusan tiap modul) */
  window.CDDecision = {
    init: function(key){
      var btns = document.querySelectorAll(".verdict");
      for(var i=0;i<btns.length;i++){
        btns[i].addEventListener("click", function(){
          for(var j=0;j<btns.length;j++) btns[j].classList.remove("sel-approve","sel-reject","sel-restructure");
          this.classList.add("sel-"+this.getAttribute("data-v"));
          try{ localStorage.setItem(key+"_verdict", this.getAttribute("data-v")); }catch(e){}
        });
      }
      try{
        var v = localStorage.getItem(key+"_verdict");
        if(v){ var b = document.querySelector('.verdict[data-v="'+v+'"]'); if(b) b.classList.add("sel-"+v); }
      }catch(e){}
    },
    saveText: function(key, ids){
      // ids: array id textarea/input yang disimpan
      var btn = document.getElementById(key+"-save");
      if(!btn) return;
      btn.addEventListener("click", function(){
        try{
          for(var i=0;i<ids.length;i++){
            var el = document.getElementById(ids[i]);
            if(el) localStorage.setItem(key+"_"+ids[i], el.value);
          }
        }catch(e){}
        var ok = document.getElementById(key+"-ok");
        if(ok) ok.textContent = "✓ Tersimpan di browser ini.";
      });
      // restore
      try{
        for(var k=0;k<ids.length;k++){
          var el2 = document.getElementById(ids[k]);
          var sv = localStorage.getItem(key+"_"+ids[k]);
          if(el2 && sv) el2.value = sv;
        }
      }catch(e){}
    }
  };
})();
