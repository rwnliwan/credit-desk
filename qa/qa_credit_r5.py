#!/usr/bin/env python3
"""Harness verifikasi fix Credit Desk ronde 5 Terra (dibuat 2026-11-08).

5 checks (mirip 'harness 5/5' ronde 4):
  1. Rumus DSCR koheren repo-wide (pajak kas tidak di-add-back / dikurang lagi)
  2. Frasa lama yang salah sudah hilang; frasa perbaikan hadir
  3. Angka kanonis ronde 4 BERTAHAN (DSCR 1,84x, K4 1,57x, headroom +20%,
     stress 1,45x/1,21x, 53,6%/37,6% eksak, KLBF 59,0x, EL/LGD, PPKA, BMPK,
     severe 2,89x, NIM BBRI 7,74% [DIUNGKAP BANK])
  4. Angka baru ronde 5 terhitung ulang independen
  5. Sintaks JS valid (node --check) + struktur kunci Simulator B = reject
  8. Fix ronde 8 — GG-10 parser numerik dua arah (tolak malformed + terima
     valid, dieksekusi node dari KEDUA salinan) + kunci dedup SF-1
     (parseIDNumber byte-identik common.js vs parse-id.js) + label NIT-1.
     §8 mengunci KELAS, bukan hanya contoh: tabel tetap 38 kasus + uji
     properti generatif (seed tetap) yang membangkitkan ribuan/malformed
     dari aturan umum parser. Keterbatasan: format valid di luar pola umum
     (mis. pemisah selain titik/koma/spasi) tidak tercakup — tambah ke
     generator bila muncul.
  9. Fix ronde 9 — GG-25 (format campuran "12,345.67" + separator terminal
     "12,"/"12."), GG-26 (asimetri tanda + antar-mode), GG-27 (kualifikasi
     kanonis 1,84x tak terbawa ke modul hilir), GG-28 (rantai hitung campur
     basis pra-/pasca-pajak: BBRI 45,8 T -> ~49,0 T) + perkuat GG-7 (klaim
     absolut "tidak pernah"), GG-10 (struktur grup titik / pasangan mode),
     GG-14 (1,84x di K3/K5). KETERBATASAN JUJUR GG-28: kelas ini hanya
     terkunci per-fixture (seperti qa_learn_numbers); deteksi pola umum
     ("beban pra-pajak dikurang dari laba pasca-pajak") butuh triase manusia
     — masukkan ke prompt review ronde berikut. Keterbatasan GG-27: pindai
     string ±200 karakter, bukan pemahaman semantik — kualifikasi yang
     maknanya sama dengan kata lain tetap butuh triase manusia.
Jalankan: python3 qa/qa_credit_r5.py  (dari root repo credit-desk)
Exit 0 = semua PASS.
"""
import json, math, os, re, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path.home() / "workspace" / "credit-desk"
fails, passes = [], []

def check(name, ok, detail=""):
    (passes if ok else fails).append(name + (f" — {detail}" if detail and not ok else ""))

def read(p):
    return (ROOT / p).read_text(encoding="utf-8")

ALL = {}
for p in sorted(ROOT.rglob("*")):
    if p.suffix in (".html", ".js") and p.is_file():
        ALL[str(p.relative_to(ROOT))] = p.read_text(encoding="utf-8")
BLOB = "\n".join(ALL.values())

# --- 1. Rumus DSCR koheren ---
check("1a tak ada 'bunga kas + pajak kas' (add-back ganda)", "bunga kas + pajak kas" not in BLOB)
check("1b 'pajak kas − capex' hanya di rute EBITDA (di sana pajak memang dikurang)",
      all("EBITDA" in line for line in BLOB.splitlines() if "pajak kas − capex" in line))
check("1c tak ada 'kurangi capex maintenance, pajak kas'", "kurangi capex maintenance, pajak kas" not in BLOB)
check("1d rumus tabel K2 = (CFO + bunga kas − capex maintenance)",
      "(CFO + bunga kas − capex maintenance)" in read("k2/index.html"))
check("1e K6 Q1 rute EBITDA memuat Δmodal kerja",
      "EBITDA − Δmodal kerja − pajak kas − capex maintenance − dividen" in read("k6/index.html"))
check("1f K6 Q4 memuat pembagi DSCR minimum",
      "bagi dengan <strong>DSCR minimum</strong>" in read("k6/index.html"))
check("1g K6 Q4 contoh CFO 45 → DS maks 36",
      "45 ÷ 1,25 = 36" in read("k6/index.html"))
check("1h klasifikasi bunga PSAK 2 disebut di K2 §1",
      read("k2/index.html").count("PSAK 2") >= 2 and "pendanaan" in read("k2/index.html"))

# --- 2. Frasa lama hilang / frasa baru hadir ---
for phrase in ["praktis nol", "otomatis saat default (Kol-5",
               "angka penyisihan yang sama", "sudah breach sejak awal",
               "53,5%", "37,5%", "batas bawah konservatif",
               "rugi Rp2,58 T artinya tidak ada kas operasi",
               "Nilai plus: menyebut evergreening"]:
    check(f"2a frasa lama hilang: '{phrase[:40]}…'", phrase not in BLOB)
