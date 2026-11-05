/* Monitoring Drill — PT Wira Karya. Semua angka ILUSTRATIF/FIKTIF (Rp miliar). */
var QUARTERS = [
  { q: "Q1", ebitda: 44, ds: 25, dpd: 0, npl: 0,
    note: "Operasi normal. Penjualan sesuai rencana.",
    key: { rating: "maintain", stage: "1", act: "normal" },
    why: "DSCR 1,76x — sehat. Tidak ada tunggakan. Stage 1, monitoring normal." },
  { q: "Q2", ebitda: 33, ds: 25, dpd: 15, npl: 0,
    note: "Permintaan melemah; persediaan menumpuk. Pembayaran bunga telat 15 hari (sudah masuk).",
    key: { rating: "maintain", stage: "2", act: "enhanced" },
    why: "DSCR 1,32x — headroom tinggal 0,07x di atas covenant. DPD 15 hari + persediaan menumpuk + permintaan melemah = kombinasi fakta SICR → Stage 2. (Catatan: 30 hari adalah backstop rebuttable IFRS 9 untuk SICR — di sini indikator kualitatifnya sudah cukup.) Rating dipertahankan, monitoring ditingkatkan." },
  { q: "Q3", ebitda: 25, ds: 25, dpd: 45, npl: 2,
    note: "DSCR tepat 1,00x — BREACH covenant 1,25x. Tunggakan 45 hari. NPL mulai terbentuk (2%).",
    key: { rating: "downgrade", stage: "2", act: "restructure" },
    why: "Breach covenant + DPD 45 hari + NPL 2% → downgrade, Stage 2 (SICR terkonfirmasi). 90 hari adalah backstop rebuttable untuk presumsi default — BUKAN 'aman sebelum 90 hari'. Saatnya restrukturisasi, bukan menunggu." },
  { q: "Q4", ebitda: 18, ds: 25, dpd: 120, npl: 9,
    note: "DSCR 0,72x. Tunggakan 120 hari. NPL 9%. Manajemen tidak kooperatif.",
    key: { rating: "downgrade", stage: "3", act: "tarik" },
    why: "DPD > 90 hari = default → Stage 3 (credit-impaired). NPL 9%. Lindungi bank: tarik fasilitas / workout." }
];
var RATINGS = [["upgrade","Upgrade"],["maintain","Maintain"],["downgrade","Downgrade"]];
var STAGES = [["1","Stage 1 — performing"],["2","Stage 2 — SICR"],["3","Stage 3 — credit-impaired"]];
var ACTS = [["normal","Monitoring normal"],["enhanced","Enhanced monitoring"],["restructure","Restrukturisasi"],["tarik","Tarik fasilitas / workout"]];
var answers = [], qi = 0;

function dscr(q){ return q.ebitda / q.ds; }

