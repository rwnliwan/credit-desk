/* K4 — quiz + monitoring note wiring */
(function(){
  "use strict";
  window.CD_QUIZ = [
    {q:"Dari sudut pandang analis kredit, yang PALING penting dari staging PSAK 109 (IFRS 9) adalah…",
     opts:["Besarnya beban CKPN di laporan laba rugi","Migrasi antar stage — kenaikan Stage 2 = portofolio memburuk sebelum NPL naik","Kepatuhan terhadap standar akuntansi","Perbandingan dengan bank kompetitor"],
     ans:1,
     why:"Analis memantau migrasi, bukan angka statis. Stage 2 yang membengkak = lampu kuning menyala sebelum NPL bergerak. Menunggu NPL = terlambat satu kuartal."},
    {q:"Masuk watchlist berarti…",
     opts:["Debitur divonis akan gagal bayar","Frekuensi monitoring naik + analis ditugaskan + rencana kontinjensi disiapkan","Fasilitas langsung ditarik","Tidak ada artinya — sekadar administrasi"],
     ans:1,
     why:"Watchlist = eskalasi pengawasan, bukan vonis. Tujuannya menyiapkan respons sebelum masalah menjadi krisis."},
    {q:"Restrukturisasi berulang pada debitur yang sama paling tepat dibaca sebagai…",
     opts:["Bukti bank peduli pada nasabah","Red flag kuat bahwa pengakuan NPL mungkin ditunda — perlu dibuktikan lewat proyeksi dan realisasi pembayaran","Strategi pertumbuhan bank","Tidak ada implikasi analitis"],
     ans:1,
     why:"Pertanyaan kuncinya: apakah restrukturisasi memperbaiki capacity, atau hanya menunda pengakuan? Pengulangan adalah red flag yang wajib dibuktikan — bukan vonis otomatis bahwa setiap kredit berulang pasti menjadi NPL."},
    {q:"Kombinasi CKPN turun + NPL naik menunjukkan…",
     opts:["Bank makin efisien","Provisi tidak mengejar risiko — lampu merah","Tidak ada masalah selama NPL < 5%","Bank sedang front-loading"],
     ans:1,
     why:"Bantalan (coverage) menipis sementara risiko naik = arah yang salah. Front-loading justru CKPN naik mendahului NPL."},
    {q:"Pada kasus PT Sinar Kemas Q1 (DSCR 1,57×, piutang tertunda, utilisasi 92%, direktur keuangan resign), keputusan monitoring yang TEPAT:",
     opts:["Maintain — semua covenant masih terpenuhi","Downgrade + watchlist ketat + investigasi Stage 2 — lima gejala serentak mengindikasikan SICR (dengan asumsi baseline origination rendah)","Upgrade — borrower masih membayar","Tunggu kuartal depan untuk memastikan tren"],
     ans:1,
     why:"Covenant terpenuhi ≠ sehat. Lima gejala serentak adalah indikasi kuat SICR — tetapi SICR mengukur perubahan risiko vs saat origination + informasi forward-looking, jadi Stage 2 di sini adalah keputusan ilustratif dengan asumsi baseline rendah, bukan 'definisi textbook' yang terbukti tanpa baseline."}
  ];
  window.CD_GATE = "cd_gate_k4";
  window.CDQuiz.init();
  window.CDDecision.init("cd_k4");
  window.CDDecision.saveText("k4", ["k4-stage","k4-tindakan"]);
  /* SF-3: watchlist adalah toggle terpisah dari rating (bukan tombol verdict). */
  (function(){
    var wl = document.getElementById("k4-watchlist");
    if(!wl) return;
    var on = false;
    try{ on = localStorage.getItem("cd_k4_watchlist")==="1"; }catch(e){}
    if(on) wl.classList.add("sel");
    wl.addEventListener("click", function(){
      wl.classList.toggle("sel");
      try{ localStorage.setItem("cd_k4_watchlist", wl.classList.contains("sel")?"1":"0"); }catch(e){}
    });
  })();
})();
