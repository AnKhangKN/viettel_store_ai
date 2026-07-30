import asyncio
import os
import socket
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import httpx

from app.core.config import Config


import ssl

def _send_smtp_email_sync(msg: MIMEMultipart, recipients: list[str]):
    """
    Gửi SMTP Email Gmail chính chủ không cần Domain name:
    - Giải mã trực tiếp IP IPv4 để không bị rớt mạng do IPv6.
    - Gửi được cho BẤT KỲ địa chỉ Email nhận nào.
    """
    server_host = Config.SMTP_SERVER or "smtp.gmail.com"
    server_port = Config.SMTP_PORT or 465
    username = Config.SMTP_USERNAME
    password = Config.SMTP_PASSWORD
    timeout = Config.SMTP_TIMEOUT or 10

    if not server_host or not username or not password:
        raise RuntimeError("SMTP username/password is not configured")

    # 1. Thử cổng SSL 465 trực tiếp
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(host=server_host, port=465, timeout=timeout, context=context) as server:
            server.login(username, password)
            server.sendmail(msg["From"], recipients, msg.as_string())
            return
    except Exception as e_ssl:
        print(f"⚠️ [SMTP SSL 465 TIMEOUT/FAIL] Thử kết nối cổng 587: {str(e_ssl)}")

    # 2. Thử cổng STARTTLS 587 làm phương án dự phòng
    server = smtplib.SMTP(server_host, 587, timeout=timeout)
    server.ehlo()
    server.starttls()
    server.ehlo()
    server.login(username, password)
    server.sendmail(msg["From"], recipients, msg.as_string())
    server.quit()


def _send_resend_email_sync(subject: str, html_content: str, recipients: list[str]) -> None:
    """
    Gửi email qua Resend REST API (HTTPS port 443).
    Dùng cho Render free tier vì Render chặn outbound SMTP cổng 25/465/587.
    """
    api_key = Config.RESEND_API_KEY
    from_email = Config.RESEND_FROM_EMAIL or Config.SMTP_FROM_EMAIL
    email_mode = Config.EMAIL_DELIVERY_MODE

    if email_mode != "resend":
        raise RuntimeError(f"Email delivery mode '{email_mode}' bypasses Resend API")

    if not api_key or not from_email:
        raise RuntimeError("Resend is not configured (RESEND_API_KEY / RESEND_FROM_EMAIL)")

    success_count = 0
    for target in recipients:
        try:
            response = httpx.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": from_email,
                    "to": [target],
                    "subject": subject,
                    "html": html_content,
                },
                timeout=Config.SMTP_TIMEOUT,
            )
            if response.status_code < 400:
                success_count += 1
                print(f"✅ [RESEND SUCCESS] Đã gửi email tới: {target}")
            else:
                print(f"⚠️ [RESEND NOTICE] {target}: {response.text}")
                if response.status_code == 403 and "your own email address" in response.text:
                    print(f"💡 [RESEND TIP] 'onboarding@resend.dev' chỉ gửi được cho mail đăng ký 'pkngoccntt2211025@student.ctuet.edu.vn'. Đăng ký tài khoản bằng email này để nhận email thật, hoặc verify domain để gửi cho mọi email.")
        except Exception as e:
            print(f"⚠️ [RESEND FAIL] {target}: {str(e)}")

    if success_count == 0:
        raise RuntimeError(f"Không thể gửi email qua Resend API cho các địa chỉ: {', '.join(recipients)}")


def _send_brevo_email_sync(subject: str, html_content: str, recipients: list[str]) -> None:
    """
    Gửi email qua Brevo (Sendinblue) HTTPS REST API (Cổng 443 - Không cần Domain riêng, không bị Render chặn!).
    Gửi được cho BẤT KỲ ĐỊA CHỈ EMAIL NÀO.
    """
    api_key = Config.BREVO_API_KEY
    sender_email = Config.SMTP_USERNAME or "pkngoccntt2211025@student.ctuet.edu.vn"

    if not api_key:
        raise RuntimeError("BREVO_API_KEY is not configured")

    to_list = [{"email": r.strip()} for r in recipients if r.strip()]
    response = httpx.post(
        "https://api.brevo.com/v3/smtp/email",
        headers={
            "api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        json={
            "sender": {"name": "Viettel Store AI", "email": sender_email},
            "to": to_list,
            "subject": subject,
            "htmlContent": html_content,
        },
        timeout=Config.SMTP_TIMEOUT or 10,
    )
    if response.status_code >= 400:
        raise RuntimeError(f"Brevo API Error {response.status_code}: {response.text}")


