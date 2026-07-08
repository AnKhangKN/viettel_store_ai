from openai import OpenAI

from core.config import config

client = OpenAI(
    api_key=config.OPENAI_API_KEY
)


def ask_ai(context: str, question: str):

    prompt = f"""
Bạn là trợ lý Viettel Store.

Thông tin hệ thống:

{context}

Khách hàng hỏi:

{question}

Chỉ trả lời dựa trên dữ liệu được cung cấp.
"""

    response = client.chat.completions.create(
        model=config.AI_MODEL,
        messages=[
            {
                "role": "system",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content