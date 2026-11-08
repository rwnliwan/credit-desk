# QA guards — Credit Desk

| Guard | Yang dicek |
|---|---|
| `qa_credit_r5.py` | Harness verifikasi: rumus DSCR koheren repo-wide, frasa lama yang salah sudah hilang, angka kanonis bertahan, angka baru terhitung ulang independen, sintaks JS valid + struktur kunci Simulator. §8 (ronde 8, GG-10): parser numerik dua arah — eksekusi `parseIDNumber` asli di node dari KEDUA salinan (terima valid multi-ribuan + tolak malformed, termasuk MF-2 REFUTED `"0.000"` → 0) + kunci dedup SF-1 (fungsi byte-identik `common.js` vs `parse-id.js`) + uji properti generatif dari aturan umum parser (kunci KELAS, bukan hanya contoh) + label ambang Monitoring Drill NIT-1. |

Jalankan dari root repo ini:

```sh
python3 qa/qa_credit_r5.py
```

Exit 0 = semua PASS.

Riwayat: dipindah ke repo 2026-11-08 dari `~/workspace/kelontong-review/qa_credit_r5.py`
(keputusan Septian: guard WAJIB berversi sebagai backup).
