/* K1 — quiz + decision wiring */
(function(){
  "use strict";
  window.CD_QUIZ = [
    {q:"Dalam kerangka 5C, C mana yang dianggap PALING menentukan oleh analis kredit modern?",
     opts:["Collateral — karena ada agunan yang bisa disita","Capacity — kemampuan membayar dari arus kas","Character — karena kepercayaan adalah segalanya","Conditions — karena industri menentukan segalanya"],
     ans:1,
     why:"Capacity. Agunan = parasut cadangan, bukan mesin pesawat. Lender dibayar dari arus kas, bukan dari lelang gudang."},
    {q:"Perbedaan fundamental cara berpikir lender vs investor adalah…",
     opts:["Lender mencari return setinggi mungkin seperti investor","Lender punya upside terbatas (bunga) tapi downside bisa total (gagal bayar)","Lender tidak peduli arus kas, hanya agunan","Investor dan lender memakai kerangka keputusan yang identik"],
     ans:1,
     why:"Upside lender terbatas pada bunga+fee, downside-nya gagal bayar. Karena itu lender dibayar untuk pesimis secara profesional."},
    {q:"Borrower punya agunan Rp20 miliar (likuid) tapi DSCR proyeksi 0,9×. Keputusan yang TEPAT menurut prinsip meja kredit:",
     opts:["Approve — agunan lebih dari cukup menutup risiko","Approve dengan bunga lebih tinggi","Reject / restructure — capacity lemah tidak bisa ditutup agunan","Minta agunan tambahan Rp5 miliar lalu approve"],
     ans:2,
     why:"DSCR < 1 = arus kas tidak cukup membayar utang. Collateral yang bagus tidak pernah menjadi alasan utama memberi pinjaman ke capacity yang lemah."},
    {q:"Urutan alur kerja credit yang BENAR:",
     opts:["Committee → origination → analysis → documentation → monitoring → workout","Origination → analysis → committee → documentation → monitoring → workout","Analysis → origination → documentation → committee → workout → monitoring","Origination → committee → analysis → workout → documentation → monitoring"],
     ans:1,
     why:"Analis bekerja di tahap analysis — menulis memo seolah akan diinterogasi komite, karena memang akan."},
    {q:"C ke-6 modern dalam kerangka kredit adalah…",
     opts:["Connections — jaringan bisnis pemilik","Cash flow — dari mana tepatnya pembayaran berasal","Creativity — inovasi produk borrower","Compliance — kelengkapan dokumen legal"],
     ans:1,
     why:"Cash flow: kualitas & stabilitas CFO. Lender modern menaruh ini di atas collateral — pembayaran datang dari kas, bukan dari dokumen."}
  ];
  window.CD_GATE = "cd_gate_k1";
  window.CDQuiz.init();
  window.CDDecision.init("cd_k1");
  window.CDDecision.saveText("k1", ["k1-keputusan"]);
})();