check("2b K5 WSKT: rugi ≠ bukti CFO + paket tak sajikan CFO",
      "tidak menyajikan CFO sama sekali" in read("k5/index.html"))
check("2c BBRI stress Rp49,0 T hadir (R9 GG-28: estimasi pasca-pajak, bukan 45,8 T salah-basis)", "Rp49,0 T" in read("k5/index.html") and "Rp45,8 T" not in read("k5/index.html"))
check("2d BBRI basis kredit tersirat Rp1.246,6 T", "1.246,6" in read("k5/index.html"))
check("2e K7 hold revolving 1,75x dua kuartal", "1,75× selama dua kuartal" in read("k7/index.html"))
check("2f K7 EL pasca-revolving Rp9 juta", "Rp9 juta" in read("k7/index.html"))
check("2g monitoring badge PRESUMSI DEFAULT", "PRESUMSI DEFAULT" in read("js/monitoring.js"))
check("2h monitoring NPL portofolio terdefinisi", "NPL portofolio bank" in read("js/monitoring.js")
      and "portofolio kredit korporasi bank" in read("monitoring/index.html"))
check("2i k5.js exit tampilkan terms", "v==='exit'" in read("js/k5.js"))
check("2j covenant-designer headroom vs base",
      "Headroom di tabel hasil dihitung vs <strong>angka base</strong>" in read("covenant-designer/index.html"))
check("2k covenant-designer verdict bukan 'sinyal tepat waktu'",
      "bukan bukti covenant memberi sinyal tepat waktu" in read("js/covenant-designer.js"))
check("2l simulator threshold: headroom nol bukan breach",
      "headroom nol (bukan breach" in read("js/simulator.js"))
check("2m simulator G-3: div post-ds hadir",
      'id="post-ds"' in read("simulator/index.html") and "postDS" in read("js/simulator.js"))
check("2n K2 worksheet rekonsiliasi lengkap hadir",
      "Worksheet rekonsiliasi kas" in read("k2/index.html") and "4,67" in read("k2/index.html")
      and "1,63×" in read("k2/index.html") and "1,46×" in read("k2/index.html"))

# --- 3. Angka kanonis ronde 4 BERTAHAN ---
r4 = [
    ("3a DSCR 1,84x", "1,84×", "k2/index.html"),
    ("3b K4 Q1 1,57x", "1,57×", "k4/index.html"),
    ("3c headroom D/E +20%", "+20%", "k3/index.html"),
    ("3d stress CFO -25% 1,45x", "1,45×", "k7/index.html"),
    ("3e stress CFO -40% 1,21x", "1,21×", "k7/index.html"),
    ("3f reverse eksak 53,6%", "53,6%", "k7/index.html"),
    ("3g covenant jebol eksak 37,6%", "37,6%", "k7/index.html"),
    ("3h KLBF 59,0x", "59,0×", "k5/index.html"),
    ("3i EL Rp3,5 juta", "Rp3,5 juta", "k7/index.html"),
    ("3j EL second-ranking Rp28,5 juta", "Rp28,5 juta", "k7/index.html"),
    ("3k PPKA 20x / Rp35 juta", "Rp35 juta", "k7/index.html"),
    ("3l BMPK Rp2.500 miliar", "Rp2.500 miliar", "k7/index.html"),
    ("3m severe 2,89x", "2,89×", "k7/index.html"),
    ("3n NIM BBRI 7,74% [DIUNGKAP BANK] tak disentuh", "7,74%", "k5/index.html"),
]
for name, needle, f in r4:
    check(name, needle in read(f))
check("3o js/k7.js −53,6% (minus Unicode U+2212)", "−53,6%" in read("js/k7.js"))

# --- 4. Hitung ulang independen angka baru ---
def close(a, b, tol=0.02):
    return abs(a - b) <= tol
check("4a BBRI: 41,76/0,0335 = 1246,6 T", close(41.76 / 0.0335, 1246.6, 0.5))
check("4b BBRI: CKPN 4,5% = 56,1 T", close(0.045 * 41.76 / 0.0335, 56.1, 0.05))
check("4c BBRI: laba tersisa ~49,0 T (R9 GG-28: delta pra-pajak dikenai tarif efektif)",
      close(60.15 - (0.045 * 41.76 / 0.0335 - 41.76) * (1 - 0.2177), 48.93, 0.05)
      and close(60.15 - (0.045 * 41.76 / 0.0335 - 41.76) * (1 - 0.22), 48.96, 0.05)
      and close(60.15 - (0.045 * 41.76 / 0.0335 - 41.76) * (1 - 0.2177), 49.0, 0.1))
