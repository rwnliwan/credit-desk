/* Covenant Designer — semua angka ILUSTRATIF/FIKTIF (Rp miliar). */
var PROF = { ebitda: 120, debt: 300, interest: 24, ds: 84, ca: 180, cl: 120, equity: 400 };
var SCEN = {
  "Base":     { ebitda: 120, interest: 24, ds: 84, ca: 180, cl: 120, debt: 300, equity: 400 },
  "Downturn": { ebitda: 96,  interest: 24, ds: 84, ca: 170, cl: 125, debt: 320, equity: 370 },
  "Severe":   { ebitda: 78,  interest: 30, ds: 90, ca: 162, cl: 130, debt: 350, equity: 330 }
};
var COVENANTS = [
  { id: "dscr", label: "DSCR minimum", type: "min", unit: "x", sug: 1.2,
    fn: function(s){ return s.ebitda / s.ds; },
    desc: "EBITDA ÷ debt service. Ukuran kemampuan bayar cicilan." },
  { id: "debtEbitda", label: "Debt / EBITDA maksimum", type: "max", unit: "x", sug: 3.5,
    fn: function(s){ return s.debt / s.ebitda; },
    desc: "Total utang ÷ EBITDA. Ukuran leverage." },
  { id: "ic", label: "Interest coverage minimum", type: "min", unit: "x", sug: 3.0,
    fn: function(s){ return s.ebitda / s.interest; },
    desc: "EBITDA ÷ beban bunga." },
  { id: "cr", label: "Current ratio minimum", type: "min", unit: "x", sug: 1.2,
    fn: function(s){ return s.ca / s.cl; },
    desc: "Aset lancar ÷ liabilitas lancar. Likuiditas jangka pendek." },
  { id: "de", label: "Debt / Equity maksimum", type: "max", unit: "x", sug: 1.0,
    fn: function(s){ return s.debt / s.equity; },
    desc: "Total utang ÷ ekuitas." },
  { id: "nw", label: "Net worth minimum", type: "min", unit: "Rp M", sug: 350,
    fn: function(s){ return s.equity; },
    desc: "Ekuitas minimum — pagar agar pemilik tidak menguras modal." }
];
var sel = [];

(function renderProf(){
  var rows = [["EBITDA",PROF.ebitda],["Total utang",PROF.debt],["Beban bunga (8%)",PROF.interest],
    ["Debt service",PROF.ds],["Aset lancar",PROF.ca],["Liabilitas lancar",PROF.cl],["Ekuitas",PROF.equity]];
  var h = "<tr><th>Pos</th><th class='num'>Base</th></tr>";
  rows.forEach(function(r){ h += "<tr><td>"+r[0]+"</td><td class='num'>"+fmtID(r[1])+"</td></tr>"; });
  $("#prof-tbl").innerHTML = h;
})();

(function renderCov(){
  var h = "";
  COVENANTS.forEach(function(c){
    h += '<button class="cd-opt" data-cov="'+c.id+'"><b>'+c.label+'</b><br>'
      + '<span style="font-size:.8rem;color:var(--ink-soft)">'+c.desc+' Saran generik (ilustratif): '+fmtID(c.sug,2)+c.unit+'</span></button>';
  });
  $("#cov-list").innerHTML = h;
  $$("#cov-list button").forEach(function(b){
    b.addEventListener("click", function(){
      var id = b.dataset.cov;
      if(sel.indexOf(id)>=0){ sel = sel.filter(function(x){return x!==id;}); b.classList.remove("sel"); }
      else if(sel.length<5){ sel.push(id); b.classList.add("sel"); }
      else { alert("Maksimum 5 covenant."); return; }
      $("#cov-count").textContent = sel.length+" dipilih (pilih 3–5).";
      renderThresh();
    });
  });
})();

