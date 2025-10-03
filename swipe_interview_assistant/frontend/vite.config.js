// // vite.config.js
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss()
//   ],
//   optimizeDeps: {
//     exclude: ['pdf-parse', 'pdf.js', 'pdfjs-dist', 'mammoth'] // Add PDF and DOCX parsing libraries to exclude
//   },
//   build: {
//     rollupOptions: {
//       external: ['pdf-parse'] // Ensure PDF parsing libraries are not bundled
//     }
//   }
// })



// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  optimizeDeps: {
    exclude: [
      'pdfjs-dist',
      'pdf-parse',
      'mammoth'
    ]
  },
  build: {
    rollupOptions: {
      external: [
        'pdfjs-dist/build/pdf.worker.entry'
      ]
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})