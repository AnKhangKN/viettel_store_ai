import axios from "axios";

/**
 * Gửi tin nhắn đến chatbot AI
 * @param {string} message - Tin nhắn hiện tại của user
 * @param {Array} history - Lịch sử chat [{role: 'user'|'model', parts: '...'}]
 */
export const sendChatbotMessage = async (message, history = []) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/chatbot`,
            {
                message,
                history
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gửi tin nhắn cho chatbot AI:", error);
        throw error;
    }
};
