import { useCallback, useEffect, useMemo, useRef, useState } from 'react'; // Nhập hook React để quản lý SpeechRecognition.

interface SpeechRecognitionOptions { // Tuỳ chọn cấu hình hook.
    lang?: string; // Ngôn ngữ nhận dạng, mặc định tiếng Việt.
    interimResults?: boolean; // Có lấy kết quả tạm thời hay không.
} // Kết thúc interface tuỳ chọn.

interface SpeechRecognitionHook { // Kiểu dữ liệu trả về từ hook.
    isSupported: boolean; // Trạng thái hỗ trợ trình duyệt.
    isListening: boolean; // Đang thu âm hay không.
    transcript: string; // Văn bản phiên âm cuối cùng.
    error: string | null; // Lỗi cuối cùng.
    start: () => void; // Hàm bắt đầu nghe.
    stop: () => void; // Hàm dừng nghe.
    resetError: () => void; // Hàm xóa lỗi thủ công.
} // Kết thúc interface hook.

type RecognitionConstructor = new () => SpeechRecognitionInstance; // Định nghĩa type constructor tạm cho webkit/standard.

interface SpeechRecognitionInstance { // Interface tối giản bao quanh Recognition thực tế.
    lang: string; // Thuộc tính ngôn ngữ.
    interimResults: boolean; // Bật/tắt kết quả tạm.
    continuous: boolean; // Ghi âm liên tục hay không.
    maxAlternatives: number; // Số phương án trả về.
    start: () => void; // API bắt đầu.
    stop: () => void; // API dừng.
    abort: () => void; // API huỷ.
    onaudioend: ((event: Event) => void) | null; // Callback audio end.
    onaudiostart: ((event: Event) => void) | null; // Callback audio start.
    onend: ((event: Event) => void) | null; // Callback chung khi kết thúc.
    onerror: ((event: SpeechRecognitionErrorEvent | Event) => void) | null; // Callback lỗi.
    onresult: ((event: SpeechRecognitionEvent) => void) | null; // Callback kết quả.
    onstart: ((event: Event) => void) | null; // Callback bắt đầu.
} // Kết thúc interface instance.

