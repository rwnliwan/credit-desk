/* Credit Decision Simulator — flagship. Semua angka ILUSTRATIF/FIKTIF. */
var BORROWERS = {
  A: {
    name: "PT Maju Jaya Abadi", sector: "Manufaktur makanan",
    nums: [
      ["Pendapatan", 850, "Rp miliar"], ["EBITDA", 170, "Rp miliar"],
      ["Total utang", 200, "Rp miliar"], ["Ekuitas", 600, "Rp miliar"],
      ["Beban bunga", 16, "Rp miliar"], ["Debt service (pokok+bunga)", 56, "Rp miliar"],
      ["CFO", 140, "Rp miliar"], ["Aset lancar", 320, "Rp miliar"],
      ["Liabilitas lancar", 180, "Rp miliar"], ["Nilai agunan (appraisal)", 400, "Rp miliar"]
    ],
    qual: ["15 tahun operasi, tidak pernah gagal bayar.",
      "Industri defensif (makanan pokok) — permintaan stabil.",
      "Manajemen: pendiri masih aktif, suksesi jelas."],
    calc: { dscr: 3.04, debtEbitda: 1.18, ic: 10.63 },
    key: { decision: "approve", why: "DSCR 3,04x, Debt/EBITDA 1,18x, CFO kuat 140 vs debt service 56. Kapasitas utang masih besar." },
    term: { plafonMax: 310, pricingMin: 1.0, covNeed: ["dscr"] },
    comm: [
      { q: "Berapa DSCR (basis EBITDA)? (x)", ans: 3.04, tol: 0.1, why: "170 ÷ 56 = 3,04x (basis EBITDA, konvensi covenant). Basis CFO: 140 ÷ 56 = 2,50x — tetap kuat." },
      { q: "Berapa Debt/EBITDA? (x)", ans: 1.18, tol: 0.1, why: "200 ÷ 170 = 1,18x." },
      { q: "Plafon maksimum agar Debt/EBITDA tetap ≤ 3,0x? (Rp miliar)", ans: 310, tol: 10, why: "3,0 × 170 − 200 = 310." }
    ]
  },
  B: {
    name: "PT Sinar Terang", sector: "Ritel elektronik",
    nums: [
      ["Pendapatan", 1200, "Rp miliar"], ["EBITDA", 96, "Rp miliar"],
      ["Total utang", 280, "Rp miliar"], ["Ekuitas", 320, "Rp miliar"],
      ["Beban bunga", 28, "Rp miliar"], ["Debt service (pokok+bunga)", 84, "Rp miliar"],
      ["CFO", 60, "Rp miliar"], ["Aset lancar", 400, "Rp miliar"],
      ["Liabilitas lancar", 330, "Rp miliar"], ["Nilai agunan (appraisal)", 250, "Rp miliar"]
    ],
    qual: ["8 tahun operasi; 1x restrukturisasi ringan tahun 2022 (lunas).",
      "Industri siklikal — margin tertekan promo e-commerce.",
      "CFO melemah karena modal kerja memburuk (persediaan menumpuk)."],
    calc: { dscr: 1.14, debtEbitda: 2.92, ic: 3.43 },
    key: { decision: "reject", why: "REJECT: DSCR basis EBITDA 1,14x terlihat cukup, tapi DSCR basis CFO = 60 ÷ 84 = 0,71x — arus kas operasi tidak menutup debt service existing (CFO − debt service = −24). Fasilitas baru apa pun, betapapun kecil plafonnya, menambah cicilan di atas arus kas yang sudah defisit. Batas stok 3,0 × EBITDA (plafon maks Rp8 miliar = 3,0 × 96 − 280) menguji leverage, bukan kemampuan bayar — plafon Rp100 miliar lama memang melanggar Debt/EBITDA ≤ 3,0× menjadi 3,96× dan DSCR jatuh ke 96 ÷ 116 = 0,83×, tetapi plafon Rp8 miliar pun tidak memperbaiki arus kas yang defisit. Struktur ketat (pricing tinggi, covenant ketat, monitoring intensif) tidak menciptakan kas — tolak sampai arus kas terbukti pulih (restrukturisasi arus kas / perbaikan modal kerja), bukan di sini." },
    term: null,
    comm: [
      { q: "Berapa DSCR (basis EBITDA)? (x)", ans: 1.14, tol: 0.1, why: "96 ÷ 84 = 1,14x (basis EBITDA). Basis CFO: 60 ÷ 84 = 0,71x — JAUH lebih ketat. Inilah jebakan K2: EBITDA terlihat cukup, kas tidak." },
      { q: "Berapa interest coverage? (x)", ans: 3.43, tol: 0.2, why: "96 ÷ 28 = 3,43x." },
      { q: "CFO − debt service = ? (Rp miliar)", ans: -24, tol: 5, why: "60 − 84 = −24. Arus kas tidak menutup cicilan." }
    ]
  },
  C: {
    name: "PT Lintas Nusa", sector: "Konstruksi",
    nums: [
      ["Pendapatan", 900, "Rp miliar"], ["EBITDA", 36, "Rp miliar"],
      ["Total utang", 450, "Rp miliar"], ["Ekuitas", 150, "Rp miliar"],
      ["Beban bunga", 54, "Rp miliar"], ["Debt service (pokok+bunga)", 120, "Rp miliar"],
      ["CFO", -20, "Rp miliar"], ["Aset lancar", 280, "Rp miliar"],
      ["Liabilitas lancar", 350, "Rp miliar"], ["Nilai agunan (appraisal)", 200, "Rp miliar"]
    ],
    qual: ["Gagal bayar bunga 1x tahun lalu (sudah di-cure, tapi tercatat).",
      "Proyek macet 2 lokasi; pendapatan turun 30% YoY.",
      "Modal kerja negatif — liabilitas lancar > aset lancar."],
    calc: { dscr: 0.30, debtEbitda: 12.5, ic: 0.67 },
    key: { decision: "reject", why: "DSCR 0,30x — EBITDA tidak menutup sepertiga cicilan. CFO negatif. Debt/EBITDA 12,5x. Ini bukan underwriting, ini donasi." },
    term: null,
    comm: [
      { q: "Berapa DSCR (basis EBITDA)? (x)", ans: 0.30, tol: 0.05, why: "36 ÷ 120 = 0,30x (basis EBITDA). Basis CFO: −20 ÷ 120 = negatif — kas operasi pun tidak ada." },
      { q: "Berapa Debt/EBITDA? (x)", ans: 12.5, tol: 0.5, why: "450 ÷ 36 = 12,5x." },
      { q: "Net working capital? (Rp miliar)", ans: -70, tol: 5, why: "280 − 350 = −70. Likuiditas jebol." }
    ]
  }
};
var COVS = [
  { id: "dscr", label: "DSCR minimum", type: "min" }, { id: "debtEbitda", label: "Debt/EBITDA maksimum", type: "max" },
  { id: "ic", label: "Interest coverage minimum", type: "min" }, { id: "cr", label: "Current ratio minimum", type: "min" },
  { id: "nw", label: "Net worth minimum", type: "min" }
];
var cur = null, decision = null, covSel = [], covThresh = {};
/* Nilai aktual covenant per borrower (untuk menilai threshold numerik SF-10). */
function numVal(b, name){ var v = null; b.nums.forEach(function(n){ if(n[0]===name) v = n[1]; }); return v; }
function covActual(b, id){
  if(id==="dscr") return b.calc.dscr;
  if(id==="debtEbitda") return b.calc.debtEbitda;
  if(id==="ic") return b.calc.ic;
  if(id==="cr") return numVal(b, "Aset lancar") / numVal(b, "Liabilitas lancar");
  if(id==="nw") return numVal(b, "Ekuitas");
  return null;
}
/* Threshold masuk akal: minimum harus di bawah aktual, maksimum di atas aktual. */
function threshOk(b, id, th){
  var a = covActual(b, id), c = COVS.filter(function(x){ return x.id===id; })[0];
  if(a===null || isNaN(th) || th<=0) return false;
  return c.type==="min" ? th < a : th > a;
}
/* Proyeksi pasca-pencairan (G-3): jadwal debt service + DSCR pasca-fasilitas dari
   term sheet learner sendiri. Anuitas plafon @ base 8% + margin yang diisi learner.
   Batas 3x EBITDA menguji leverage (stok), bukan cicilan — DSCR pasca-fasilitas
   di sinilah yang menguji cicilan. */
