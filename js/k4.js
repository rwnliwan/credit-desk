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
     opts:["Bukti bank peduli pada nasabah","NPL yang tertunda, bukan kredit yang sehat kembali","Strategi pertumbuhan bank","Tidak ada implikasi analitis"],
     ans:1,
     why:"Pertanyaan kuncinya: apakah restrukturisasi memperbaiki capacity, atau hanya menunda pengakuan? Yang berulang = yang kedua."},
    {q:"Kombinasi CKPN turun + NPL naik menunjukkan…",
     opts:["Bank makin efisien","Provisi tidak mengejar risiko — lampu merah","Tidak ada masalah selama NPL < 5%","Bank sedang front-loading"],
     ans:1,
     why:"Bantalan (coverage) menipis sementara risiko naik = arah yang salah. Front-loading justru CKPN naik mendahului NPL."},
    {q:"Pada kasus PT Sinar Kemas Q1 (DSCR 1,3×, piutang tertunda, utilisasi 92%, CFO resign), keputusan monitoring yang TEPAT:",
     opts:["Maintain — semua covenant masih terpenuhi","Downgrade / watchlist ketat + migrasi Stage 2 — lima gejala serentak = SICR jelas","Upgrade — borrower masih membayar","Tunggu kuartal depan untuk memastikan tren"],
     ans:1,
     why:"Covenant terpenuhi ≠ sehat. Lima gejala serentak (DSCR menipis, piutang, CFO, utilisasi, resignasi) adalah definisi textbook significant increase in credit risk."}
  ];
  window.CD_GATE = "cd_gate_k4";
  window.CDQuiz.init();
  window.CDDecision.init("cd_k4");
  window.CDDecision.saveText("k4", ["k4-stage","k4-tindakan"]);
})();