check("4d reverse (4,5-2,09)/4,5 = 53,6%", close((4.5 - 2.09) / 4.5 * 100, 53.6, 0.05))
check("4e covenant jebol (4,5-2,81)/4,5 = 37,6%", close((4.5 - 2.81) / 4.5 * 100, 37.6, 0.05))
check("4f EL EAD 9 = Rp9 juta", close(0.01 * 0.10 * 9 * 1000, 9, 0.01))
check("4g worksheet kas covenant 4,17; DSCR 1,46x",
      close(4.5 + 0.77 - 0.60 - 0.50, 4.17, 0.01) and close(4.17 / 2.86, 1.46, 0.01))
check("4h worksheet kas standar 4,67; DSCR 1,63x",
      close(4.5 + 0.77 - 0.60, 4.67, 0.01) and close(4.67 / 2.86, 1.63, 0.01))
check("4i anuitas K2 40/4thn/11% = 12,89", close(40 * 0.11 * 1.11**4 / (1.11**4 - 1), 12.89, 0.01))
check("4j headroom DSCR CD (120/84-1,2)/(120/84) = 16,0%", close((120 / 84 - 1.2) / (120 / 84) * 100, 16.0, 0.05))
check("4k headroom D/E CD baru (0,9-0,75)/0,75 = 20%", close((0.9 - 0.75) / 0.75 * 100, 20, 0.05))
check("4l headroom Debt/EBITDA CD (3,0-2,5)/2,5 = 20%", close((3.0 - 2.5) / 2.5 * 100, 20, 0.05))
check("4m headroom IC CD (5-4)/5 = 20%", close((5 - 4) / 5 * 100, 20, 0.05))
check("4n headroom NW CD (400-340)/400 = 15%", close((400 - 340) / 400 * 100, 15, 0.05))
check("4o B CFO-DSCR 60/84 = 0,71x", close(60 / 84, 0.71, 0.01))
check("4p DS maks CFO 45 / 1,25 = 36", close(45 / 1.25, 36, 0.01))

# --- 5. Sintaks JS + struktur kunci Simulator B ---
for js in sorted((ROOT / "js").glob("*.js")):
    r = subprocess.run(["node", "--check", str(js)], capture_output=True, text=True)
    check(f"5a node --check {js.name}", r.returncode == 0, r.stderr.strip()[:120])
sim = read("js/simulator.js")
check("5b kunci B = reject", 'key: { decision: "reject"' in sim)
check("5c B.term = null", re.search(r"B:\s*\{.*?term:\s*null,", sim, re.S) is not None)
check("5d conditional B hanya 1 poin",
      'cur==="B" && decision==="conditional") dScore = 1' in sim)
check("5e CD sug baru 3.0/4.0/0.9/340",
      all(s in read("js/covenant-designer.js") for s in ["sug: 3.0", "sug: 4.0", "sug: 0.9", "sug: 340"]))
check("5f CD headroom pakai base", "var base = c.fn(SCEN.Base);" in read("js/covenant-designer.js"))

# --- 6. Fix ronde 6 (Terra) ---
k2 = read("k2/index.html")
k4 = read("k4/index.html")
check("6a MF-1 klaim 'batas atas' hilang", "8/thn di bawah adalah" not in k2 and "itu <em>batas atas</em> ruang" not in k2)
check("6b MF-1 klaim 'vonis ini robust' hilang", "vonis ini robust" not in k2)
check("6c MF-1 ruang bunga 10 -> 16/thn, bunga 20 -> 24/thn", "16/thn" in k2 and "24/thn" in k2
      and "(45 + bunga kas − capex maintenance) ÷ 1,25 − 28" in k2)
check("6d MF-1 vonis tak dapat dibuktikan + gap note", "TIDAK dapat dibuktikan dari data yang diberikan" in k2
      and "Catatan gap" in k2 and "TIDAK DAPAT DIPUTUSKAN" in k2)
check("6e MF-2 horizon TTM didefinisikan", "trailing-12-bulan (TTM)" in k4 and "bukan angka kuartal mentah" in k4)
check("6f MF-2 CFO -30% lama hilang, -17,3% hadir",
      "Arus kas operasi kuartal ini turun 30%" not in k4 and "turun <strong>17,3%</strong>" in k4
      and "CFO kuartal −30%" not in read("k7/index.html") and "CFO trailing-12-bulan −17,3%" in read("k7/index.html"))
check("6g SF-1 frasa 'ke arah bahaya' (bukan menjauhi)",
      "menjauhi arah bahaya" not in BLOB and "ke arah bahaya" in read("k3/index.html")
      and "threshold digeser ke arah bahaya" in read("js/k3.js"))
check("6h SF-2 Q3 k2.js opsi rumus lengkap", "(CFO normalisasi + bunga kas − capex maintenance) ÷ DSCR minimum" in read("js/k2.js")
      and "ruang debt service TAHUNAN" in read("js/k2.js"))
check("6i SF-3 rata-rata hanya menyebarkan one-off + CFI",
      "hanya menyebarkan dampak one-off" in read("js/k2.js") and "arus kas investasi (CFI)" in read("js/k2.js")
      and "hanya <em>menyebarkan</em> dampak one-off" in k2)
