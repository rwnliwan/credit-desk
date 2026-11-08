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
Jalankan: python3 qa/qa_credit_r5.py  (dari root repo credit-desk)
Exit 0 = semua PASS.
"""
import re, subprocess, sys
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
check("2c BBRI stress Rp45,8 T hadir", "Rp45,8 T" in read("k5/index.html"))
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
check("4c BBRI: laba tersisa 45,8 T", close(60.15 - (0.045 * 41.76 / 0.0335 - 41.76), 45.8, 0.05))
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
check("6f MF-2 CFO -30% lama hilang, -17% hadir",
      "Arus kas operasi kuartal ini turun 30%" not in k4 and "turun <strong>17%</strong>" in k4
      and "CFO kuartal −30%" not in read("k7/index.html") and "CFO trailing-12-bulan −17%" in read("k7/index.html"))
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
check("6l SF-6 Rp2 T = limit interbank, bukan nominal subdebt; Rp45,8 T bertahan",
      "limit penempatan interbank, bukan nominal subdebt" in read("k5/index.html")
      and "Rp45,8 T" in read("k5/index.html")
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

print(f"PASS {len(passes)}/{len(passes) + len(fails)}")
for f in fails:
    print("FAIL:", f)
sys.exit(1 if fails else 0)
