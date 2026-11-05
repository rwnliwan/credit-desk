/* K2 — quiz + worksheet wiring */
(function(){
  "use strict";
  window.CD_QUIZ = [
    {q:"Lender menghitung DSCR dari CFO, bukan dari laba bersih. Alasan utamanya:",
     opts:["Laba bersih lebih sulit dihitung daripada CFO","Yang membayar utang adalah kas, bukan laba akuntansi","CFO selalu lebih besar dari laba bersih","Regulator melarang memakai laba bersih"],
     ans:1,
     why:"Laba bisa naik sementara kas operasi negatif (piutang menumpuk). DSCR dari laba = ilusi; DSCR dari CFO = realita pembayaran."},
    {q:"CFO/NI < 1 selama bertahun-tahun. Dari mata lender, ini berarti:",
     opts:["Perusahaan efisien — laba melebihi kas","Lampu kuning: laba tidak menjadi kas (accruals menumpuk)","Tidak ada artinya bagi analis kredit","Perusahaan pasti akan gagal bayar tahun depan"],
     ans:1,
     why:"Laba kertas tanpa kas = capacity yang dilaporkan melebih-lebihkan capacity sebenarnya. Bukan vonis gagal bayar — tapi wajib diinvestigasi."},
    {q:"Debt capacity dihitung dengan cara:",
     opts:["Total aset dikurangi total utang existing","CFO normalisasi ÷ DSCR minimum, dikurangi debt service existing","EBITDA dikali 5 (aturan praktis)","Ekuitas dikali 2"],
     ans:1,
     why:"Kapasitas utang = level utang maksimum di mana borrower tetap memenuhi DSCR minimum. Ini pagar, bukan valuasi."},
    {q:"Mengapa analis kredit curiga pada EBITDA mentah untuk mengukur kemampuan bayar?",
     opts:["EBITDA terlalu sulit dihitung","EBITDA mengabaikan modal kerja, pajak, dan bunga — komponen yang justru menentukan kas tersedia","EBITDA selalu negatif untuk perusahaan sehat","EBITDA hanya berlaku untuk bank"],
     ans:1,
     why:"EBITDA = laba sebelum banyak hal yang justru harus dibayar. Lender yang memakai EBITDA mentah untuk DSCR menipu dirinya sendiri."},
    {q:"CFO normalisasi memakai rata-rata 3 tahun (bukan tahun terakhir saja) karena:",
     opts:["Agar angkanya terlihat lebih besar","Untuk membuang one-off dan melihat kas yang berkelanjutan","Regulator mewajibkan tepat 3 tahun","Tahun terakhir selalu salah"],
     ans:1,
     why:"Satu tahun bisa mengandung one-off (penjualan aset, restitusi pajak). Kapasitas utang harus berdiri di atas kas yang berulang, bukan kebetulan."}
  ];
  window.CD_GATE = "cd_gate_k2";
  window.CDQuiz.init();
  window.CDDecision.init("cd_k2");
  window.CDDecision.saveText("k2", ["k2-cfo","k2-dscr","k2-ruang","k2-alasan"]);
})();
