import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import path from 'path'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@styles": path.resolve("./src/global-styles/index.ts"),
      "@pages": path.resolve("./src/pages/index.ts"),
      "@hooks": path.resolve("./src/hooks/index.ts"),
      "@components": path.resolve("./src/components/index.ts"),
      "@elements": path.resolve("./src/elements/index.ts"),
      "@contexts": path.resolve("./src/contexts/index.ts"),
      "@utils": path.resolve("./src/utils/index.ts"),
      "@icons": path.resolve("./src/icons/index.ts"),
      "@types": path.resolve("./src/types/index.ts"),
      "@constants": path.resolve("./src/constants/index.ts"),
      "@providers": path.resolve("./src/providers/index.ts"),
      "@services": path.resolve("./src/services/index.ts"),
      "@builders": path.resolve("./src/builders/index.ts"),
      "@assets": path.resolve("./src/assets/index.ts")
    },
  },
  define: {
    'process.env': process.env ?? {},
  },
  build: {
    target: 'esnext'
  }
});