check("6j SF-4 retry bersihkan right/wrong", 'classList.remove("right","wrong")' in read("js/quiz.js"))
check("6k SF-5 gerbang tak mengunci navigasi", "tidak mengunci navigasi" in read("index.html")
      and "Quiz &amp; Penanda Lulus" in read("k1/index.html"))
check("6l SF-6 Rp2 T = limit interbank, bukan nominal subdebt; Rp49,0 T bertahan (R9 GG-28)",
      "limit penempatan interbank, bukan nominal subdebt" in read("k5/index.html")
      and "Rp49,0 T" in read("k5/index.html")
      and "Rp45,8 T" not in read("k5/index.html")
      and "kupon tahunan partisipasi Rp2 T" not in read("k5/index.html")
      and "nominal partisipasi subdebt × tingkat kupon" in read("k5/index.html"))
check("6m N-1 Character heuristik, bukan absolut", "tidak bisa diperbaiki covenant" not in BLOB
      and "heuristik analis kredit" in read("k6/index.html") and "heuristik analis kredit" in read("k7/index.html"))
check("6n N-2 satuan 'Rp M' tak terdefinisi hilang", '"Rp M"' not in BLOB and 'unit: "Rp miliar"' in read("js/covenant-designer.js"))
check("6o hitung ulang: ruang bunga 10 = 16, bunga 20 = 24",
      close((45 + 10) / 1.25 - 28, 16, 0.01) and close((45 + 20) / 1.25 - 28, 24, 0.01))
check("6p hitung ulang: CFO TTM -17,3%; DSCR TTM 1,57x",
      close((4.5 - 3.72) / 4.5 * 100, 17.3, 0.1) and close((3.72 + 0.77) / 2.86, 1.57, 0.01))
check("6q do-not-flag: NIM 7,74% tak disentuh (ROE KLBF 14,66% tidak ada di repo ini — angka FSA, bukan Credit)",
      "7,74%" in read("k5/index.html"))
check("6r definisi kanonik kas tersedia bertahan", "(CFO + bunga kas − capex maintenance)" in k2)

# --- 7. Fix ronde 7 (Terra, 0 must + 2 should + 4 nit) ---
k1 = read("k1/index.html")
k3 = read("k3/index.html")
k5 = read("k5/index.html")
check("7a SF-1 K1 DSCR 1,84x berlabel sebelum capex maintenance",
      "sebelum capex maintenance" in k1 and "1,84×" in k1
      and "capex maintenance belum diberikan" in k1)
check("7b SF-2 formula rate tanpa fees; fee di luar suku bunga",
      "All-in lending rate = cost of funds + risk premium" in k3
      and "Fees (di luar suku bunga)" in k3
      and "tidak dijumlahkan" in k3)
check("7c SF-2 formula lama hilang repo-wide (HTML+JS)",
      "Pricing = cost of funds + risk premium + fees" not in BLOB)
check("7d SF-2 kuis K3 opsi benar = rate saja, fee terpisah",
      "dihitung terpisah, bukan dijumlah ke rate" in read("js/k3.js"))
check("7e N-1 K4 17,3% konsisten, tak ada 17% bulat tersisa",
      "turun <strong>17%</strong>" not in k4 and "turun 17% " not in k4
      and k4.count("17,3%") >= 3 and "−17,3%" in k4)
check("7f N-2 K5 coverage 59,0x mengulang basis EBIT di Q1 + alasan",
      "coverage 59,0× (basis EBIT)" in k5 and "coverage 59,0× basis EBIT" in k5)
check("7g N-3 monitoring: label DSCR basis EBITDA di baris hasil + narasi",
      "DSCR — basis EBITDA (covenant" in read("js/monitoring.js")
      and "DSCR (basis EBITDA) 1,76" in read("js/monitoring.js")
      and "DSCR (basis EBITDA) 0,72" in read("js/monitoring.js"))
check("7h N-3 covenant-designer: label basis EBITDA di baris hasil DSCR/IC",
      '(id==="dscr"||id==="ic") ? " (basis EBITDA)" : ""' in read("js/covenant-designer.js")
      and "basis EBITDA ÷ debt service" in read("covenant-designer/index.html"))
check("7i N-3 simulator: kunci A/C menyebut basis EBITDA",
      "DSCR (basis EBITDA) 3,04" in read("js/simulator.js")
      and "DSCR (basis EBITDA) 0,30" in read("js/simulator.js"))
check("7j N-4 headroom = persen relatif vs base, bukan selisih absolut",
      "Headroom relatif vs base" in read("js/covenant-designer.js")
      and "persen relatif vs base" in read("covenant-designer/index.html")
      and "bukan selisih rasio absolut" in read("covenant-designer/index.html"))
check("7k K2 vonis kanonis TIDAK DAPAT DIPUTUSKAN bertahan; batas atas/robust hanya negasi",
      "TIDAK DAPAT DIPUTUSKAN" in k2 and "BUKAN batas atas" in k2
      and "tidak robust" in k2 and "batas atas" not in read("js/k2.js")
      and "robust" not in read("js/k2.js"))