export function useSpeechRecognition(options: SpeechRecognitionOptions = {}): SpeechRecognitionHook { // Định nghĩa hook chính.
    const isSupported = useMemo( // Tính toán khả năng hỗ trợ một lần.
        () =>
            typeof window !== 'undefined' && // Đảm bảo chạy trên browser.
            (Boolean((window as WindowWithSpeech).SpeechRecognition) || Boolean((window as WindowWithSpeech).webkitSpeechRecognition)), // Kiểm tra 2 biến thể API.
        [] // Không phụ thuộc state khác.
    ); // Kết thúc useMemo.

    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null); // Lưu instance Recognition.
    const [isListening, setIsListening] = useState(false); // Quản lý trạng thái ghi âm.
    const [transcript, setTranscript] = useState(''); // Văn bản nhận dạng.
    const [error, setError] = useState<string | null>(null); // Lỗi hiển thị.

    useEffect(() => { // Khởi tạo Recognition khi hook mount.
        if (!isSupported) { // Nếu không hỗ trợ thì không làm gì.
            return; // Thoát effect.
        } // Hết kiểm tra hỗ trợ.

        const ctor: RecognitionConstructor | undefined =
            (window as WindowWithSpeech).SpeechRecognition ||
            (window as WindowWithSpeech).webkitSpeechRecognition; // Lấy constructor theo trình duyệt.
        if (!ctor) { // Nếu vẫn không có thì thoát.
            return; // Không khởi tạo.
        } // Hết kiểm tra ctor.

        const recognition = new ctor(); // Tạo instance mới.
        recognition.lang = options.lang ?? 'vi-VN'; // Đặt ngôn ngữ.
        recognition.interimResults = options.interimResults ?? false; // Thiết lập trả kết quả tạm.
        recognition.continuous = false; // Chỉ nhận một câu mỗi lần để dễ xử lý.
        recognition.maxAlternatives = 1; // Lấy phương án chính xác nhất.

        recognition.onstart = () => { // Khi bắt đầu.
            setIsListening(true); // Cập nhật trạng thái.
            setError(null); // Xoá lỗi cũ.
            setTranscript(''); // Reset transcript để không hiển thị dữ liệu cũ.
        }; // Kết thúc handler.

        recognition.onresult = (event: SpeechRecognitionEvent) => { // Nhận kết quả.
            const result = event.results?.[event.results.length - 1]; // Lấy kết quả mới nhất.
            const text = result?.[0]?.transcript ?? ''; // Lấy transcript đầu tiên.
            setTranscript(text.trim()); // Lưu văn bản đã trim.
        }; // Hết handler result.

        recognition.onerror = (event: SpeechRecognitionErrorEvent | Event) => { // Khi có lỗi.
            const err = (event as SpeechRecognitionErrorEvent).error ?? 'unknown-error'; // Lấy mã lỗi.
            setError(
                err === 'not-allowed'
                    ? 'Bạn đã chặn quyền micro. Hãy cấp quyền để tiếp tục.'
                    : 'Không thể nhận dạng giọng nói. Vui lòng thử lại.'
            ); // Ghi thông báo thân thiện.
            setIsListening(false); // Cập nhật trạng thái.
        }; // Kết thúc handler error.

        recognition.onend = () => { // Khi kết thúc (dù thành công hay không).
            setIsListening(false); // Đánh dấu dừng nghe.
        }; // Kết thúc handler onend.

        recognitionRef.current = recognition; // Lưu instance để các hàm start/stop dùng.

        return () => { // Cleanup khi unmount hoặc options đổi.
            recognition.onstart = null; // Xoá handler.
            recognition.onresult = null; // Xoá handler.
            recognition.onerror = null; // Xoá handler.
            recognition.onend = null; // Xoá handler.
            recognition.stop(); // Dừng nếu đang chạy.
            recognitionRef.current = null; // Reset ref.
        }; // Kết thúc cleanup.
    }, [isSupported, options.interimResults, options.lang]); // Effect chạy lại khi ngôn ngữ/option thay đổi.

    const start = useCallback(() => { // Hàm bắt đầu nghe.
        if (!isSupported || !recognitionRef.current) { // Không hỗ trợ thì bỏ qua.
            setError('Trình duyệt không hỗ trợ Voice Input.'); // Báo lỗi hữu ích.
            return; // Không thực thi tiếp.
        } // Hết kiểm tra hỗ trợ.
        try { // Bắt lỗi start.
            recognitionRef.current.start(); // Gọi API start.
        } catch (err) { // Nếu có exception.
            setError('Không thể bật micro lúc này.'); // Ghi lỗi.
            setIsListening(false); // Reset trạng thái.
        } // Kết thúc try/catch.
    }, [isSupported]); // Phụ thuộc cờ hỗ trợ.

    const stop = useCallback(() => { // Hàm dừng nghe.
        if (!isSupported || !recognitionRef.current) { // Nếu không hỗ trợ thì thoát.
            return; // Không làm gì.
        } // Hết kiểm tra hỗ trợ.
        recognitionRef.current.stop(); // Gọi API stop.
    }, [isSupported]); // Phụ thuộc cờ hỗ trợ.

    useEffect(() => stop, [stop]); // Dừng ghi âm khi component unmount tự động.

    const resetError = useCallback(() => setError(null), []); // Hàm xoá lỗi.

    return { // Trả API của hook.
        isSupported, // Trình duyệt hỗ trợ hay không.
        isListening, // Đang nghe hay không.
        transcript, // Văn bản mới nhất.
        error, // Lỗi thân thiện.
        start, // Hàm bắt đầu nghe.
        stop, // Hàm dừng.
        resetError // Hàm reset lỗi.
    }; // Kết thúc object return.
} // Kết thúc hook.

interface WindowWithSpeech extends Window { // Mở rộng interface Window để tránh lỗi TypeScript.
    SpeechRecognition?: RecognitionConstructor; // Thuộc tính chuẩn.
    webkitSpeechRecognition?: RecognitionConstructor; // Thuộc tính prefixed.
} // Kết thúc interface mở rộng.