function renderQuarter(){
  var box = $("#quarters");
  if(qi >= QUARTERS.length){ showFinal(); return; }
  var q = QUARTERS[qi], d = dscr(q);
  var breach = d < 1.25;
  var h = '<div class="cd-card"><h2>Kuartal '+q.q+'</h2>'
    + '<div class="ilus">ILUSTRATIF</div>'
    + '<div class="tblwrap"><table class="cd-tbl"><tr><th>Indikator</th><th class="num">Nilai</th><th>Status</th></tr>'
    + '<tr><td>EBITDA</td><td class="num">'+fmtID(q.ebitda)+'</td><td></td></tr>'
    + '<tr><td>DSCR (covenant ≥ 1,25x)</td><td class="num">'+fmtID(d,2)+'x</td><td>'+(breach?'<span class="badge reject">BREACH</span>':'<span class="badge approve">AMAN</span>')+'</td></tr>'
    + '<tr><td>Hari tunggakan (DPD)</td><td class="num">'+q.dpd+'</td><td>'+(q.dpd>=90?'<span class="badge reject">DEFAULT</span>':q.dpd>0?'<span class="badge cond">WASPADA</span>':'<span class="badge approve">LANCAR</span>')+'</td></tr>'
    + '<tr><td>NPL</td><td class="num">'+fmtID(q.npl,1)+'%</td><td></td></tr>'
    + '</table></div><p style="font-size:.88rem"><i>'+q.note+'</i></p>'
    + '<h3>Keputusan Anda</h3>'
    + '<div class="cd-field"><label>Rating internal</label><div class="cd-btnrow" id="r-rating">'
    + RATINGS.map(function(r){return '<button class="cd-opt" data-v="'+r[0]+'" style="width:auto">'+r[1]+'</button>';}).join("")
    + '</div></div>'
    + '<div class="cd-field"><label>Stage ECL</label><div class="cd-btnrow" id="r-stage">'
    + STAGES.map(function(r){return '<button class="cd-opt" data-v="'+r[0]+'" style="width:auto">'+r[1]+'</button>';}).join("")
    + '</div></div>'
    + '<div class="cd-field"><label>Tindakan</label><div class="cd-btnrow" id="r-act">'
    + ACTS.map(function(r){return '<button class="cd-opt" data-v="'+r[0]+'" style="width:auto">'+r[1]+'</button>';}).join("")
    + '</div></div>'
    + '<div class="cd-btnrow"><button class="cd-btn" id="q-submit">Kunci keputusan '+q.q+' →</button></div>'
    + '<p class="cd-hint">Keputusan terkunci — tidak bisa diubah setelah lanjut (seperti komite kredit sungguhan).</p></div>';
  box.innerHTML = h;
  var pick = { rating: null, stage: null, act: null };
  [["r-rating","rating"],["r-stage","stage"],["r-act","act"]].forEach(function(pair){
    $$("#"+pair[0]+" button").forEach(function(b){
      b.addEventListener("click", function(){
        $$("#"+pair[0]+" button").forEach(function(x){x.classList.remove("sel");});
        b.classList.add("sel"); pick[pair[1]] = b.dataset.v;
      });
    });
  });
  $("#q-submit").addEventListener("click", function(){
    if(!pick.rating||!pick.stage||!pick.act){ alert("Lengkapi ketiga keputusan."); return; }
    var k = q.key, s = 0;
    if(pick.rating===k.rating) s++;
    if(pick.stage===k.stage) s++;
    if(pick.act===k.act) s++;
    answers.push({ q: q.q, pick: pick, key: k, score: s, why: q.why });
    cdSave("monitoring", { answers: answers });
    qi++;
    $("#qprog").style.width = (qi/QUARTERS.length*100)+"%";
    renderQuarter();
    window.scrollTo({top:0,behavior:"smooth"});
  });
  $("#qprog").style.width = (qi/QUARTERS.length*100)+"%";
}

function showFinal(){
  var total = answers.reduce(function(a,x){return a+x.score;},0), max = QUARTERS.length*3;
  var h = '<div class="cd-result show '+(total>=Math.ceil(max*0.7)?"ok":"bad")+'"><b>Skor: '+total+'/'+max+' — '+(total>=Math.ceil(max*0.7)?"LULUS":"BELUM LULUS")+'</b></div>';
  var lbl = { upgrade:"Upgrade", maintain:"Maintain", downgrade:"Downgrade",
    "1":"Stage 1", "2":"Stage 2", "3":"Stage 3",
    normal:"Monitoring normal", enhanced:"Enhanced monitoring", restructure:"Restrukturisasi", tarik:"Tarik fasilitas" };
  answers.forEach(function(a){
    h += '<div class="cd-card" style="margin-bottom:.8rem"><h3>'+a.q+' — '+a.score+'/3</h3>'
      + '<p style="font-size:.85rem">Anda: '+lbl[a.pick.rating]+' · '+lbl[a.pick.stage]+' · '+lbl[a.pick.act]
      + '<br>Kunci: '+lbl[a.key.rating]+' · '+lbl[a.key.stage]+' · '+lbl[a.key.act]+'</p>'
      + '<p style="font-size:.85rem;color:var(--ink-soft)">'+a.why+'</p></div>';
  });
  $("#final-box").innerHTML = h;
  $("#final-card").style.display = "block";
  $("#final-card").scrollIntoView({behavior:"smooth"});
}

(function init(){
  var st = cdLoad("monitoring");
  if(st && st.answers && st.answers.length===QUARTERS.length){
    answers = st.answers; qi = QUARTERS.length;
    $("#qprog").style.width = "100%";
    showFinal();
  } else {
    if(st && st.answers){ answers = st.answers; qi = answers.length; }
    renderQuarter();
  }
})();
$("#restart").addEventListener("click", function(){
  try{ localStorage.removeItem("cd_monitoring"); }catch(e){}
  answers = []; qi = 0; $("#final-card").style.display = "none"; renderQuarter();
});
