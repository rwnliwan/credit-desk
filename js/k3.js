/* K3 — quiz + covenant designer wiring */
(function(){
  "use strict";
  window.CD_QUIZ = [
    {q:"Fungsi UTAMA covenant bagi lender adalah…",
     opts:["Menghukum borrower yang melanggar","Memberi lender kursi di meja perundingan SEBELUM keadaan memburuk (sinyal dini)","Menambah pendapatan bank dari denda","Menggantikan analisis 5C"],
     ans:1,
     why:"Covenant yang baik = early warning system. Pelanggaran technical breach membuka negosiasi (waiver/cure), bukan langsung krisis."},
    {q:"Threshold covenant yang BENAR ditetapkan dengan cara:",
     opts:["Proyeksi wajar − headroom untuk semua covenant","Proyeksi wajar + headroom untuk semua covenant","Covenant minimum: proyeksi − headroom; covenant maksimum: proyeksi + headroom (threshold digeser ke arah bahaya sejauh headroom)","Menyalin threshold bank kompetitor"],
     ans:2,
     why:"DSCR 1,25 dari proyeksi 1,84 (sebelum capex maintenance) = headroom 32% ke bawah; D/E 1,8 dari proyeksi 1,5 = +20% ke atas; current ratio 1,4 dari 1,8 = 22% ke bawah. Aturan lama 'proyeksi − headroom' hanya benar untuk covenant minimum — untuk covenant maksimum arahnya terbalik."},
    {q:"Perbedaan technical breach vs payment default:",
     opts:["Tidak ada bedanya — keduanya sama bahayanya","Technical breach = melanggar angka tapi masih bayar (meja perundingan); payment default = tidak bayar (meja krisis)","Technical breach lebih berbahaya dari payment default","Payment default bisa di-waiver, technical breach tidak"],
     ans:1,
     why:"Pembedaan ini menentukan respons: negosiasi + waiver + covenant lebih ketat vs tindakan krisis (restructure/tarik fasilitas)."},
    {q:"Anatomi pricing kredit yang benar:",
     opts:["Bunga = angka hasil negosiasi dengan borrower","All-in lending rate = cost of funds + risk premium; fee (provisi, commitment fee) dihitung terpisah, bukan dijumlah ke rate","Pricing = BI rate + margin tetap 2%","Pricing = bunga deposito + 1%"],
     ans:1,
     why:"Hanya komponen rate tahunan yang dijumlahkan: biaya dana bank + harga risiko borrower spesifik. Provisi (sekali, di depan) dan commitment fee (atas plafon tak terpakai) punya basis dan waktu pengenaan berbeda — keduanya biaya terpisah, bukan komponen suku bunga. Borrower yang menawar terlalu rendah meminta subsidi risiko."},
    {q:"Negative covenant yang PALING tepat untuk PT Sinar Kemas (konsentrasi 70% ke 3 pelanggan):",
     opts:["Larangan mengganti direktur utama","Larangan dividen bila DSCR < 1,5× dan belanja modal besar wajib izin","Larangan membuka cabang baru","Larangan memakai konsultan eksternal"],
     ans:1,
     why:"Covenant harus menjawab risiko spesifik kasus ini: konsentrasi pelanggan = risiko kas. Negative covenant yang tepat memagari perilaku yang memperbesar risiko itu."}
  ];
  window.CD_GATE = "cd_gate_k3";
  window.CDQuiz.init();
  window.CDDecision.init("cd_k3");
  window.CDDecision.saveText("k3", ["k3-c1","k3-c2","k3-c3","k3-neg","k3-struktur"]);
})();