function annuity(p, r, n){ return p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1); }
function postDS(){
  var b = BORROWERS[cur]; if(!b) return null;
  var plafon = parseIDNumber($("#t-plafon").value, false),
      tenor = parseIDNumber($("#t-tenor").value, true),
      margin = parseIDNumber($("#t-pricing").value, true);
  if(isNaN(plafon)||plafon<=0||isNaN(tenor)||tenor<=0||isNaN(margin)||margin<0) return null;
  var rate = (8+margin)/100;
  var ann = annuity(plafon, rate, tenor);
  var ds0 = numVal(b, "Debt service (pokok+bunga)");
  var ebitda = numVal(b, "EBITDA"), cfo = numVal(b, "CFO");
  return { ann: ann, dsTot: ds0+ann, dscrE: ebitda/(ds0+ann), dscrC: cfo/(ds0+ann), margin: margin, tenor: tenor };
}
function postDSLine(p){
  return "<strong>Proyeksi pasca-pencairan (term sheet Anda):</strong> cicilan baru ≈ Rp"+fmtID(p.ann,1)+" miliar/tahun (anuitas plafon @ base 8% + margin "+fmtID(p.margin,1)+"pp, tenor "+fmtID(p.tenor,1)+" thn) → debt service total ≈ Rp"+fmtID(p.dsTot,1)+" miliar/tahun → DSCR basis EBITDA pasca ≈ "+fmtID(p.dscrE,2)+"×; DSCR basis CFO pasca ≈ "+fmtID(p.dscrC,2)+"×. Batas 3× EBITDA menguji leverage (stok), bukan cicilan — yang menguji cicilan adalah DSCR pasca-fasilitas ini.";
}
function renderPostDS(){
  var el = document.getElementById("post-ds"); if(!el) return;
  var p = postDS();
  el.innerHTML = p ? postDSLine(p) : "Isi plafon, tenor &amp; pricing untuk melihat proyeksi debt service + DSCR pasca-fasilitas dari term sheet Anda sendiri.";
}
["t-plafon","t-tenor","t-pricing"].forEach(function(id){
  var el = document.getElementById(id);
  if(el) el.addEventListener("input", renderPostDS);
});
function renderCovThresh(){
  var b = BORROWERS[cur], h = "";
  /* Simpan threshold yang sudah diketik sebelum render ulang. */
  covSel.forEach(function(id){
    var el = document.getElementById("th_"+id);
    if(el && el.value!==""){ var v = parseIDNumber(el.value, true); if(!isNaN(v)) covThresh[id] = v; }
  });
  covSel.forEach(function(id){
    var c = COVS.filter(function(x){ return x.id===id; })[0], a = covActual(b, id);
    h += '<div class="cd-field" style="margin-bottom:.8rem"><label>Threshold ' + c.label + ' (' + (id==="nw" ? "Rp miliar" : "×") + ')</label>'
      + '<input id="th_' + id + '" inputmode="decimal" placeholder="mis. ' + fmtID(a, 2) + '" value="' + (covThresh[id]!==undefined ? String(covThresh[id]).replace(".", ",") : "") + '">'
      + '<div class="cd-hint">Angka aktual borrower ini: ' + fmtID(a, 2) + (id==="nw" ? " Rp miliar" : "×") + '. '
      + (c.type==="min" ? "Threshold minimum harus di bawah aktual agar ada headroom — nilai tepat sama dengan aktual berarti headroom nol (bukan breach: covenant tepat pada batas masih dipenuhi). Latihan ini mewajibkan headroom positif supaya covenant memberi sinyal dini." : "Threshold maksimum harus di atas aktual agar ada headroom — nilai tepat sama dengan aktual berarti headroom nol (bukan breach: covenant tepat pada batas masih dipenuhi). Latihan ini mewajibkan headroom positif supaya covenant memberi sinyal dini.") + '</div></div>';
  });
  $("#cov-thresh").innerHTML = h;
}