check("7l hitung ulang: DSCR 1,84x; CFO -17,3%; KLBF 59,0x",
      close((4.5 + 0.77) / 2.86, 1.84, 0.01) and close((4.5 - 3.72) / 4.5 * 100, 17.3, 0.1)
      and close(4080 / 69.2, 59.0, 0.05))

# --- 8. Fix ronde 8 — GG-10 parser numerik dua arah + dedup SF-1 + NIT-1 ---
# GG-10: guard lama hanya menguji penolakan (R7 Investment F1 mengetatkan parser
# ke arah tolak-malformed). R8 MF-1 membuktikan sisi penerimaan bolong:
# "10.000.000"/"1.234.567" valid ditolak jadi NaN. Guard ini mengeksekusi
# parseIDNumber ASLI (verbatim dari file) di node, dari KEDUA salinan, untuk
# KEDUA arah — terima valid + tolak malformed — plus kunci dedup SF-1.
def _extract_parser(src):
    m = re.search(r"function parseIDNumber[\s\S]*?\n\}", src)
    return m.group(0) if m else None

def _run_parser(fn_src, cases):
    payload = json.dumps([[s, d] for (s, d, _e) in cases])
    js = (fn_src + "\nconst CASES=" + payload + ";\n"
          "const OUT=CASES.map(function(c){var v=parseIDNumber(c[0],c[1]);"
          "return Number.isNaN(v)?null:v;});\nconsole.log(JSON.stringify(OUT));\n")
    fd, tmp = tempfile.mkstemp(suffix=".js", dir="/tmp")
    try:
        with os.fdopen(fd, "w") as f:
            f.write(js)
        r = subprocess.run(["node", tmp], capture_output=True, text=True)
        if r.returncode != 0:
            return None, r.stderr.strip()[:200]
        return json.loads(r.stdout.strip()), ""
    finally:
        os.unlink(tmp)

_fn_common = _extract_parser(read("js/common.js"))
_fn_parseid = _extract_parser(read("js/parse-id.js"))
check("8a parseIDNumber ada di js/common.js", _fn_common is not None)
check("8b parseIDNumber ada di js/parse-id.js", _fn_parseid is not None)
check("8c SF-1 dedup: fungsi parseIDNumber byte-identik common.js vs parse-id.js",
      _fn_common is not None and _fn_common == _fn_parseid)

# Tabel kasus: (input, isDecimal, expected) — expected None = NaN
_PARSER_CASES = [
    # TERIMA — angka Indonesia valid (MF-1 + regresi format yang sudah benar)
    ("10.000.000", False, 10000000),   # MF-1: ribuan bertingkat tanpa koma
    ("1.234.567", False, 1234567),     # MF-1
    ("10.000.000", True, 10000000),    # MF-1, mode desimal
    ("1.234.567", True, 1234567),      # MF-1, mode desimal
    ("1.234.567.890", False, 1234567890),
    ("1.234.567.890", True, 1234567890),
    ("-10.000.000", False, -10000000),
    ("-1.234.567", False, -1234567),
    ("+10.000.000", False, 10000000),
    ("1.234.567,89", False, 1234567.89),
    ("1.234.567,89", True, 1234567.89),
    ("1.234,56", False, 1234.56),
    ("1.234,56", True, 1234.56),
    ("1.000", False, 1000),
    ("2.26", False, 2.26),
    ("1.234", True, 1.234),   # mode desimal: satu titik = desimal, BUKAN ribuan
    ("10.000", True, 10),     # idem — jangan sampai fix MF-1 mengubahnya
    ("0.000", False, 0),      # MF-2 REFUTED R8: 0.xxx selalu desimal -> 0, bukan NaN
    ("0.000", True, 0),       # idem
    (" 1.234,56 ", False, 1234.56),  # trim luar tetap jalan
    ("123,45", False, 123.45),
    ("123,45", True, 123.45),
    # TOLAK — malformed -> NaN
    ("1.2.3", False, None),   # F3: kelompok bukan 3 digit
    ("1.2.3", True, None),
    ("1.234.56", False, None),
    ("1234.567.890", False, None),  # kelompok pertama 4 digit
    ("1,2,3", False, None),   # koma ganda (dulu lolos diam-diam jadi 1.2 via parseFloat)
    ("1,2,3", True, None),
    ("1 234,56", False, None),  # N-1: spasi internal kini ditolak
    ("1 000", False, None),     # N-1
    ("1 234,56", True, None),   # N-1, mode desimal
    ("abc", False, None),
    ("", False, None),
    ("1.2.3.4", False, None),
    ("0.000.000", False, None),  # aturan lama "0.xxx selalu desimal" (2 titik -> NaN)
    ("1..234", False, None),
    ("--1", False, None),
    ("1-2", False, None),
    # R9 GG-25 — format campuran koma + titik grup bukan-3-digit -> NaN kedua mode
    ("12,345.67", False, None),
    ("12,345.67", True, None),
    ("12,34.56", False, None),
    ("12,34.56", True, None),
    ("1,234.5", False, None),
    ("1,234.5678", False, None),  # grup titik 4 digit setelah koma
    # R9 GG-25 — separator terminal (angka tak lengkap) -> NaN kedua mode
    ("12,", False, None),
    ("12,", True, None),
    ("12.", False, None),
    ("12.", True, None),
    ("-12,", False, None),
    ("+12.", True, None),
    ("1.234,", False, None),
    ("1.234,", True, None),
    ("0.", False, None),
    ("0.", True, None),
    # R9 GG-25 — kontrol valid: titik ribuan 3-digit + koma desimal tetap diterima
    ("12.345,67", False, 12345.67),
    ("12.345,67", True, 12345.67),
    ("1234,56", False, 1234.56),  # tanpa titik: head bebas (Terra R9)
    ("1234,56", True, 1234.56),
    # R9 GG-26 — pasangan kedua mode untuk + dan - pada tiap bentuk ribuan
    ("+10.000.000", True, 10000000),
    ("+1.234.567", True, 1234567),
    ("-10.000.000", True, -10000000),
    ("-1.234.567", True, -1234567),
    ("+1.234,56", False, 1234.56),
    ("+1.234,56", True, 1234.56),
    ("-1.234,56", True, -1234.56),
    ("+123,45", False, 123.45),
    ("+123,45", True, 123.45),
    ("-123,45", False, -123.45),
    ("-123,45", True, -123.45),
    ("+1.000", False, 1000),
    ("+1.000", True, 1),
    ("-1.000", True, -1),
]
_results = {}
_run_err = ""
for _label, _fn in (("common.js", _fn_common), ("parse-id.js", _fn_parseid)):
    if _fn is None:
        continue
    _out, _err = _run_parser(_fn, _PARSER_CASES)
    if _out is None:
        _run_err += f"{_label}: {_err}; "
    else:
        _results[_label] = _out
