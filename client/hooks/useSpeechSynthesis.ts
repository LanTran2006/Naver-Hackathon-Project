import { useCallback, useEffect, useMemo, useRef, useState } from 'react'; // Nhập hook React quản lý lifecycle.

interface SpeechSynthesisOptions { // Khai báo tuỳ chọn điều chỉnh giọng đọc.
    lang?: string; // Ngôn ngữ mong muốn, mặc định tiếng Việt.
    rate?: number; // Tốc độ đọc.
    pitch?: number; // Cao độ đọc.
    volume?: number; // Âm lượng đọc.
} // Kết thúc interface tuỳ chọn.

interface SpeechSynthesisHook { // Interface trả về từ hook.
    isSupported: boolean; // Cho biết trình duyệt có hỗ trợ không.
    voices: SpeechSynthesisVoice[]; // Danh sách giọng đọc khả dụng.
    currentVoice: SpeechSynthesisVoice | null; // Giọng đang dùng.
    setCurrentVoice: (voice: SpeechSynthesisVoice | null) => void; // Hàm đổi giọng đọc.
    speak: (text: string, onFinish?: () => void) => void; // Hàm đọc nội dung.
    stop: () => void; // Hàm dừng đọc.
    isSpeaking: boolean; // Trạng thái đang đọc.
} // Kết thúc interface hook.

const DEFAULT_OPTIONS: Required<Omit<SpeechSynthesisOptions, 'lang'>> = { // Thiết lập mặc định cho rate/pitch/volume.
    rate: 1, // Tốc độ bình thường.
    pitch: 1, // Cao độ trung tính.
    volume: 1 // Âm lượng tối đa an toàn.
}; // Kết thúc hằng số.

export function useSpeechSynthesis(options: SpeechSynthesisOptions = {}): SpeechSynthesisHook { // Định nghĩa hook chính.
    const isSupported = useMemo( // Tính toán một lần khả năng hỗ trợ.
        () => typeof window !== 'undefined' && 'speechSynthesis' in window, // Điều kiện kiểm tra API.
        [] // Không phụ thuộc state khác.
    ); // Kết thúc useMemo.

    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]); // Lưu danh sách giọng đọc.
    const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null); // Lưu giọng hiện tại.
    const [isSpeaking, setIsSpeaking] = useState(false); // Flag đang đọc.
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null); // Giữ tham chiếu utterance hiện tại để quản lý cleanup.

    const stop = useCallback(() => { // Định nghĩa hàm dừng đọc.
        if (!isSupported) { // Nếu không hỗ trợ thì bỏ qua.
            return; // Không làm gì thêm.
        } // Hết kiểm tra hỗ trợ.
        window.speechSynthesis.cancel(); // Hủy mọi câu đang đọc.
        utteranceRef.current = null; // Xoá reference hiện tại.
        setIsSpeaking(false); // Cập nhật trạng thái.
    }, [isSupported]); // Hook phụ thuộc vào isSupported.

    useEffect(() => { // Lắng nghe sự kiện voiceschanged để cập nhật danh sách.
        if (!isSupported) { // Nếu không hỗ trợ thì thoát sớm.
            return; // Không đăng ký sự kiện.
        } // Hết kiểm tra hỗ trợ.

        const updateVoices = () => { // Hàm cập nhật danh sách giọng.
            const list = window.speechSynthesis.getVoices(); // Lấy giọng từ API.
            setVoices(list); // Lưu vào state.
            if (!list.length) { // Nếu chưa có giọng nào thì không chọn mặc định.
                return; // Kết thúc hàm.
            } // Hết kiểm tra rỗng.
            setCurrentVoice((prev) => { // Cập nhật giọng hiện tại.
                if (prev) { // Nếu người dùng đã chọn thì giữ nguyên.
                    return prev; // Giữ giọng cũ.
                } // Hết kiểm tra prev.
                const viVoice = list.find((voice) => voice.lang.startsWith('vi')); // Ưu tiên giọng tiếng Việt.
                return viVoice ?? list[0]; // Nếu không có tiếng Việt chọn giọng đầu tiên.
            }); // Kết thúc setCurrentVoice.
        }; // Kết thúc hàm updateVoices.

        updateVoices(); // Gọi ngay để lấy giọng khi hook mount.
        window.speechSynthesis.addEventListener('voiceschanged', updateVoices); // Đăng ký listener.
        return () => window.speechSynthesis.removeEventListener('voiceschanged', updateVoices); // Dọn listener khi unmount.
    }, [isSupported]); // Effect phụ thuộc trạng thái hỗ trợ.

    const speak = useCallback( // Định nghĩa hàm đọc văn bản.
        (text: string, onFinish?: () => void) => { // Tham số gồm nội dung và callback hoàn tất.
            if (!isSupported || !text.trim()) { // Nếu không hỗ trợ hoặc text rỗng thì bỏ qua.
                return; // Không đọc gì.
            } // Hết kiểm tra điều kiện.

            stop(); // Huỷ bất kỳ câu đang đọc để tránh chồng âm.
            const utterance = new SpeechSynthesisUtterance(text); // Tạo câu đọc mới.
            utterance.lang = options.lang ?? 'vi-VN'; // Thiết lập ngôn ngữ mong muốn.
            utterance.rate = options.rate ?? DEFAULT_OPTIONS.rate; // Áp dụng tốc độ.
            utterance.pitch = options.pitch ?? DEFAULT_OPTIONS.pitch; // Áp dụng cao độ.
            utterance.volume = options.volume ?? DEFAULT_OPTIONS.volume; // Áp dụng âm lượng.
            if (currentVoice) { // Nếu có giọng được chọn.
                utterance.voice = currentVoice; // Gán vào utterance.
            } // Hết kiểm tra currentVoice.
            utterance.onend = () => { // Khi đọc xong.
                setIsSpeaking(false); // Đánh dấu ngừng đọc.
                utteranceRef.current = null; // Reset reference.
                onFinish?.(); // Gọi callback nếu có.
            }; // Hết handler onend.
            utterance.onerror = () => { // Khi phát sinh lỗi.
                setIsSpeaking(false); // Cập nhật trạng thái.
                utteranceRef.current = null; // Reset reference.
                onFinish?.(); // Gọi callback để UI biết đã kết thúc.
            }; // Hết handler onerror.
            utteranceRef.current = utterance; // Lưu reference phục vụ stop thủ công.
            window.speechSynthesis.speak(utterance); // Bắt đầu đọc.
            setIsSpeaking(true); // Đặt trạng thái đang đọc.
        }, // Kết thúc thân hàm.
        [currentVoice, isSupported, options.lang, options.pitch, options.rate, options.volume, stop] // Phụ thuộc các tham số.
    ); // Kết thúc useCallback.

    useEffect(() => stop, [stop]); // Đảm bảo dọn đọc khi component unmount.

    return { // Trả ra API của hook.
        isSupported, // Cờ hỗ trợ.
        voices, // Danh sách giọng.
        currentVoice, // Giọng hiện tại.
        setCurrentVoice, // Hàm đổi giọng.
        speak, // Hàm đọc.
        stop, // Hàm dừng.
        isSpeaking // Trạng thái đang đọc.
    }; // Kết thúc object return.
} // Kết thúc hook.

