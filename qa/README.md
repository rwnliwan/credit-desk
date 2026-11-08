# QA guards — Credit Desk

| Guard | Yang dicek |
|---|---|
| `qa_credit_r5.py` | Harness verifikasi: rumus DSCR koheren repo-wide, frasa lama yang salah sudah hilang, angka kanonis bertahan, angka baru terhitung ulang independen, sintaks JS valid + struktur kunci Simulator. |

Jalankan dari root repo ini:

```sh
python3 qa/qa_credit_r5.py
```

Exit 0 = semua PASS.

Riwayat: dipindah ke repo 2026-11-08 dari `~/workspace/kelontong-review/qa_credit_r5.py`
(keputusan Septian: guard WAJIB berversi sebagai backup).