function show(id){ $("#"+id).style.display="block"; $("#"+id).scrollIntoView({behavior:"smooth",block:"start"}); }

(function renderCards(){
  var h = "";
  Object.keys(BORROWERS).forEach(function(k){
    var b = BORROWERS[k], st = cdLoad("sim_"+k);
    h += '<div class="cd-card" style="margin:0"><h3>'+b.name+'</h3>'
      + '<p style="font-size:.85rem;color:var(--ink-soft)">'+b.sector+' · '+(st&&st.score!==undefined?("Skor: <b>"+st.score+"/"+st.max+"</b>"):"Belum dikerjakan")+'</p>'
      + '<button class="cd-btn" data-b="'+k+'">Buka paket →</button></div>';
  });
  $("#borrower-cards").innerHTML = h;
  $$("#borrower-cards button").forEach(function(btn){
    btn.addEventListener("click", function(){ openBorrower(btn.dataset.b); });
  });
})();

function openBorrower(k){
  cur = k; decision = null; covSel = []; covThresh = {};
  var b = BORROWERS[k];
  $("#pkg-name").textContent = b.name;
  var h = "<tr><th>Pos</th><th class='num'>Nilai</th><th>Satuan</th></tr>";
  b.nums.forEach(function(n){ h += "<tr><td>"+n[0]+"</td><td class='num'>"+fmtID(n[1])+"</td><td>"+n[2]+"</td></tr>"; });
  $("#pkg-tbl").innerHTML = h;
  /* Jembatan EBITDA→CFO (M3): DSCR basis CFO ditampilkan eksplisit */
  var cfo = null, ds = null;
  b.nums.forEach(function(n){ if(n[0]==="CFO") cfo = n[1]; if(n[0].indexOf("Debt service")===0) ds = n[1]; });
  var el = document.getElementById("pkg-dscr-cfo");
  if(el) el.textContent = (cfo!==null && ds) ? (fmtID(cfo/ds,1)+"x (CFO "+fmtID(cfo)+" ÷ debt service "+fmtID(ds)+")") : "—";
  $("#pkg-qual").innerHTML = b.qual.map(function(q){return "<li>"+q+"</li>";}).join("");
  ["step-package","step-decision","step-committee","step-verdict"].forEach(function(id){$("#"+id).style.display="none";});
  show("step-package");
  renderPostDS();
}

