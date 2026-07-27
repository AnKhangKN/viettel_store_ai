from dataclasses import dataclass
from typing import Optional

@dataclass
class CustomerInfo:
    so_dien_thoai: str
    ten_khach_hang: str
    dia_chi: str
    tuoi: Optional[int] = None
    tieu_dung_binh_quan_3t: Optional[int] = None
    ma_xa: Optional[str] = None
    ma_thue_bao: Optional[str] = None
    home_tram: Optional[str] = None
    ap: Optional[str] = None
    tram_goc: Optional[str] = None