function renderThresh(){
  if(sel.length<3){ $("#thresh-card").style.display="none"; return; }
  $("#thresh-card").style.display = "block";
  var h = "";
  sel.forEach(function(id){
    var c = COVENANTS.filter(function(x){return x.id===id;})[0];
    var base = c.fn(SCEN.Base);
    h += '<div class="cd-field" style="margin-bottom:.8rem"><label>'+c.label+' ('+c.unit+')</label>'
      + '<input id="th_'+id+'" inputmode="decimal" value="'+String(c.sug).replace(".",",")+'">'
      + '<div class="cd-hint">Angka base: '+fmtID(base,2)+c.unit+'. Saran generik (ilustratif — bukan threshold kasus K3): '+fmtID(c.sug,2)+c.unit+'.</div></div>';
  });
  $("#thresh-inputs").innerHTML = h;
  $("#result-card").style.display = "none";
  $("#thresh-card").scrollIntoView({behavior:"smooth",block:"start"});
}

$("#run-stress").addEventListener("click", function(){
  var th = {};
  for(var i=0;i<sel.length;i++){
    var v = parseIDNumber($("#th_"+sel[i]).value, true);
    if(isNaN(v)||v<=0){ alert("Threshold tidak valid."); return; }
    th[sel[i]] = v;
  }
  var scenNames = Object.keys(SCEN);
  var h = "<tr><th>Covenant</th><th class='num'>Threshold</th>";
  scenNames.forEach(function(s){ h += "<th class='num'>"+s+" (aktual)</th><th class='num'>Headroom</th>"; });
  h += "</tr>";
  var breachCount = {}, firstBreach = {};
  sel.forEach(function(id){
    var c = COVENANTS.filter(function(x){return x.id===id;})[0];
    h += "<tr><td>"+c.label+"</td><td class='num'>"+fmtID(th[id],2)+c.unit+"</td>";
    scenNames.forEach(function(s){
      var a = c.fn(SCEN[s]);
      var hr = c.type==="min" ? (a-th[id])/th[id] : (th[id]-a)/th[id];
      var breach = hr < 0;
      if(breach){ breachCount[s]=(breachCount[s]||0)+1; if(!firstBreach[id]) firstBreach[id]=s; }
      h += "<td class='num'>"+fmtID(a,2)+"</td><td class='num' style='font-weight:700;color:"+(breach?"var(--reject)":"var(--approve)")+"'>"
        + (breach?"BREACH ":"")+fmtID(hr*100,1)+"%</td>";
    });
    h += "</tr>";
  });
  $("#stress-tbl").innerHTML = h;
  var v = "<div class='cd-result show info'><b>Vonis paket:</b><br>";
  scenNames.forEach(function(s){
    var n = breachCount[s]||0;
    v += "• <b>"+s+"</b>: "+(n===0?"tidak ada breach — paket memberi sinyal tepat waktu."+ (s==="Severe"?" <i>Catatan: bila severe pun tidak breach, threshold mungkin terlalu longgar.</i>":"") : n+" covenant breach")+"<br>";
  });
  var binders = sel.filter(function(id){return firstBreach[id];});
  if(binders.length) v += "• Covenant yang mengikat lebih dulu: "+binders.map(function(id){return id.toUpperCase()+" ("+firstBreach[id]+")";}).join(", ")+".";
  v += "</div>";
  $("#stress-verdict").innerHTML = v;
  $("#result-card").style.display = "block";
  cdSave("covdesign", {sel:sel, th:th});
  $("#result-card").scrollIntoView({behavior:"smooth",block:"start"});
});

$("#copy-pkg").addEventListener("click", function(){
  var st = cdLoad("covdesign"); if(!st) return;
  var t = "PAKET COVENANT — PT Cahaya Perkasa (ilustratif)\n";
  st.sel.forEach(function(id){
    var c = COVENANTS.filter(function(x){return x.id===id;})[0];
    t += "• "+c.label+": "+fmtID(st.th[id],2)+c.unit+"\n";
  });
  t += "Diuji: Base / Downturn (EBITDA −20%, utang +20, ekuitas −30) / Severe (EBITDA −35%, +200bps, utang +50, ekuitas −70).\nSaran threshold = default generik ilustratif (bukan threshold kasus K3: DSCR 1,25× / CR 1,4× / D/E 1,8×).\nCredit Desk — angka ilustratif.";
  if(navigator.clipboard) navigator.clipboard.writeText(t).then(function(){ alert("Paket disalin."); });
});
