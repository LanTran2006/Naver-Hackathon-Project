/// <reference types="vite/client" />

declare const __APP_GEMINI_API_KEY__: string | undefined; // Hằng build-time cho Gemini.
declare const __APP_APYHUB_API_KEY__: string | undefined; // Hằng build-time cho ApyHub.

type SpeechRecognitionConstructor = new () => SpeechRecognition; // Constructor chuẩn.

interface SpeechRecognition extends EventTarget { // Interface tối giản để tránh lỗi TS.
    lang: string; // Ngôn ngữ nhận dạng.
    interimResults: boolean; // Nhận kết quả tạm thời.
    continuous: boolean; // Chạy liên tục hay không.
    maxAlternatives: number; // Số lựa chọn trả về.
    start: () => void; // Bắt đầu nghe.
    stop: () => void; // Dừng nghe.
    abort: () => void; // Huỷ ngay.
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null; // Sự kiện audio end.
    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null; // Audio start.
    onend: ((this: SpeechRecognition, ev: Event) => any) | null; // Kết thúc.
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null; // Lỗi.
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null; // Kết quả.
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null; // Bắt đầu.
} // Kết thúc interface.

interface SpeechRecognitionResultList { // Danh sách kết quả.
    length: number; // Độ dài.
    item(index: number): SpeechRecognitionResult; // Lấy phần tử.
    [index: number]: SpeechRecognitionResult; // Index signature.
}

interface SpeechRecognitionResult { // Kết quả đơn lẻ.
    readonly length: number; // Số lựa chọn.
    readonly isFinal: boolean; // Đã hoàn tất hay chưa.
    item(index: number): SpeechRecognitionAlternative; // Lấy lựa chọn.
    [index: number]: SpeechRecognitionAlternative; // Index signature.
}

interface SpeechRecognitionAlternative { // Một phương án transcript.
    transcript: string; // Văn bản.
    confidence: number; // Độ tin cậy.
}

interface SpeechRecognitionEvent extends Event { // Sự kiện kết quả.
    readonly results: SpeechRecognitionResultList; // Danh sách kết quả.
}

interface SpeechRecognitionErrorEvent extends Event { // Sự kiện lỗi.
    error?: string; // Mã lỗi.
    message?: string; // Thông tin thêm.
}

interface Window { // Mở rộng đối tượng Window.
    SpeechRecognition?: SpeechRecognitionConstructor; // API chuẩn.
    webkitSpeechRecognition?: SpeechRecognitionConstructor; // API prefixed.
}
