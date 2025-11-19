import React, { useState } from 'react'; // Nhập React và hook useState để quản lý popover.
import { SparklesIcon } from '../common/Icons'; // Dùng biểu tượng có sẵn cho nút điều khiển.

interface SpeechControlsProps { // Định nghĩa props component.
    isEnabled: boolean; // Trạng thái đang bật tự động đọc.
    isSupported: boolean; // Trình duyệt có hỗ trợ Web Speech hay không.
    isSpeaking: boolean; // Cho biết hệ thống đang đọc hay không.
    onToggle: () => void; // Hàm bật/tắt tính năng.
} // Kết thúc interface props.

const SpeechControls: React.FC<SpeechControlsProps> = ({ isEnabled, isSupported, isSpeaking, onToggle }) => { // Component chính.
    const [isOpen, setIsOpen] = useState(false); // Quản lý popover mở hay đóng.

    const statusLabel = !isSupported // Tạo nhãn trạng thái hiển thị cho người dùng.
        ? 'Không hỗ trợ trên trình duyệt này' // Khi API không khả dụng.
        : isEnabled // Nếu hỗ trợ, kiểm tra đang bật chưa.
            ? isSpeaking // Nếu đang bật, tiếp tục kiểm tra có đang đọc.
                ? 'Đang đọc phản hồi mới' // Đang phát âm thanh.
                : 'Sẵn sàng đọc phản hồi mới' // Đang bật nhưng chưa phát.
            : 'Đang tắt (sẽ không đọc tự động)'; // Khi người dùng tắt.

    const handleToggle = () => { // Bao hàm logic bật/tắt.
        if (!isSupported) { // Nếu không hỗ trợ thì không cho bật.
            return; // Không làm gì.
        } // Kết thúc kiểm tra hỗ trợ.
        onToggle(); // Gọi callback do parent cung cấp.
    }; // Hết hàm handleToggle.

    return ( // JSX của component.
        <div className="relative inline-block text-left"> {/* Bao khối để định vị popover. */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)} // Đảo trạng thái popover khi click.
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
                <SparklesIcon className={`h-4 w-4 ${isEnabled ? 'text-primary' : 'text-gray-500'}`} /> {/* Icon trạng thái. */}
                Giọng đọc AI {/* Nhãn nút. */}
                <span
                    className={`h-2 w-2 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-gray-400'}`}
                    aria-hidden="true"
                /> {/* Dot hiển thị bật/tắt. */}
            </button>

            {isOpen && ( // Chỉ render popover khi mở.
                <div className="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-gray-200 bg-white p-4 text-sm shadow-xl">
                    <p className="font-semibold text-gray-800">Tự động đọc phản hồi</p> {/* Tiêu đề. */}
                    <p className="mt-1 text-gray-600">{statusLabel}</p> {/* Mô tả trạng thái. */}

                    <button
                        type="button"
                        onClick={handleToggle} // Bật/tắt khi click.
                        disabled={!isSupported}
                        className={`mt-3 w-full rounded-lg px-3 py-2 font-semibold transition ${
                            !isSupported
                                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                : isEnabled
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                    >
                        {isEnabled ? 'Tắt đọc tự động' : 'Bật đọc tự động'}
                    </button>

                    <p className="mt-4 text-xs text-gray-500">
                        Chỉ đọc các phản hồi mới của AI (cột bên trái). Nếu bạn tắt đi, hàng đợi đọc sẽ được
                        xoá ngay lập tức.
                    </p> {/* Ghi chú hành vi. */}

                    {!isSupported && ( // Khi không hỗ trợ, hiển thị hướng dẫn.
                        <p className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
                            Trình duyệt cần hỗ trợ Web Speech API (Chrome desktop, Edge, Chrome Android). Hãy cập nhật
                            hoặc dùng thiết bị khác.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}; // Kết thúc component.

export default SpeechControls; // Xuất component mặc định.

