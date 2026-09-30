import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cloudflare-headers',
      apply: 'build',
      writeBundle() {
        const headersContent = `/assets/*.js
  Content-Type: application/javascript

/assets/*.mjs
  Content-Type: application/javascript

/assets/*.css
  Content-Type: text/css

/* /_redirects 200!`

        const headersPath = path.join(__dirname, 'dist', '_headers')
        fs.writeFileSync(headersPath, headersContent)
      },
    },
  ],
})