if not _results:
    check("8d node eksekusi parseIDNumber dari kedua file", False, _run_err)
else:
    for _i, (_s, _d, _exp) in enumerate(_PARSER_CASES):
        _want = "NaN" if _exp is None else _exp
        _bad = []
        for _label, _out in _results.items():
            _got = _out[_i]
            _ok = (_got is None and _exp is None) or (
                _got is not None and _exp is not None and abs(_got - _exp) < 1e-9)
            if not _ok:
                _bad.append(f"{_label}={_got}")
        check(f"8e parser {(_s, 'des' if _d else 'int')} -> {_want}", not _bad, "; ".join(_bad))

# 8k/8l — kunci KELAS (bukan hanya contoh ronde ini): bangkitkan kasus secara
# programatik dari ATURAN UMUM parser, seed tetap (deterministik). Aturan umum:
# (a) ribuan bertingkat valid = kelompok pertama 1-3 digit + tiap kelompok
# berikut tepat 3 digit, tanpa koma desimal; (b) satu titik di mode desimal =
# desimal, bukan ribuan; (c) malformed apa pun (kelompok bukan 3 digit, koma
# ganda, spasi internal) -> NaN. Bila format valid baru muncul di luar pola
# ini, tambah ke generator — bukan hanya ke tabel tetap di atas.
import random as _random
_rng = _random.Random(20261108)
_gen_valid, _gen_bad = [], []
for _ in range(20):
    _head = str(_rng.randint(1, 999))  # 1-3 digit, bukan 0 (aturan 0.xxx)
    _ng = _rng.randint(2, 4)
    _gr = ["%03d" % _rng.randint(0, 999) for _ in range(_ng)]
    _s = _head + "." + ".".join(_gr)
    _val = int(_head + "".join(_gr))
    _gen_valid += [(_s, False, _val), (_s, True, _val)]
    if _rng.random() < 0.5:  # varian berkoma desimal
        _dec = "%02d" % _rng.randint(0, 99)
        _fv = _val + float("0." + _dec)
        _gen_valid += [(_s + "," + _dec, False, _fv), (_s + "," + _dec, True, _fv)]
for _ in range(20):
    _head = str(_rng.randint(1, 999))
    _ng = _rng.randint(2, 3)
    _gr = ["%03d" % _rng.randint(0, 999) for _ in range(_ng)]
    _bi = _rng.randrange(_ng)
    _gr[_bi] = "".join(str(_rng.randint(0, 9)) for _ in range(_rng.choice([1, 2, 4, 5])))
    _s = _head + "." + ".".join(_gr)
    _gen_bad += [(_s, False, None), (_s, _rng.choice([True, False]), None)]
for _ in range(10):
    _a, _b, _c = str(_rng.randint(1, 999)), str(_rng.randint(1, 999)), str(_rng.randint(1, 99))
    _gen_bad += [(f"{_a},{_b},{_c}", False, None), (f"{_a} {_b},{_c}", False, None)]
