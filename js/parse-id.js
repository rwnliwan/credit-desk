/* parseIDNumber: salinan kedua — WAJIB byte-identik dengan js/common.js (dikunci qa/qa_credit_r5.py §8). Divergen dari fsa-web/js/modul37.js sejak fix R8-MF-1. */
/* Kontrak perilaku parseIDNumber(str, isDecimal) — R9 P2-G1 (tabel ini juga
   di header js/common.js; badan fungsi di kedua file byte-identik).
   TERIMA kedua mode: "10.000.000"->10000000, "1.234,56"->1234.56,
   "1234,56"->1234.56 (tanpa titik, head bebas), "+10.000.000"->10000000,
   "-10.000.000"->-10000000, "0.000"->0. Mode desimal saja: "1.234"->1.234
   (satu titik = desimal, bukan ribuan); mode non-desimal: "1.000"->1000.
   TOLAK kedua mode (NaN): format campuran "12,345.67" (titik grup bukan
   3 digit setelah koma), separator terminal "12," / "12." (angka tak
   lengkap), koma ganda "1,2,3", spasi internal "1 234,56", grup bukan
   3 digit "1.2.3". fmtID memakai minus ASCII "-" agar round-trip
   fmtID->parseIDNumber utuh (termasuk negatif); U+2212 hanya untuk prose. */
function parseIDNumber(str, isDecimal){
  var s = String(str||"").trim();  // R8-N-1: spasi internal TIDAK lagi dihapus diam-diam — "1 234,56" ditolak (karakter ilegal)
  if(!s) return NaN;
  if(/[.,]$/.test(s)) return NaN;  // R9 GG-25: separator terminal ("12,"/"12.") = angka tak lengkap, bukan 12
  /* F3: validasi token penuh */
  if(/[^0-9.,\-+]/.test(s)) return NaN;  // karakter ilegal
  if(/--/.test(s) || /\+\+/.test(s)) return NaN;  // tanda ganda
  if(/\d-\d/.test(s) || /\d\+\d/.test(s)) return NaN;  // tanda di tengah (1-2)
  var dots = (s.match(/\./g)||[]).length;
  var commas = (s.match(/,/g)||[]).length;
  if(isDecimal){
    /* R17-F1: format Indonesia penuh — titik ribuan valid (diikuti kelipatan 3 digit + koma desimal) dilucuti dulu */
    s = s.replace(/\.(?=\d{3}(?:\.\d{3})*,)/g, "");
    /* R8-MF-1: ribuan bertingkat tanpa koma desimal — 10.000.000.
       Hanya bila >=2 kelompok titik (satu titik tetap dibaca desimal: 1.234 -> 1,234). */
    if(s.indexOf(",") < 0 && /^[-+]?\d{1,3}(\.\d{3}){2,}$/.test(s)) s = s.replace(/\./g, "");
    var d2 = (s.match(/\./g)||[]).length, c2 = (s.match(/,/g)||[]).length;
    if(d2 + c2 > 1) return NaN;  // R1/F3: max 1 pemisah desimal
    s = s.replace(",",".");
  } else {
    if(s.indexOf(",")>=0){
      /* format Indonesia: 1.234,56 */
      if(commas !== 1) return NaN;  // R8-GG10: koma ganda ("1,2,3") dulu lolos diam-diam jadi 1.2 via parseFloat
      /* R9 GG-25: titik di sini hanya sah sebagai ribuan (head 1-3 digit +
         tiap grup berikut tepat 3 digit) dan fraksi setelah koma tak boleh
         mengandung titik — format campuran "12,345.67" ditolak (bukan 12.34567). */
      var _cp = s.split(",");
      if(_cp[1].indexOf(".") >= 0) return NaN;
      if(_cp[0].indexOf(".") >= 0){
        var _gp = _cp[0].replace(/^[+-]/, "").split(".");
        var _okg = _gp[0].length >= 1 && _gp[0].length <= 3;
        for(var _i = 1; _i < _gp.length && _okg; _i++) _okg = _gp[_i].length === 3;
        if(!_okg) return NaN;
      }
      s = s.replace(/\./g,"").replace(",",".");
    } else if(/^-?0\./.test(s)){
      /* 0.xxx selalu desimal */
      if(dots !== 1) return NaN;
    } else {
      var parts = s.split(".");
      if(parts.length > 2){
        /* R8-MF-1: ribuan bertingkat tanpa koma — 10.000.000, 1.234.567.
           Terima hanya bila kelompok pertama 1-3 digit dan sisanya tepat 3 digit;
           "1.2.3" tetap ditolak. */
        var head = parts[0].replace(/^[+-]/, "");
        var ok = head.length >= 1 && head.length <= 3;
        for(var i = 1; i < parts.length && ok; i++) ok = parts[i].length === 3;
        if(ok) s = parts.join(""); else return NaN;  // F3: 1.2.3 ditolak
      } else if(parts.length === 2 && parts[1].length === 3 && parts[0] !== "0" && parts[0] !== "-0"){
        s = parts.join("");  // ribuan: 1.000 -> 1000
      } else if(parts.length === 2 && parts[1].length !== 3){
        /* desimal biasa: 2.26 tetap */
      } else if(parts.length === 2){
        return NaN;  // ambiguous
      }
    }
  }
  /* tanda hanya di depan */
  if(/-/.test(s.slice(1)) || /\+/.test(s.slice(1))) return NaN;
  var v = parseFloat(s);
  return isNaN(v) ? NaN : v;
}
