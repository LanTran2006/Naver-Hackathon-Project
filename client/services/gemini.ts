const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models'; // Định nghĩa URL gốc cho Gemini REST.
const DEFAULT_MODEL = 'gemini-2.5-flash'; // Mặc định dùng model 2.5 flash mới nhất cho tốc độ cao.
const REQUEST_TIMEOUT_MS = 20000; // Timeout chuẩn để tránh treo UI.
const APYHUB_SUMMARIZE_URL = 'https://api.apyhub.com/ai/summarize-text'; // Endpoint ApyHub cho summarize hội thoại.
const DEFAULT_SUMMARY_LENGTH = 'medium'; // Độ dài tóm tắt mặc định ApyHub.

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
    const apiKey =
        import.meta.env.VITE_APYHUB_API_KEY ||
        import.meta.env.APYHUB_API_KEY ||
        (typeof __APP_APYHUB_API_KEY__ !== 'undefined' ? __APP_APYHUB_API_KEY__ : ''); // Đọc API key từ env/hằng build.
    if (!apiKey) {
        throw new Error('Thiếu cấu hình APYHUB_API_KEY/VITE_APYHUB_API_KEY.'); // Bắt lỗi thiếu key ApyHub.
    }

    const normalizedConversation = conversation.trim(); // Chuẩn hoá hội thoại trước khi gửi.
    if (!normalizedConversation) {
        throw new Error('Không có nội dung hội thoại để tóm tắt.'); // Không gửi khi không có dữ liệu.
    }

    const controller = new AbortController(); // Chuẩn bị abort cho timeout.
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS); // Tận dụng timeout chung.

    try {
        const response = await fetch(APYHUB_SUMMARIZE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apy-token': apiKey
            },
            body: JSON.stringify({
                text: normalizedConversation,
                summary_length: DEFAULT_SUMMARY_LENGTH,
                output_language: 'vi'
            }),
            signal: controller.signal
        }); // Gọi API ApyHub với text tiếng Việt.

        if (!response.ok) {
            const errorText = await response.text(); // Lấy chi tiết lỗi để hiển thị.
            throw new Error(
                `ApyHub trả lỗi ${response.status}: ${errorText || response.statusText}`
            );
        }

        const data = await response.json(); // Parse JSON trả về.
        const summary =
            data?.data?.summary ??
            data?.summary ??
            data?.result ??
            ''; // ApyHub có thể bọc summary ở nhiều cấp khác nhau.

        if (!summary) {
            throw new Error('ApyHub không trả summary hợp lệ.'); // Đảm bảo có nội dung.
        }

        return String(summary)
            .replace(/\n{3,}/g, '\n\n')
            .trim(); // Trả về văn bản thuần đã chuẩn hoá.
    } catch (error) {
        if ((error as Error).name === 'AbortError') {
            throw new Error('Yêu cầu ApyHub quá thời gian cho phép.'); // Xử lý timeout cụ thể.
        }
        throw error; // Đẩy lỗi khác lên UI xử lý.
    } finally {
        clearTimeout(timeout); // Dọn timeout.
    }
}

/**
 * Ghép các từ rời rạc thành câu hoàn chỉnh có nghĩa.
 */
export async function buildSentenceFromWords(words: string[]): Promise<string> {
    if (words.length === 0) {
        throw new Error('Không có từ nào để ghép thành câu.');
    }

    const wordsList = words.join(', ');
    const prompt = [
        'Bạn là trợ lý ngôn ngữ tiếng Việt.',
        'Nhiệm vụ: Ghép các từ rời rạc sau thành một câu hoàn chỉnh, tự nhiên, có nghĩa.',
        'Yêu cầu:',
        '- Câu phải ngữ pháp đúng, có dấu câu',
        '- Thêm từ nối nếu cần để câu tự nhiên',
        '- Giữ nguyên ý nghĩa của các từ',
        '- Trả về ONLY câu hoàn chỉnh, không giải thích',
        '',
        `Các từ: ${wordsList}`
    ].join('\n');

    const response = await callGemini(DEFAULT_MODEL, prompt);
    return response.trim();
}