const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models'; // Định nghĩa URL gốc cho Gemini REST.
const DEFAULT_MODEL = 'gemini-2.5-flash'; // Mặc định dùng model 2.5 flash mới nhất cho tốc độ cao.
const REQUEST_TIMEOUT_MS = 20000; // Timeout chuẩn để tránh treo UI.

/**
 * Gọi Gemini REST với kiểm soát timeout và schema JSON tùy chọn.
 */
export async function callGemini(
    model: string,
    prompt: string,
    responseSchema?: unknown
): Promise<string> {
    const apiKey =
        import.meta.env.VITE_GEMINI_API_KEY ||
        import.meta.env.GEMINI_API_KEY ||
        (typeof __APP_GEMINI_API_KEY__ !== 'undefined' ? __APP_GEMINI_API_KEY__ : ''); // Đọc khóa từ env Vite hoặc hằng define.
    if (!apiKey) {
        throw new Error('Thiếu cấu hình GEMINI_API_KEY/VITE_GEMINI_API_KEY.'); // Bắt lỗi thiếu key.
    }

    const controller = new AbortController(); // Điều khiển abort cho timeout.
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS); // Thiết lập timeout.

    try {
        const response = await fetch(
            `${GEMINI_API_URL}/${model}:generateContent`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: prompt }]
                        }
                    ],
                    generationConfig: responseSchema
                        ? {
                              responseMimeType: 'application/json',
                              responseSchema
                          }
                        : undefined
                }),
                signal: controller.signal
            }
        );

        if (!response.ok) {
            const errorText = await response.text(); // Thu thập nội dung lỗi chi tiết.
            throw new Error(
                `Gemini trả lỗi ${response.status}: ${errorText || response.statusText}`
            );
        }

        const data = await response.json(); // Parse JSON phản hồi.
        const text =
            data?.candidates?.[0]?.content?.parts
                ?.map((part: { text?: string }) => part.text ?? '')
                .join('')
                .trim() ?? ''; // Gom phần text lại.

        if (!text) {
            throw new Error('Gemini không trả nội dung văn bản.'); // Đảm bảo có text.
        }

        return text;
    } catch (error) {
        if ((error as Error).name === 'AbortError') {
            throw new Error('Yêu cầu Gemini quá thời gian cho phép.'); // Xử lý timeout.
        }
        throw error; // Ném tiếp lỗi khác.
    } finally {
        clearTimeout(timeout); // Dọn timeout.
    }
}

/**
 * Chuẩn hoá câu nhập của người dùng bằng prompt yêu cầu JSON message.
 */
export async function normalizeUserPrompt(rawText: string): Promise<string> {
    const prompt = [
        'Bạn là trợ lý tái diễn đạt câu người dùng bằng tiếng Việt tự nhiên.',
        'Trả về JSON đúng chuẩn {"message": "..."} duy nhất, không thêm ký tự thừa.',
        'Message phải lịch sự, đầy đủ chủ-vị, vẫn giữ ý chính của người dùng.',
        `Nội dung người dùng: """${rawText.trim()}"""`
    ].join('\n\n'); // Prompt rõ ràng gồm hướng dẫn và input.

    const response = await callGemini(DEFAULT_MODEL, prompt, {
        type: 'object',
        properties: {
            message: {
                type: 'string',
                description: 'Câu đã chuẩn hoá, tối đa ~60 ký tự, không ký tự escape.'
            }
        },
        required: ['message']
    }); // Yêu cầu Gemini tuân thủ schema JSON.

    let parsed: { message?: string }; // Chuẩn bị biến parse JSON.
    try {
        parsed = JSON.parse(response); // Parse kết quả JSON.
    } catch (error) {
        throw new Error('Gemini trả về dữ liệu không phải JSON hợp lệ.'); // Báo lỗi parse.
    }

    const message = parsed.message?.trim(); // Lấy message.
    if (!message) {
        throw new Error('Gemini không trả về trường message hợp lệ.'); // Kiểm tra rỗng.
    }
    return message; // Trả câu chuẩn hoá.
}

/**
 * Tóm tắt toàn bộ hội thoại, trả markdown thân thiện.
 */
export async function summarizeConversation(conversation: string): Promise<string> {
    const prompt = [
        'Bạn là chuyên gia tổng kết cuộc hội thoại giữa Người dùng và AI.', // Đặt vai trò.
        'Tạo JSON {"summary": "..."}:', // Chỉ rõ cấu trúc trả về.
        '- summary là đoạn văn thuần văn bản, tối đa 3 câu, không dùng Markdown, không ký tự *, _, # hoặc đầu dòng bullet.', // Ràng buộc định dạng.
        '- Giữ giọng điệu trung lập, tiếng Việt tự nhiên.', // Yêu cầu phong cách.
        `Hội thoại đầy đủ:\n"""${conversation.trim()}"""` // Chèn ngữ cảnh hội thoại.
    ].join('\n'); // Prompt hướng dẫn rõ ràng, cấm ký tự định dạng.

    const response = await callGemini(DEFAULT_MODEL, prompt, {
        type: 'object',
        properties: {
            summary: {
                type: 'string',
                description: 'Đoạn Markdown mô tả nội dung chính và bước tiếp theo.'
            }
        },
        required: ['summary']
    }); // Gửi schema JSON summary.

    let parsed: { summary?: string }; // Biến parse.
    try {
        parsed = JSON.parse(response); // Parse JSON.
    } catch (error) {
        throw new Error('Gemini trả về dữ liệu tóm tắt không phải JSON hợp lệ.'); // Báo lỗi parse.
    }

    const summary = parsed.summary?.trim(); // Lấy summary gốc.
    if (!summary) {
        throw new Error('Gemini không trả summary hợp lệ.'); // Kiểm tra rỗng.
    }
    const sanitizedSummary = summary
        .replace(/\*\*/g, '') // Bỏ toàn bộ ** đậm.
        .replace(/^\s*[\*\-]\s*/gm, '') // Xoá bullet bắt đầu bằng * hoặc -.
        .replace(/[_#]/g, '') // Loại ký tự Markdown còn lại như _ hoặc #.
        .replace(/\n{3,}/g, '\n\n') // Chuẩn hoá xuống dòng liên tiếp.
        .trim(); // Cắt khoảng trắng dư.
    return sanitizedSummary; // Trả văn bản sạch.
}