for _tag, _cases in (("8k gen-valid", _gen_valid), ("8l gen-malformed", _gen_bad)):
    _bad = []
    for _label, _fn in (("common.js", _fn_common), ("parse-id.js", _fn_parseid)):
        if _fn is None:
            continue
        _out, _err = _run_parser(_fn, _cases)
        if _out is None:
            _bad.append(f"{_label} node-gagal: {_err}")
            continue
        for _i, (_s, _d, _exp) in enumerate(_cases):
            _got = _out[_i]
            _ok = (_got is None and _exp is None) or (
                _got is not None and _exp is not None and abs(_got - _exp) < 1e-6)
            if not _ok:
                _bad.append(f"{_label} {(_s, 'des' if _d else 'int')} mau "
                            f"{'NaN' if _exp is None else _exp} dapat {_got}")
    check(f"{_tag}: {_cases and len(_cases)} kasus generatif lolos di kedua salinan",
          not _bad, "; ".join(_bad[:3]))

# NIT-1 — label ambang Monitoring Drill: 75% adalah akibat pembulatan, bukan ambang kedua
_mon = read("monitoring/index.html")
check("8f NIT-1 frasa lama '(75% efektif)' hilang repo-wide", "(75% efektif)" not in BLOB)
check("8g NIT-1 label baru: 75% dijelaskan sebagai akibat pembulatan, bukan ambang",
      "bukan ambang 75%" in _mon and "pembulatan" in _mon)
check("8h NIT-1 ambang tetap ≥70% + lulus ≥9", "≥70%" in _mon and "lulus ≥9" in _mon)
check("8i NIT-1 hitung ulang: ceil(12×0,7)=9; 9/12=75%",
      math.ceil(12 * 0.7) == 9 and abs(9 / 12 - 0.75) < 1e-9)
check("8j monitoring.js tetap pakai Math.ceil(max*0.7)",
      "Math.ceil(max*0.7)" in read("js/monitoring.js"))

# --- 9. Fix ronde 9 — GG-25/26/27/28 + perkuat GG-7/GG-10/GG-14 ---
# 9a GG-28: angka 45,8 T salah-basis hilang repo-wide; estimasi ~49,0 T hadir
check("9a GG-28 angka salah-basis Rp45,8 T hilang repo-wide", "Rp45,8 T" not in BLOB)
check("9b GG-28 k5 menyebut pajak efektif + estimasi (bukan angka pasti)",
      "pajak efektif" in k5 and "estimasi" in read("k5/index.html")
      and ("21,77%" in k5 or "22%" in k5))
# 9c GG-27/GG-14: tiap "1,84" di luar K1/K2 wajib disertai frasa kanonis ±200 karakter
_viol_184 = []
for _rel, _txt in ALL.items():
    if _rel.startswith("k1/") or _rel.startswith("k2/") or _rel.startswith("js/k1.js") or _rel.startswith("js/k2.js"):
        continue
    for _m in re.finditer(r"1,84", _txt):
        _win = _txt[max(0, _m.start() - 200):_m.end() + 200]
        if "sebelum capex maintenance" not in _win:
            _viol_184.append(f"{_rel}@{_m.start()}")
check("9c GG-27/GG-14 tiap '1,84' di luar K1/K2 disertai 'sebelum capex maintenance' ±200 karakter",
      not _viol_184, "; ".join(_viol_184[:6]))
check("9d GG-14 K3 §2 merujuk worksheet K2 §1 (tempat contoh lengkap)",
      "K2 §1" in k3)
# 9e GG-7: klaim absolut — mantra C6 ("tidak pernah menjadi alasan memberi
# pinjaman ...") wajib terkualifikasi. KETERBATASAN: pemindai ini mengunci
# kalimat C6 spesifik, BUKAN semua "tidak pernah" repo-wide — kemunculan lain
# ("tidak pernah ragu" index.html, "tidak pernah gagal bayar" simulator.js,
# "tidak pernah bisa dilanggar" k3, "tidak pernah membenarkan" k7) adalah
# datum faktual / definisi / retorika yang direview manusia dan dibiarkan;
# kelas absolut umum tetap butuh triase manusia di prompt review berikut.
check("9e GG-7 mantra C6 tanpa kualifikasi hilang repo-wide",
      "tidak pernah menjadi alasan memberi pinjaman" not in BLOB
      and "tidak pernah menjadi alasan memberi pinjaman ke capacity" not in BLOB)
check("9f GG-7 bentuk terkualifikasi 'alasan utama' hadir di K1 + kunci kuis",
      "tidak pernah menjadi alasan utama" in read("k1/index.html")
      and "tidak pernah menjadi alasan utama" in read("js/k1.js"))
# 9g C4/C5 nit: label contoh generik + komponen biaya dijelaskan di titik pakai
check("9g C4 label '(contoh generik)' pada tabel contoh K3 §1 dan §2",
      k3.count("(contoh generik)") >= 2)
check("9h C5 'biaya 1,5%' dijelaskan sebagai biaya operasional & modal di K3",
      "biaya operasional" in k3 and "modal 1,5%" in k3)
# 9i P2-G1 gap: kontrak perilaku parser tertulis di header kedua salinan
check("9i P2-G1 tabel kontrak perilaku di header js/parse-id.js + js/common.js",
      "Kontrak perilaku" in read("js/parse-id.js") and "Kontrak perilaku" in read("js/common.js")
      and "12,345.67" in read("js/parse-id.js") and "12," in read("js/parse-id.js"))
