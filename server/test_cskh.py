import sys
import os

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'app')))
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.modules.cskh.services.cskh_service import CSKHService

svc = CSKHService()

test_phones = ["0973204349", "973204349", "0868699652", "868699652", "+84928968329", "0354536531"]

print("=== TEST TIM KIEM KHACH HANG THEO SDT ===")
for p in test_phones:
    cust = svc.find_customer_by_phone(p)
    if cust:
        print(f"\nTim thay SDT {p}:")
        print(svc.get_customer_context(cust))
    else:
        print(f"\nKHONG tim thay SDT {p}")

print("\n=== TEST TRICH XUAT SDT TU TIN NHAN ===")
msg = "Cho toi kiem tra thong tin cua SDT 0973-204-349 va so 868.699.652 nhe"
phones = svc.extract_phones_from_message(msg)
print(f"Tin nhan: {msg}")
print(f"SDT trich xuat: {phones}")
for p in phones:
    cust = svc.find_customer_by_phone(p)
    if cust:
        print(f"-> Tim thay {p}: {cust.ten_khach_hang}")
