import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Landing Page
    'landing.hero.title': 'Give everyone a voice.',
    'landing.hero.subtitle': 'LReg helps speech-impaired users communicate with friends in natural language using AI.',
    'landing.hero.launchApp': 'Launch App',
    'landing.howItWorks.title': 'How it works',
    'landing.howItWorks.subtitle': 'A simple, three-step process to seamless communication.',
    'landing.howItWorks.step1.title': '1. Record or Upload',
    'landing.howItWorks.step1.desc': 'Record or upload a short video or audio clip of what you want to communicate.',
    'landing.howItWorks.step2.title': '2. AI Interpretation',
    'landing.howItWorks.step2.desc': 'Our AI understands gestures and speech, converting them into clear text.',
    'landing.howItWorks.step3.title': '3. Communicate',
    'landing.howItWorks.step3.desc': 'Use the generated text to communicate clearly and effectively.',
    'landing.features.title': 'Key Features',
    'landing.features.aiInterpretation': 'AI Video & Audio Interpretation',
    'landing.features.aiInterpretation.desc': 'State-of-the-art AI to translate visual and auditory cues into text.',
    'landing.features.realtime': 'Real-time Text Generation',
    'landing.features.realtime.desc': 'Convert your intent into clear, natural language instantly.',
    'landing.features.rephrasing': 'AI-Assisted Rephrasing',
    'landing.features.rephrasing.desc': 'Get intelligent suggestions to refine your message.',
    'landing.features.history': 'Temporary Session History',
    'landing.features.history.desc': 'Keep track of your generated messages during your session.',
    'landing.features.voiceText': 'Voice ↔ Text Conversion',
    'landing.features.voiceText.desc': 'Seamlessly convert text to speech and speech to text.',
    'landing.features.accessible': 'Accessible by Design',
    'landing.features.accessible.desc': 'High contrast, large controls, and simple flows for everyone.',
    'landing.accessibility.title': 'Accessibility and Privacy First',
    'landing.accessibility.subtitle': 'We are committed to building a platform that is not only powerful but also inclusive and secure for all our users.',
    'landing.accessibility.feature1': 'Large buttons, big icons, and simple workflows for ease of use.',
    'landing.accessibility.feature2': 'High contrast and readable fonts to ensure clarity for visually impaired users.',
    'landing.accessibility.feature3': 'Your privacy is respected. No data is stored without an account.',
    'landing.cta.title': 'Ready to start communicating?',
    'landing.cta.subtitle': 'Try LReg\'s AI assistant now.',
    'landing.cta.button': 'Launch App',
    'landing.nav.features': 'Features',
    'landing.nav.howItWorks': 'How it works',
    'landing.nav.faq': 'FAQ',
    
    // Main App
    'app.video.allowCamera': 'Allow the browser to use your webcam for preview.',
    'app.video.readyToRecord': 'Ready to record',
    'app.video.startRecording': 'Start recording',
    'app.video.audioOn': 'Audio On',
    'app.video.audioOff': 'Audio Off',
    'app.video.getReady': 'Get ready...',
    'app.video.stopRecording': 'Stop Recording',
    'app.video.continueRecording': 'Continue Recording',
    'app.video.endRecording': 'End Recording',
    'app.video.recordAgain': 'Record Again',
    'app.video.download': 'Download',
    'app.video.send': 'Send to AI',
    'app.video.processing': 'Processing...',
    'app.tabs.video': 'Video',
    'app.tabs.upload': 'Upload File',
    'app.tabs.text': 'Text',
    'app.advanced.show': 'Show advanced options',
    'app.advanced.hide': 'Hide advanced options',
    'app.speech.autoRead': 'Voice AI Reading',
    'app.speech.enabled': 'Ready to read new responses',
    'app.speech.disabled': 'Disabled (will not auto-read)',
    'app.speech.reading': 'Reading new response',
    'app.speech.toggle.enable': 'Enable auto-read',
    'app.speech.toggle.disable': 'Disable auto-read',
  },
  vi: {
    // Landing Page
    'landing.hero.title': 'Trao tiếng nói cho mọi người.',
    'landing.hero.subtitle': 'LReg giúp người khuyết tật giao tiếp với bạn bè bằng ngôn ngữ tự nhiên nhờ AI.',
    'landing.hero.launchApp': 'Khởi động ứng dụng',
    'landing.howItWorks.title': 'Cách hoạt động',
    'landing.howItWorks.subtitle': 'Quy trình đơn giản ba bước để giao tiếp liền mạch.',
    'landing.howItWorks.step1.title': '1. Ghi hoặc Tải lên',
    'landing.howItWorks.step1.desc': 'Ghi hoặc tải lên video hoặc âm thanh ngắn về những gì bạn muốn truyền đạt.',
    'landing.howItWorks.step2.title': '2. Diễn giải bằng AI',
    'landing.howItWorks.step2.desc': 'AI của chúng tôi hiểu cử chỉ và lời nói, chuyển đổi chúng thành văn bản rõ ràng.',
    'landing.howItWorks.step3.title': '3. Giao tiếp',
    'landing.howItWorks.step3.desc': 'Sử dụng văn bản được tạo để giao tiếp rõ ràng và hiệu quả.',
    'landing.features.title': 'Tính năng chính',
    'landing.features.aiInterpretation': 'Diễn giải Video & Âm thanh bằng AI',
    'landing.features.aiInterpretation.desc': 'AI hiện đại để dịch tín hiệu hình ảnh và âm thanh thành văn bản.',
    'landing.features.realtime': 'Tạo văn bản theo thời gian thực',
    'landing.features.realtime.desc': 'Chuyển đổi ý định của bạn thành ngôn ngữ tự nhiên rõ ràng ngay lập tức.',
    'landing.features.rephrasing': 'Hỗ trợ diễn đạt lại bằng AI',
    'landing.features.rephrasing.desc': 'Nhận gợi ý thông minh để tinh chỉnh tin nhắn của bạn.',
    'landing.features.history': 'Lịch sử phiên tạm thời',
    'landing.features.history.desc': 'Theo dõi các tin nhắn đã tạo trong phiên của bạn.',
    'landing.features.voiceText': 'Chuyển đổi Giọng nói ↔ Văn bản',
    'landing.features.voiceText.desc': 'Chuyển đổi văn bản thành giọng nói và ngược lại một cách liền mạch.',
    'landing.features.accessible': 'Thiết kế dễ tiếp cận',
    'landing.features.accessible.desc': 'Độ tương phản cao, điều khiển lớn và quy trình đơn giản cho mọi người.',
    'landing.accessibility.title': 'Ưu tiên khả năng tiếp cận và bảo mật',
    'landing.accessibility.subtitle': 'Chúng tôi cam kết xây dựng một nền tảng không chỉ mạnh mẽ mà còn toàn diện và an toàn cho tất cả người dùng.',
    'landing.accessibility.feature1': 'Nút lớn, biểu tượng to và quy trình đơn giản để dễ sử dụng.',
    'landing.accessibility.feature2': 'Độ tương phản cao và phông chữ dễ đọc để đảm bảo rõ ràng cho người khiếm thị.',
    'landing.accessibility.feature3': 'Quyền riêng tư của bạn được tôn trọng. Không có dữ liệu nào được lưu trữ mà không có tài khoản.',
    'landing.cta.title': 'Sẵn sàng bắt đầu giao tiếp?',
    'landing.cta.subtitle': 'Thử trợ lý AI của LReg ngay bây giờ.',
    'landing.cta.button': 'Khởi động ứng dụng',
    'landing.nav.features': 'Tính năng',
    'landing.nav.howItWorks': 'Cách hoạt động',
    'landing.nav.faq': 'Câu hỏi thường gặp',
    
    // Main App
    'app.video.allowCamera': 'Cho phép trình duyệt sử dụng webcam của bạn để xem trước.',
    'app.video.readyToRecord': 'Sẵn sàng ghi hình',
    'app.video.startRecording': 'Bắt đầu ghi hình',
    'app.video.audioOn': 'Bật âm thanh',
    'app.video.audioOff': 'Tắt âm thanh',
    'app.video.getReady': 'Chuẩn bị...',
    'app.video.stopRecording': 'Dừng ghi',
    'app.video.continueRecording': 'Tiếp tục ghi',
    'app.video.endRecording': 'Kết thúc ghi',
    'app.video.recordAgain': 'Ghi lại',
    'app.video.download': 'Tải xuống',
    'app.video.send': 'Gửi đến AI',
    'app.video.processing': 'Đang xử lý...',
    'app.tabs.video': 'Video',
    'app.tabs.upload': 'Tải lên tệp',
    'app.tabs.text': 'Văn bản',
    'app.advanced.show': 'Hiển thị tùy chọn nâng cao',
    'app.advanced.hide': 'Ẩn tùy chọn nâng cao',
    'app.speech.autoRead': 'Giọng đọc AI',
    'app.speech.enabled': 'Sẵn sàng đọc phản hồi mới',
    'app.speech.disabled': 'Đang tắt (sẽ không đọc tự động)',
    'app.speech.reading': 'Đang đọc phản hồi mới',
    'app.speech.toggle.enable': 'Bật đọc tự động',
    'app.speech.toggle.disable': 'Tắt đọc tự động',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'vi' : 'en');
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  const value = {
    language,
    toggleLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
