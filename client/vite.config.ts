import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', ''); // Load toàn bộ biến từ .env/.env.local.
    const geminiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || ''; // Cho phép dùng cả biến không prefix.
    const apyhubKey = env.VITE_APYHUB_API_KEY || env.APYHUB_API_KEY || ''; // Key cho ApyHub Summarize.
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        '__APP_VITE_GEMINI_API_KEY__': JSON.stringify(geminiKey), // Inject hằng compile-time để client truy cập.
        '__APP_APYHUB_API_KEY__': JSON.stringify(apyhubKey), // Hằng compile-time cho ApyHub.
        'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
        'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
        'process.env.VITE_APYHUB_API_KEY': JSON.stringify(env.VITE_APYHUB_API_KEY),
        'process.env.APYHUB_API_KEY': JSON.stringify(env.APYHUB_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
