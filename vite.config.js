import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    // rollupOptions: {
    //   external: ["firebase/firestore"],
    // },
  },
});
