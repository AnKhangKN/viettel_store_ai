from google import genai
from app.core.config import config

# Khởi tạo Client linh hoạt dựa trên cấu hình môi trường (.env)
# Ưu tiên sử dụng GEMINI_API_KEY để tránh yêu cầu xác thực ADC khi phát triển local
if config.GEMINI_API_KEY:
    client = genai.Client(api_key=config.GEMINI_API_KEY)
elif config.GEMINI_PROJECT_ID and config.GEMINI_LOCATION:
    client = genai.Client(
        enterprise=True, 
        project=config.GEMINI_PROJECT_ID, 
        location=config.GEMINI_LOCATION
    )
else:
    raise ValueError("GEMINI_API_KEY hoặc GEMINI_PROJECT_ID/GEMINI_LOCATION chưa được cấu hình trong file .env")


def ask_ai(context: str, question: str):
    prompt = f"""
Bạn là trợ lý Viettel Store.

Thông tin hệ thống:

{context}

Khách hàng hỏi:

{question}

Chỉ trả lời dựa trên dữ liệu được cung cấp.
"""

    # Xác định model từ GEMINI_AI_MODEL, mặc định dùng gemini-1.5-flash
    model_name = config.GEMINI_AI_MODEL or "gemini-1.5-flash"
    
    # Sử dụng cú pháp SDK mới (google-genai) để generate content
    response = client.models.generate_content(
        model=model_name,
        contents=prompt
    )
    
    response_text = getattr(response, "text", None)
    if not response_text:
        raise ValueError("Gemini không trả về nội dung phản hồi hợp lệ.")
        
    return response_text
