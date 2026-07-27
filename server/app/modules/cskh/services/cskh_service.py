import os
import re
import zipfile
import xml.etree.ElementTree as ET
from typing import Optional, List, Dict, Any
from app.modules.cskh.schemas.cskh_schema import CustomerInfo

class CSKHService:
    _instance = None
    _df: Optional[List[Dict[str, Any]]] = None
    _excel_path: str = ""

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_data()
        return cls._instance

    def _get_excel_path(self) -> str:
        base_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "..", "..", "..")
        )
        candidate = os.path.join(base_dir, "data", "data-cskh.xlsx")
        if os.path.exists(candidate):
            return candidate
        candidate2 = "data/data-cskh.xlsx"
        if os.path.exists(candidate2):
            return os.path.abspath(candidate2)
        return candidate

    def _load_data(self):
        self._excel_path = self._get_excel_path()
        try:
            if os.path.exists(self._excel_path):
                self._df = self._read_xlsx(self._excel_path)
                print(f"[CSKHService] Loaded {len(self._df)} customers from {self._excel_path}")
            else:
                print(f"[CSKHService] Excel file not found: {self._excel_path}")
                self._df = []
        except Exception as e:
            print(f"[CSKHService] Error loading Excel data: {e}")
            self._df = []

    def reload_data(self):
        print("[CSKHService] Reload CSKH data...")
        self._load_data()

    def _read_xlsx(self, file_path: str) -> List[Dict[str, Any]]:
        ns = {
            "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
            "rel": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
            "pkgrel": "http://schemas.openxmlformats.org/package/2006/relationships",
        }

        def col_to_index(col_ref: str) -> int:
            idx = 0
            for ch in col_ref:
                if ch.isalpha():
                    idx = idx * 26 + (ord(ch.upper()) - ord("A") + 1)
            return idx - 1

        def normalize_cell_value(value: Any) -> str:
            if value is None:
                return ""
            text = str(value).strip()
            if not text:
                return ""
            if text.endswith(".0"):
                maybe_int = text[:-2]
                if maybe_int.isdigit():
                    return maybe_int
            return text

        def read_sheet_rows(zf: zipfile.ZipFile, sheet_path: str, shared_strings: List[str]) -> List[Dict[str, Any]]:
            sheet_root = ET.fromstring(zf.read(sheet_path))
            rows: List[Dict[str, Any]] = []
            headers: List[str] = []

            for row in sheet_root.findall(".//main:sheetData/main:row", ns):
                values: Dict[int, str] = {}
                for cell in row.findall("main:c", ns):
                    ref = cell.attrib.get("r", "")
                    col_idx = col_to_index(ref)
                    cell_type = cell.attrib.get("t")
                    raw_value = ""
                    v = cell.find("main:v", ns)

                    if cell_type == "inlineStr":
                        is_node = cell.find("main:is", ns)
                        if is_node is not None:
                            texts = [t.text or "" for t in is_node.findall(".//main:t", ns)]
                            raw_value = "".join(texts)
                    elif v is not None and v.text is not None:
                        raw_value = v.text
                        if cell_type == "s":
                            try:
                                raw_value = shared_strings[int(raw_value)]
                            except Exception:
                                pass

                    values[col_idx] = normalize_cell_value(raw_value)

                if not values:
                    continue

                if not headers:
                    max_col = max(values.keys())
                    headers = [normalize_cell_value(values.get(i, "")) for i in range(max_col + 1)]
                    continue

                row_data: Dict[str, Any] = {}
                for i, header in enumerate(headers):
                    if not header:
                        continue
                    row_data[header] = values.get(i, "")
                if row_data:
                    rows.append(row_data)

            return rows

        with zipfile.ZipFile(file_path, "r") as zf:
            shared_strings: List[str] = []
            if "xl/sharedStrings.xml" in zf.namelist():
                root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
                for si in root.findall("main:si", ns):
                    texts = [t.text or "" for t in si.findall(".//main:t", ns)]
                    shared_strings.append("".join(texts))

            workbook = ET.fromstring(zf.read("xl/workbook.xml"))
            rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))

            sheet_targets = []
            for sheet_elem in workbook.findall(".//main:sheets/main:sheet", ns):
                rel_id = sheet_elem.attrib.get(f"{{{ns['rel']}}}id")
                sheet_name = sheet_elem.attrib.get("name", "")
                target = None
                for rel in rels.findall("pkgrel:Relationship", ns):
                    if rel.attrib.get("Id") == rel_id:
                        target = rel.attrib.get("Target")
                        break
                if target:
                    sheet_targets.append((sheet_name, target))

            if not sheet_targets:
                raise ValueError("Không tìm thấy sheet dữ liệu trong file Excel")

            all_rows: List[Dict[str, Any]] = []
            for _, sheet_target in sheet_targets:
                sheet_path = sheet_target if sheet_target.startswith("xl/") else f"xl/{sheet_target}"
                try:
                    all_rows.extend(read_sheet_rows(zf, sheet_path, shared_strings))
                except Exception as sheet_err:
                    print(f"[CSKHService] Skipping sheet {sheet_path} due to read error: {sheet_err}")

            return all_rows

    def _normalize_phone(self, phone: str) -> str:
        if not phone:
            return ""
        digits = re.sub(r"\D", "", str(phone))
        if digits.startswith("84") and len(digits) > 2:
            digits = "0" + digits[2:]
        if len(digits) == 9 and not digits.startswith("0"):
            digits = "0" + digits
        return digits

    def _safe_int(self, value):
        try:
            if value is None:
                return None
            text = str(value).strip()
            if not text:
                return None
            return int(float(text.replace(",", "")))
        except Exception:
            return None

    def _match_phone(self, df_phone: str, query_phone: str) -> bool:
        if not df_phone or not query_phone:
            return False

        q = self._normalize_phone(query_phone)
        d = self._normalize_phone(df_phone)

        if not q or not d:
            return False

        if q == d:
            return True

        q_no0 = q[1:] if q.startswith("0") else q
        d_no0 = d[1:] if d.startswith("0") else d

        q_last9 = q[-9:] if len(q) >= 9 else q_no0
        d_last9 = d[-9:] if len(d) >= 9 else d_no0
        q_last10 = q[-10:] if len(q) >= 10 else q
        d_last10 = d[-10:] if len(d) >= 10 else d

        candidates = {
            q_no0,
            d_no0,
            q_last9,
            d_last9,
            q_last10,
            d_last10,
        }

        if q_no0 == d_no0:
            return True

        if q_last9 == d_last9:
            return True

        if len(q) >= 9 and len(d) >= 9:
            if q.endswith(d_last9) or d.endswith(q_last9):
                return True

        if len(q) >= 10 and len(d) >= 10:
            if q.endswith(d_last10) or d.endswith(q_last10):
                return True

        # Trường hợp một bên thiếu số 0 đầu hoặc bị cắt còn 9 số
        if q_no0 in candidates and q_no0 == d_last9:
            return True

        if d_no0 in candidates and d_no0 == q_last9:
            return True

        return False

    def find_customer_by_phone(self, phone: str) -> Optional[CustomerInfo]:
        if not self._df:
            return None
        try:
            for row in self._df:
                df_phone = str(row.get("FULL SỐ", "")).strip()
                if self._match_phone(df_phone, phone):
                    return CustomerInfo(
                        so_dien_thoai=self._normalize_phone(df_phone),
                        ten_khach_hang=str(row.get("Tên khách hàng", "")).strip(),
                        dia_chi=str(row.get("Địa chỉ KH theo giấy tờ", "")).strip(),
                        tuoi=self._safe_int(row.get("Tuổi khách hàng")),
                        tieu_dung_binh_quan_3t=self._safe_int(row.get("Tiêu dùng bình quân 3T")),
                        ma_xa=str(row.get("Mã xã", "")).strip() if row.get("Mã xã") not in (None, "") else None,
                        ma_thue_bao=str(row.get("Mã thuê bao", "")).strip() if row.get("Mã thuê bao") not in (None, "") else None,
                        home_tram=str(row.get("Home trạm", "")).strip() if row.get("Home trạm") not in (None, "") else None,
                        ap=str(row.get("Ấp", "")).strip() if row.get("Ấp") not in (None, "") else None,
                        tram_goc=str(row.get("Trạm gốc", "")).strip() if row.get("Trạm gốc") not in (None, "") else None,
                    )
        except Exception as e:
            print(f"[CSKHService] Error finding customer by phone {phone}: {e}")
        return None

    def is_phone_in_cskh_data(self, phone: str) -> bool:
        return self.find_customer_by_phone(phone) is not None

    def extract_phones_from_message(self, message: str) -> List[str]:
        if not message:
            return []
        pattern = r"(?:\+?84[-.\s]?|0)?(?:3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[-.\s]?\d[-.\s]?\d[-.\s]?\d[-.\s]?\d[-.\s]?\d[-.\s]?\d[-.\s]?\d"
        matches = re.findall(pattern, message)
        normalized = []
        for m in matches:
            norm = self._normalize_phone(m)
            if norm and norm not in normalized:
                normalized.append(norm)
        return normalized

    def get_customer_context(self, customer: CustomerInfo) -> str:
        lines = [
            f"=== THÔNG TIN KHÁCH HÀNG CSKH (Tra cứu từ dữ liệu Excel) ===",
            f"- Họ và Tên: {customer.ten_khach_hang}",
            f"- Số điện thoại: {customer.so_dien_thoai}",
        ]
        if customer.tuoi:
            lines.append(f"- Tuổi: {customer.tuoi} tuổi")
        if customer.dia_chi:
            lines.append(f"- Địa chỉ đăng ký: {customer.dia_chi}")
        if customer.ap:
            lines.append(f"- Ấp/Khu vực: {customer.ap}")
        if customer.tieu_dung_binh_quan_3t is not None:
            lines.append(f"- Tiêu dùng trung bình 3 tháng gần nhất: {customer.tieu_dung_binh_quan_3t:,} VNĐ")
        if customer.ma_thue_bao:
            lines.append(f"- Mã thuê bao: {customer.ma_thue_bao}")
        if customer.ma_xa:
            lines.append(f"- Mã xã: {customer.ma_xa}")
        if customer.home_tram:
            lines.append(f"- Home Trạm: {customer.home_tram}")
        if customer.tram_goc:
            lines.append(f"- Trạm gốc: {customer.tram_goc}")
        lines.append("===")
        return "\n".join(lines)
