import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:2000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});

// // vite.config.js
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import tailwindcssLineClamp from "@tailwindcss/line-clamp/src/index.js";

// export default defineConfig({
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:2000",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
//   plugins: [

//     react(),
//     // other plugins...
//   ],
// });
