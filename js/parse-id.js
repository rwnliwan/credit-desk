/* parseIDNumber: salinan kedua — WAJIB byte-identik dengan js/common.js (dikunci qa/qa_credit_r5.py §8). Divergen dari fsa-web/js/modul37.js sejak fix R8-MF-1. */
function parseIDNumber(str, isDecimal){
  var s = String(str||"").trim();  // R8-N-1: spasi internal TIDAK lagi dihapus diam-diam — "1 234,56" ditolak (karakter ilegal)
  if(!s) return NaN;
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
    if(s.indexOf(",") < 0 && /^-?\d{1,3}(\.\d{3}){2,}$/.test(s)) s = s.replace(/\./g, "");
    var d2 = (s.match(/\./g)||[]).length, c2 = (s.match(/,/g)||[]).length;
    if(d2 + c2 > 1) return NaN;  // R1/F3: max 1 pemisah desimal
    s = s.replace(",",".");
  } else {
    if(s.indexOf(",")>=0){
      /* format Indonesia: 1.234,56 */
      if(commas !== 1) return NaN;  // R8-GG10: koma ganda ("1,2,3") dulu lolos diam-diam jadi 1.2 via parseFloat
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