async def _deliver_html_email(subject: str, html_content: str, recipients: list[str], log_prefix: str) -> bool:
    email_mode = Config.EMAIL_DELIVERY_MODE

    if email_mode == "log":
        print(f"ℹ️ [{log_prefix}] EMAIL_DELIVERY_MODE=log; bỏ qua gửi email thật, chỉ ghi log.")
        return True

    if email_mode == "brevo" or (Config.BREVO_API_KEY and email_mode != "smtp"):
        def _sync_send_brevo():
            _send_brevo_email_sync(subject, html_content, recipients)

        try:
            await asyncio.to_thread(_sync_send_brevo)
            print(f"✅ [{log_prefix}] Gửi email qua Brevo API thành công tới {', '.join(recipients)}")
            return True
        except Exception as e:
            print(f"⚠️ [{log_prefix}] Brevo API lỗi: {str(e)}")

    if email_mode == "resend":
        if not Config.RESEND_API_KEY or not (Config.RESEND_FROM_EMAIL or Config.SMTP_FROM_EMAIL):
            print(f"⚠️ [{log_prefix}] Thiếu RESEND_API_KEY hoặc RESEND_FROM_EMAIL. Đã log nội dung lên console.")
            return True

        def _sync_send_resend():
            _send_resend_email_sync(subject, html_content, recipients)

        try:
            await asyncio.to_thread(_sync_send_resend)
            print(f"✅ [{log_prefix}] Gửi email qua Resend thành công tới {', '.join(recipients)}")
            return True
        except Exception as e:
            print(f"⚠️ [{log_prefix}] Resend API không khả dụng tới {', '.join(recipients)}: {str(e)}")
            return True

    if not Config.SMTP_USERNAME or not Config.SMTP_PASSWORD or not Config.SMTP_SERVER:
        print(f"⚠️ [{log_prefix}] Thiếu cấu hình SMTP. Đã log nội dung lên console.")
        return True

    def _sync_send_smtp():
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = Config.SMTP_FROM_EMAIL or "Viettel Store <noreply@viettelstore.vn>"
        msg["To"] = ", ".join(recipients)
        msg.attach(MIMEText(html_content, "html", "utf-8"))
        _send_smtp_email_sync(msg, recipients)

    try:
        await asyncio.to_thread(_sync_send_smtp)
        print(f"✅ [{log_prefix}] Gửi email qua SMTP thành công tới {', '.join(recipients)}")
        return True
    except Exception as e:
        print(f"⚠️ [{log_prefix}] SMTP không khả dụng tới {', '.join(recipients)}: {str(e)}")
        print(f"ℹ️ [{log_prefix}] Gợi ý: trên Render free tier hãy đặt EMAIL_DELIVERY_MODE=resend và cấu hình Resend API.")
        return True


