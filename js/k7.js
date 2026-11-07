/* K7 — quiz + memo wiring */
(function(){
  "use strict";
  window.CD_QUIZ = [
    {q:"Komite kredit membuka memo — bagian mana yang mereka baca pertama, dan apa yang harus ada di sana?",
     opts:["Latar belakang perusahaan yang lengkap","Ringkasan eksekutif: rekomendasi + 2–3 angka kunci + risiko terbesar","Lampiran laporan keuangan 3 tahun","Profil manajemen sedetail mungkin"],
     ans:1,
     why:"Komite memutuskan dari rekomendasi + angka kunci; detail ada di badan memo untuk diinterogasi. Memo yang menyembunyikan rekomendasi di halaman 5 = memo yang tidak percaya diri."},
    {q:"PT Sinar Kemas: EAD Rp7 miliar. Agunan terjual bersih Rp6,3 miliar setelah haircut & biaya. Berapa LGD-nya?",
     opts:["90% (6,3 ÷ 7)","10% (1 − 6,3 ÷ 7)","30% (haircut forced sale)","0% (agunan menutup utang)"],
     ans:1,
     why:"Recovery rate = 6,3 ÷ 7 = 90%; LGD = 1 − 90% = 10%. Haircut 30% adalah potongan atas nilai pasar agunan — bukan LGD."},
    {q:"Bank umum bermodal Rp10.000 miliar. Berapa BMPK untuk satu peminjam yang BUKAN pihak terkait?",
     opts:["Rp1.000 miliar (10%)","Rp2.000 miliar (20%)","Rp2.500 miliar (25%)","Rp3.000 miliar (30%)"],
     ans:1,
     why:"PBI 7/3/PBI/2005: 1 peminjam bukan pihak terkait = 20% dari modal bank (Rp2.000 miliar). 25% untuk satu kelompok peminjam; 10% untuk pihak terkait."},
    {q:"CFO Sinar Kemas turun 25% dari Rp4,5 miliar. Berapa DSCR barunya, dan apa artinya?",
     opts:["1,6× — tidak berubah, DSCR memakai laba bukan kas","1,18× — breach covenant DSCR ≥ 1,25×","1,3× — sama seperti update Q1 di K4","0,94× — sudah tidak bisa membayar"],
     ans:1,
     why:"CFO baru = 4,5 × 0,75 = Rp3,375 miliar; 3,375 ÷ 2,86 = 1,18× < 1,25× → breach covenant. Baru pada CFO −40% DSCR jatuh ke 0,94× (di bawah 1,0)."},
    {q:"Dua red flag Character yang independen dan belum terjawab pada satu borrower. Respons yang tepat menurut kerangka K7?",
     opts:["Abaikan — red flag hanya opini, angka yang menentukan","Tunda keputusan sampai keduanya dijawab; bila tak terjawab = tolak atau struktur keras","Approve dengan bunga lebih tinggi — harga menutup segalanya","Minta agunan tambahan lalu approve tanpa menjawab flag-nya"],
     ans:1,
     why:"Satu flag = pertanyaan wajib dijawab sebelum komite. Dua flag independen tak terjawab = pola, bukan kebetulan — tolak atau struktur keras. Bunga tidak memperbaiki character; agunan tidak menjawab ketidakjujuran."}
  ];
  window.CD_GATE = "cd_gate_k7";
  window.CDQuiz.init();
  window.CDDecision.init("cd_k7");
  window.CDDecision.saveText("k7", ["k7-memo"]);
})();
