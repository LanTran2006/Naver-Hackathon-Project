import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', ''); // Load toàn bộ biến từ .env/.env.local.
    const geminiKey = env.VITE_GEMINI_API_KEY || ''; // Ưu tiên biến có prefix, fallback VITE_GEMINI_API_KEY.
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        '__APP_VITE_GEMINI_API_KEY__': JSON.stringify(geminiKey), // Inject hằng compile-time để client truy cập.
        'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
        'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
