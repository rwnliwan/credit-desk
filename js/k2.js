/* K2 — quiz + worksheet wiring */
(function(){
  "use strict";
  window.CD_QUIZ = [
    {q:"Lender menghitung DSCR dari CFO, bukan dari laba bersih. Alasan utamanya:",
     opts:["Laba bersih lebih sulit dihitung daripada CFO","Yang membayar utang adalah kas, bukan laba akuntansi","CFO selalu lebih besar dari laba bersih","Regulator melarang memakai laba bersih"],
     ans:1,
     why:"Laba bisa naik sementara kas operasi negatif (piutang menumpuk). DSCR dari laba = ilusi; DSCR dari CFO = realita pembayaran — dengan koreksi §1: bunga kas ditambahkan kembali (CFO sudah setelah bunga dibayar — cek dulu klasifikasi bunga di laporan arus kas), capex maintenance dikurangkan, pajak kas TIDAK ditambah atau dikurang lagi (CFO sudah neto pajak). Tanpa koreksi bunga, bunga terhitung dua kali dan DSCR terlalu rendah (Sinar Kemas: 1,57× → 1,84×)."},
    {q:"CFO/NI < 1 selama bertahun-tahun. Dari mata lender, ini berarti:",
     opts:["Perusahaan efisien — laba melebihi kas","Lampu kuning: laba tidak menjadi kas (accruals menumpuk)","Tidak ada artinya bagi analis kredit","Perusahaan pasti akan gagal bayar tahun depan"],
     ans:1,
     why:"Laba kertas tanpa kas = capacity yang dilaporkan melebih-lebihkan capacity sebenarnya. Bukan vonis gagal bayar — tapi wajib diinvestigasi."},
    {q:"Debt capacity dihitung dengan cara:",
     opts:["Total aset dikurangi total utang existing","(CFO normalisasi + bunga kas − capex maintenance) ÷ DSCR minimum, dikurangi debt service existing","EBITDA dikali 5 (aturan praktis)","Ekuitas dikali 2"],
     ans:1,
     why:"Kapasitas utang = level utang maksimum di mana borrower tetap memenuhi DSCR minimum. Ini pagar, bukan valuasi. Rumus lengkapnya memakai (CFO + bunga kas − capex maintenance) ÷ DSCR minimum — pajak kas tidak ditambah atau dikurang lagi (sudah neto di CFO); bila rincian itu tak tersedia, CFO ÷ DSCR minimum hanyalah pendekatan sementara, bukan batas bawah yang terbukti (DSCR sejati bisa lebih rendah bila capex > bunga kas). Perhatikan: hasil rumus ini adalah ruang debt service TAHUNAN, bukan langsung saldo pinjaman maksimum — konversi ke saldo pinjaman masih butuh tenor dan bunga (anuitas), seperti di K2 §2 langkah 4–5."},
    {q:"Mengapa analis kredit curiga pada EBITDA mentah untuk mengukur kemampuan bayar?",
     opts:["EBITDA terlalu sulit dihitung","EBITDA mengabaikan modal kerja, pajak, dan bunga — komponen yang justru menentukan kas tersedia","EBITDA selalu negatif untuk perusahaan sehat","EBITDA hanya berlaku untuk bank"],
     ans:1,
     why:"EBITDA = laba sebelum banyak hal yang justru harus dibayar. Lender yang memakai EBITDA mentah untuk DSCR menipu dirinya sendiri."},
    {q:"CFO normalisasi memakai rata-rata 3 tahun (bukan tahun terakhir saja) karena:",
     opts:["Agar angkanya terlihat lebih besar","Untuk melihat kas yang berkelanjutan — rata-rata 3 tahun menyebarkan dampak one-off, tetapi one-off tetap harus diidentifikasi dan dikeluarkan secara eksplisit","Regulator mewajibkan tepat 3 tahun","Tahun terakhir selalu salah"],
     ans:1,
     why:"Satu tahun bisa mengandung one-off (mis. restitusi pajak satu kali). Rata-rata 3 tahun hanya menyebarkan dampak one-off ke tiga tahun — ia TIDAK membuangnya; normalisasi tetap menuntut identifikasi dan penyesuaian item nonberulang secara eksplisit. Catatan: hasil penjualan aset bukan contoh one-off CFO — itu arus kas investasi (CFI), bukan komponen CFO. Kapasitas utang harus berdiri di atas kas yang berulang, bukan kebetulan."}
  ];
  window.CD_GATE = "cd_gate_k2";
  window.CDQuiz.init();
  window.CDDecision.init("cd_k2");
  window.CDDecision.saveText("k2", ["k2-cfo","k2-dscr","k2-ruang","k2-alasan"]);
})();