async def send_otp_email(to_email: str, otp_code: str, loai_otp: str = "REGISTER") -> bool:
    """
    Gửi email chứa mã OTP xác thực (Đăng ký hoặc Quên mật khẩu) cho khách hàng.
    Nếu bật TEST_SEND_OTP_TO_OWNER=true, hệ thống sẽ gửi thêm 1 bản sao tới mail chủ để test.
    """
    title = "XÁC THỰC TÀI KHOẢN" if loai_otp == "REGISTER" else "KHÔI PHỤC MẬT KHẨU"
    action_text = "đăng ký tài khoản" if loai_otp == "REGISTER" else "khôi phục mật khẩu"
    owner_email = "pkngoccntt2211025@student.ctuet.edu.vn"
    send_to_owner_copy = os.getenv("TEST_SEND_OTP_TO_OWNER", "false").strip().lower() == "true"
    recipients = [to_email]
    if send_to_owner_copy and owner_email not in recipients and Config.EMAIL_DELIVERY_MODE in {"smtp", "log"}:
        recipients.append(owner_email)

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }}
            .header {{ background: linear-gradient(135deg, #EE0033 0%, #A00022 100%); color: #ffffff; padding: 30px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px; }}
            .content {{ padding: 40px 30px; text-align: center; color: #212529; }}
            .otp-box {{ background: #FFF5F5; border: 2px dashed #EE0033; border-radius: 16px; padding: 20px; font-size: 36px; font-weight: 900; color: #EE0033; letter-spacing: 8px; margin: 25px 0; display: inline-block; width: 80%; }}
            .footer {{ background: #f8f9fa; padding: 20px; text-align: center; font-size: 13px; color: #6c757d; border-top: 1px solid #eee; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>VIETTEL STORE AI</h1>
            </div>
            <div class="content">
                <h2 style="color: #212529; font-size: 22px;">{title}</h2>
                <p style="font-size: 15px; color: #666; line-height: 1.6;">
                    Xin chào! Bạn đã yêu cầu <strong>{action_text}</strong> trên ứng dụng <strong>Viettel Store AI</strong>.<br>
                    Dưới đây là mã xác thực OTP của bạn (mã có hiệu lực trong 10 phút):
                </p>

                <div class="otp-box">{otp_code}</div>
                <p style="font-size: 13px; color: #888;">
                    Vì mục đích bảo mật, tuyệt đối KHÔNG chia sẻ mã này cho bất kỳ ai khác.
                </p>
            </div>
            <div class="footer">
                © 2026 Viettel Store. Hotline CSKH: 1800 8098.
            </div>
        </div>
    </body>
    </html>
    """

    # Luôn log mã OTP ra terminal để phục vụ kiểm thử (Log-first debugging)
    print(f"\n==================================================")
    print(f"📧 [EMAIL OTP SENDER] Gửi tới: {to_email}")
    if send_to_owner_copy:
        print(f"📧 [EMAIL OTP SENDER] Gửi thêm bản sao tới mail chủ: {owner_email}")
    print(f"🔑 [MÃ OTP ({loai_otp})]: {otp_code}")
    print(f"==================================================\n")

    subject = f"[{title}] Mã OTP của bạn là {otp_code} - Viettel Store"
    await _deliver_html_email(subject, html_content, recipients, "EMAIL OTP SENDER")
    return True


async def send_invoice_email(to_email: str, order_data: dict) -> bool:
    """
    Tự động gửi Hóa đơn điện tử mua SIM dạng HTML chuẩn Viettel Store đến Email của khách hàng.
    """
    if not to_email or "@" not in to_email:
        print(f"⚠️ [INVOICE EMAIL] Email nhận không hợp lệ: '{to_email}'. Bỏ qua gửi email.")
        return False

    owner_email = "pkngoccntt2211025@student.ctuet.edu.vn"
    send_to_owner_copy = os.getenv("TEST_SEND_OTP_TO_OWNER", "false").strip().lower() == "true"
    recipients = [to_email]
    if send_to_owner_copy and owner_email not in recipients and Config.EMAIL_DELIVERY_MODE in {"smtp", "log"}:
        recipients.append(owner_email)

    id_don_hang = str(order_data.get("id_don_hang", ""))
    so_sim = order_data.get("so_sim", "")
    ten_loai_sim = order_data.get("ten_loai_sim", "SIM Số Đẹp")
    gia_sim_num = float(order_data.get("gia_sim") or 0)
    phi_hoa_mang_num = float(order_data.get("phi_hoa_mang") or 50000)
    tong_tien_num = float(order_data.get("tong_tien") or (gia_sim_num + phi_hoa_mang_num))

    gia_sim_str = f"{gia_sim_num:,.0f}đ".replace(",", ".")
    phi_hoa_mang_str = f"{phi_hoa_mang_num:,.0f}đ".replace(",", ".")
    tong_tien_str = f"{tong_tien_num:,.0f}đ".replace(",", ".")

    kh = order_data.get("khach_hang") or {}
    cn = order_data.get("chi_nhanh") or {}
    tt = order_data.get("thanh_toan") or {}

    ho_ten = kh.get("ho_ten") or "Khách hàng"
    so_dien_thoai = kh.get("so_dien_thoai") or "Chưa cập nhật"
    cccd = kh.get("cccd") or "Chưa cập nhật"

    ten_chi_nhanh = cn.get("ten_chi_nhanh") or "Cửa hàng Viettel Store"
    dia_chi_cn = cn.get("dia_chi") or "Hệ thống cửa hàng Viettel Store"
    hotline_cn = cn.get("hotline") or "1800 8098"

    ptt = "VNPay QR Code Online" if tt.get("phuong_thuc") == "VNPay" else "Thanh toán Tiền mặt tại Quầy Viettel"
    ma_gd = tt.get("ma_giao_dich") or "N/A"
    ngay_dat = order_data.get("ngay_dat_hang") or "Hôm nay"

    html_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px; color: #1e293b; line-height: 1.5; }}
        .card {{ max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }}
        .header {{ background: linear-gradient(135deg, #EE0033 0%, #A00022 100%); color: #ffffff; padding: 24px 28px; display: flex; justify-content: space-between; align-items: center; }}
        .brand {{ font-size: 22px; font-weight: 900; letter-spacing: -0.5px; margin: 0; }}
        .inv-title {{ font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-align: right; opacity: 0.95; margin: 0; }}
        .body-content {{ padding: 28px; }}
        .grid {{ display: table; width: 100%; margin-bottom: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 16px; box-sizing: border-box; }}
        .grid-col {{ display: table-cell; width: 50%; vertical-align: top; padding: 4px 8px; }}
        .sec-title {{ font-size: 11px; font-weight: 800; text-transform: uppercase; color: #EE0033; margin-bottom: 8px; letter-spacing: 0.5px; }}
        .info-p {{ margin: 3px 0; font-size: 13px; color: #334155; }}
        table {{ width: 100%; border-collapse: collapse; margin-bottom: 20px; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; font-size: 13px; }}
        th {{ background: #f1f5f9; padding: 10px 14px; text-align: left; font-weight: 700; color: #334155; border-bottom: 1px solid #e2e8f0; }}
        td {{ padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }}
        .total-row {{ background: #fef2f2; font-weight: 900; color: #EE0033; font-size: 15px; }}
        .footer-box {{ background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 12px; color: #475569; }}
        .badge {{ display: inline-block; background: #d1fae5; color: #065f46; font-weight: 800; font-size: 11px; padding: 4px 12px; border-radius: 20px; border: 1px solid #a7f3d0; margin-top: 6px; }}
        .mail-footer {{ background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }}
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <div>
                <h1 class="brand">⚡ VIETTEL STORE</h1>
                <div style="font-size: 11px; opacity: 0.9; margin-top: 2px;">Tập đoàn Công nghiệp - Viễn thông Quân đội Viettel</div>
            </div>
            <div>
                <div class="inv-title">HÓA ĐƠN ĐIỆN TỬ</div>
                <div style="font-size: 11px; opacity: 0.85; margin-top: 4px; text-align: right;">Mã DH: #{id_don_hang[:8]}</div>
            </div>
        </div>

        <div class="body-content">
            <p style="font-size: 14px; margin-top: 0; margin-bottom: 18px; color: #0f172a;">
                Kính gửi <strong>{ho_ten}</strong>,<br>
                Cảm ơn bạn đã lựa chọn dịch vụ của <strong>Viettel Store</strong>. Dưới đây là thông tin chi tiết Hóa đơn điện tử cho đơn hàng mua SIM của bạn:
            </p>

            <div class="grid">
                <div class="grid-col">
                    <div class="sec-title">👤 Thông tin khách hàng</div>
                    <p class="info-p"><strong>Họ và tên:</strong> {ho_ten}</p>
                    <p class="info-p"><strong>Số điện thoại:</strong> {so_dien_thoai}</p>
                    <p class="info-p"><strong>Số CCCD:</strong> {cccd}</p>
                    <p class="info-p"><strong>Email:</strong> {to_email}</p>
                </div>
                <div class="grid-col">
                    <div class="sec-title">🏬 Địa điểm nhận SIM</div>
                    <p class="info-p"><strong>Cửa hàng:</strong> {ten_chi_nhanh}</p>
                    <p class="info-p"><strong>Địa chỉ:</strong> {dia_chi_cn}</p>
                    <p class="info-p"><strong>Hotline:</strong> {hotline_cn}</p>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Sản phẩm / Dịch vụ</th>
                        <th>Loại SIM</th>
                        <th style="text-align: right;">Đơn giá</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Thẻ SIM Số Đẹp <span style="color:#EE0033;">{so_sim}</span></strong></td>
                        <td>{ten_loai_sim}</td>
                        <td style="text-align: right; font-weight: 700;">{gia_sim_str}</td>
                    </tr>
                    <tr>
                        <td>Phí hòa mạng thuê bao</td>
                        <td>Gói trả trước / trả sau</td>
                        <td style="text-align: right; font-weight: 700;">{phi_hoa_mang_str}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="2">TỔNG CỘNG THANH TOÁN:</td>
                        <td style="text-align: right;">{tong_tien_str}</td>
                    </tr>
                </tfoot>
            </table>

            <div class="footer-box">
                <p style="margin: 2px 0;"><strong>Phương thức thanh toán:</strong> {ptt}</p>
                <p style="margin: 2px 0;"><strong>Trạng thái:</strong> ĐÃ THANH TOÁN HOÀN TẤT</p>
                {f'<p style="margin: 2px 0;"><strong>Mã giao dịch VNPay:</strong> {ma_gd}</p>' if ma_gd != "N/A" else ''}
                <div style="text-align: right;">
                    <span class="badge">✓ ĐÃ XÁC THỰC VIETTEL STORE</span>
                </div>
            </div>
        </div>

        <div class="mail-footer">
            Hóa đơn điện tử được khởi tạo tự động bởi hệ thống Viettel Store AI.<br>
            Hotline CSKH: 1800 8098 (Miễn phí) | Email: cskh@viettel.com.vn
        </div>
    </div>
</body>
</html>"""

    print(f"\n==================================================")
    print(f"📧 [INVOICE EMAIL SENDER] Gửi Hóa đơn Điện tử tới: {to_email}")
    print(f"📄 Đơn hàng: #{id_don_hang} | SIM: {so_sim} | Tổng tiền: {tong_tien_str}")
    print(f"==================================================\n")

    subject = f"[HÓA ĐƠN ĐIỆN TỬ] Xác nhận mua SIM số đẹp {so_sim} - Viettel Store"
    await _deliver_html_email(subject, html_content, recipients, "INVOICE EMAIL")
    return True