$("#to-decision").addEventListener("click", function(){
  var h = "";
  COVS.forEach(function(c){
    h += '<button class="cd-opt" data-cov="'+c.id+'" style="width:auto">'+c.label+'</button>';
  });
  $("#cov-picks").innerHTML = h;
  $$("#cov-picks button").forEach(function(btn){
    btn.addEventListener("click", function(){
      var id = btn.dataset.cov;
      if(covSel.indexOf(id)>=0){ covSel = covSel.filter(function(x){return x!==id;}); btn.classList.remove("sel"); }
      else { covSel.push(id); btn.classList.add("sel"); }
      renderCovThresh();
    });
  });
  renderCovThresh();
  $$("#decision-btns .cd-opt").forEach(function(b){ b.classList.remove("sel"); });
  $("#term-wrap").style.display = "none";
  show("step-decision");
});
$$("#decision-btns .cd-opt").forEach(function(btn){
  btn.addEventListener("click", function(){
    $$("#decision-btns .cd-opt").forEach(function(b){b.classList.remove("sel");});
    btn.classList.add("sel"); decision = btn.dataset.dec;
    $("#term-wrap").style.display = (decision==="reject") ? "none" : "block";
    renderPostDS();
  });
});

$("#to-committee").addEventListener("click", function(){
  if(!decision){ alert("Pilih keputusan dulu."); return; }
  if(decision!=="reject"){
    if(covSel.length!==2){ alert("Pilih tepat 2 covenant kunci."); return; }
    var bb = BORROWERS[cur];
    for(var ci=0; ci<covSel.length; ci++){
      var cid = covSel[ci], cEl = document.getElementById("th_"+cid);
      var thV = cEl ? parseIDNumber(cEl.value, true) : NaN;
      if(isNaN(thV) || thV<=0){ alert("Isi threshold numerik untuk covenant " + cid.toUpperCase() + "."); return; }
      var cDef = COVS.filter(function(x){ return x.id===cid; })[0], aV = covActual(bb, cid);
      if(cDef.type==="min" && thV>=aV){ alert("Threshold " + cDef.label + " (" + fmtID(thV,2) + ") harus di bawah angka aktual borrower (" + fmtID(aV,2) + ") agar ada headroom positif. Nilai tepat sama dengan aktual bukan breach — covenant tepat pada batas masih dipenuhi — tapi latihan ini mewajibkan headroom > 0 supaya covenant memberi sinyal dini."); return; }
      if(cDef.type==="max" && thV<=aV){ alert("Threshold " + cDef.label + " (" + fmtID(thV,2) + ") harus di atas angka aktual borrower (" + fmtID(aV,2) + ") agar ada headroom positif. Nilai tepat sama dengan aktual bukan breach — covenant tepat pada batas masih dipenuhi — tapi latihan ini mewajibkan headroom > 0 supaya covenant memberi sinyal dini."); return; }
      covThresh[cid] = thV;
    }
    if($("#t-plafon").value===""||$("#t-pricing").value===""){ alert("Isi plafon dan pricing."); return; }
    var plafonNum = parseIDNumber($("#t-plafon").value, false),
        pricingNum = parseIDNumber($("#t-pricing").value, true);
    if(isNaN(plafonNum) || plafonNum<=0){ alert("Plafon harus angka > 0."); return; }
    if(isNaN(pricingNum) || pricingNum<0){ alert("Pricing (margin) tidak boleh negatif."); return; }
    if($("#t-tenor").value===""){ alert("Isi tenor — term sheet tanpa tenor tidak lengkap."); return; }
    var tenorNum = parseIDNumber($("#t-tenor").value, true);
    if(isNaN(tenorNum) || tenorNum<=0 || tenorNum>30){ alert("Tenor harus angka > 0 dan ≤ 30 tahun."); return; }
    if($("#t-coll").value===""){ alert("Pilih coverage agunan — term sheet tanpa agunan tidak lengkap."); return; }
  }
  var b = BORROWERS[cur], h = "";
  b.comm.forEach(function(cq,i){
    h += '<div class="cd-field" style="margin-bottom:.8rem"><label>'+(i+1)+'. '+cq.q+'</label>'
      + '<input id="cq'+i+'" inputmode="decimal" placeholder="mis. 2,50"></div>';
  });
  $("#comm-qs").innerHTML = h;
  show("step-committee");
});