# 9j P2-T3 closed-as-designed: round-trip fmtID -> parseIDNumber utuh (termasuk negatif)
def _extract_fn(src, name):
    m = re.search(r"function " + name + r"[\s\S]*?\n\}", src)
    return m.group(0) if m else None
_fmt = _extract_fn(read("js/common.js"), "fmtID")
_rt_ok, _rt_err = True, ""
if _fmt is None or _fn_common is None:
    _rt_ok, _rt_err = False, "fmtID/parseIDNumber tak ditemukan di js/common.js"
else:
    _js = (_fn_common + "\n" + _fmt + "\n"
           "var R=[];[[ -12.75,true],[1234.56,true],[10000000,false],[-10000000,false]]"
           ".forEach(function(c){var f=fmtID(c[0],c[1]);"
           "R.push(parseIDNumber(f,c[1])===c[0]);});\nconsole.log(JSON.stringify(R));\n")
    _fd, _tmp = tempfile.mkstemp(suffix=".js", dir="/tmp")
    try:
        with os.fdopen(_fd, "w") as _f:
            _f.write(_js)
        _r = subprocess.run(["node", _tmp], capture_output=True, text=True)
        _rt_ok = _r.returncode == 0 and json.loads(_r.stdout.strip()) == [True, True, True, True]
        _rt_err = _r.stderr.strip()[:200] if not _rt_ok else _r.stdout.strip()
    finally:
        os.unlink(_tmp)
check("9j round-trip fmtID->parseIDNumber utuh (P2-T3 closed as designed)", _rt_ok, _rt_err)
# 9k GG-25 generator: "koma lalu titik grup bukan-3-digit" + separator terminal
_rng9 = _random.Random(20261109)
_gen25 = []
for _ in range(12):
    _a = str(_rng9.randint(1, 999))
    _g = "%03d" % _rng9.randint(0, 999)
    _f = "".join(str(_rng9.randint(0, 9)) for _ in range(_rng9.choice([1, 2, 4, 5])))
    _gen25 += [(f"{_a},{_g}.{_f}", False, None), (f"{_a},{_g}.{_f}", True, None)]
for _ in range(8):
    _n = str(_rng9.randint(1, 999999))
    _gen25 += [(f"{_n},", False, None), (f"{_n}.", True, None),
               (f"{_n},", True, None), (f"{_n}.", False, None)]
_bad25 = []
for _label, _fn in (("common.js", _fn_common), ("parse-id.js", _fn_parseid)):
    if _fn is None:
        continue
    _out, _err = _run_parser(_fn, _gen25)
    if _out is None:
        _bad25.append(f"{_label} node-gagal: {_err}")
        continue
    for _i, (_s, _d, _exp) in enumerate(_gen25):
        if _out[_i] is not None:
            _bad25.append(f"{_label} {(_s, 'des' if _d else 'int')} mau NaN dapat {_out[_i]}")
check("9k GG-25 generator campuran + separator terminal: 56 kasus tolak di kedua salinan",
      not _bad25, "; ".join(_bad25[:3]))
# 9l GG-26 generator: pasangan tanda + dan - pada tiap bentuk ribuan, kedua mode
_gen26 = []
for _ in range(10):
    _head = str(_rng9.randint(1, 999))
    _gr = ["%03d" % _rng9.randint(0, 999) for _ in range(_rng9.randint(2, 3))]
    _s = _head + "." + ".".join(_gr)
    _val = int(_head + "".join(_gr))
    for _sgn, _v in (("+", _val), ("-", -_val)):
        _gen26 += [(_sgn + _s, False, _v), (_sgn + _s, True, _v)]
    _dec = "%02d" % _rng9.randint(0, 99)
    _fv = _val + float("0." + _dec)
    for _sgn, _v in (("+", _fv), ("-", -_fv)):
        _gen26 += [(_sgn + _s + "," + _dec, False, _v), (_sgn + _s + "," + _dec, True, _v)]
_bad26 = []
for _label, _fn in (("common.js", _fn_common), ("parse-id.js", _fn_parseid)):
    if _fn is None:
        continue
    _out, _err = _run_parser(_fn, _gen26)
    if _out is None:
        _bad26.append(f"{_label} node-gagal: {_err}")
        continue
    for _i, (_s, _d, _exp) in enumerate(_gen26):
        _got = _out[_i]
        if _got is None or abs(_got - _exp) > 1e-6:
            _bad26.append(f"{_label} {(_s, 'des' if _d else 'int')} mau {_exp} dapat {_got}")
check("9l GG-26 generator pasangan tanda: 80 kasus lolos di kedua salinan/kedua mode",
      not _bad26, "; ".join(_bad26[:3]))

print(f"PASS {len(passes)}/{len(passes) + len(fails)}")
for f in fails:
    print("FAIL:", f)
sys.exit(1 if fails else 0)