$("#to-verdict").addEventListener("click", function(){
  var b = BORROWERS[cur], score = 0, max = 0, fb = [];
  /* 1. keputusan (3) */
  max += 3;
  var dScore = 0;
  if(decision === b.key.decision) dScore = 3;
  else if(cur==="B" && decision==="conditional") dScore = 1;
  else if(cur==="C" && decision==="conditional") dScore = 1;
  score += dScore;
  var dLabel = {approve:"APPROVE",conditional:"APPROVE DENGAN SYARAT",reject:"REJECT"}[decision];
  var kLabel = {approve:"APPROVE",conditional:"APPROVE DENGAN SYARAT",reject:"REJECT"}[b.key.decision];
  fb.push("<b>Keputusan Anda: "+dLabel+"</b> — kunci komite: <b>"+kLabel+"</b> ("+dScore+"/3).<br>"+b.key.why);
  /* 2. term sheet (3) — hanya bila tidak reject */
  if(b.term && decision!=="reject"){
    max += 3;
    var plafon = parseIDNumber($("#t-plafon").value,false),
        pricing = parseIDNumber($("#t-pricing").value,true),
        coll = $("#t-coll").value, tScore = 0, tFb = [];
    if(!isNaN(plafon) && plafon>0 && plafon<=b.term.plafonMax){ tScore++; tFb.push("plafon "+fmtID(plafon)+" ≤ batas wajar "+fmtID(b.term.plafonMax)+" ✓"); }
    else tFb.push("plafon "+(isNaN(plafon)?"tidak valid":fmtID(plafon))+" — batas wajar ≤ "+fmtID(b.term.plafonMax)+" ✗");
    if(!isNaN(pricing) && pricing>=b.term.pricingMin){ tScore++; tFb.push("pricing +"+fmtID(pricing,2)+"pp ≥ minimum +"+fmtID(b.term.pricingMin,2)+"pp ✓"); }
    else tFb.push("pricing terlalu murah untuk risikonya ✗ (minimum +"+fmtID(b.term.pricingMin,2)+"pp)");
    var covOk = b.term.covNeed.every(function(c){return covSel.indexOf(c)>=0;});
    var covThOk = covOk && b.term.covNeed.every(function(c){ return threshOk(b, c, covThresh[c]); });
    if(covThOk){ tScore++; tFb.push("covenant mencakup yang kunci + threshold numerik masuk akal ✓ ("+b.term.covNeed.map(function(c){ return c.toUpperCase()+" "+fmtID(covThresh[c],2); }).join(", ")+")"); }
    else if(covOk) tFb.push("covenant kunci lengkap jenisnya, tapi threshold numeriknya tidak masuk akal ✗ (minimum harus di bawah aktual, maksimum di atas aktual — nilai tepat sama dengan aktual = headroom nol, bukan breach, tapi latihan ini mewajibkan headroom positif)");
    else tFb.push("covenant kunci belum lengkap ✗ (butuh: "+b.term.covNeed.join(", ")+")");
    score += tScore;
    var tenorV = $("#t-tenor").value, collLbl = {high:"≥150%", mid:"100–150%", low:"<100%"}[coll]||"—";
    fb.push("<b>Term sheet ("+tScore+"/3):</b><br>• "+tFb.join("<br>• ")
      + "<br>• tenor "+fmtID(parseIDNumber(tenorV,true),1)+" thn & agunan "+collLbl+" — wajib diisi, tidak dinilai otomatis (bahan debrief).");
  } else if(decision==="reject"){
    fb.push("Term sheet tidak diperlukan untuk keputusan REJECT — tepat.");
  }
  /* Proyeksi pasca-fasilitas (G-3) — dari term sheet learner sendiri. */
  if(decision!=="reject"){
    var pd = postDS();
    if(pd) fb.push(postDSLine(pd));
    if(!b.term) fb.push("Term sheet tidak dinilai untuk borrower ini — kuncinya REJECT (fasilitas baru apa pun menambah cicilan di atas arus kas yang sudah defisit). Angka proyeksi di atas hanya debrief: lihat bagaimana DSCR pasca-fasilitas memburuk dari term sheet Anda sendiri.");
  }
  /* 3. komite (3) */
  max += 3;
  var cScore = 0, cFb = [];
  b.comm.forEach(function(cq,i){
    var v = parseIDNumber($("#cq"+i).value, true);
    var ok = !isNaN(v) && Math.abs(v-cq.ans) <= cq.tol; /* tol = ABSOLUT (fix 2026-11-04: dulu tol*max(1,|ans|) = relatif absurd) */
    if(ok) cScore++;
    cFb.push("Q"+(i+1)+": "+(ok?"✓":"✗")+" — "+cq.why);
  });
  score += cScore;
  fb.push("<b>Komite ("+cScore+"/3):</b><br>• "+cFb.join("<br>• "));
  var verdict = score>=Math.ceil(max*0.7) ? "LULUS" : "BELUM LULUS";
  var cls = verdict==="LULUS" ? "ok" : "bad";
  $("#verdict-box").innerHTML = '<div class="cd-result show '+cls+'"><b>Skor: '+score+'/'+max+' — '+verdict+'</b></div>'
    + '<div class="cd-kunci"><b>Kunci komite — '+b.name+':</b><br>• '+fb.join('<br><br>• ')+'</div>';
  cdSave("sim_"+cur, {score:score, max:max, decision:decision});
  show("step-verdict");
});
$("#again").addEventListener("click", function(){ openBorrower(cur); });
$("#next-borrower").addEventListener("click", function(){
  var keys = Object.keys(BORROWERS), i = keys.indexOf(cur);
  openBorrower(keys[(i+1)%keys.length]);
});
