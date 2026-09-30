import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const source = path.join(__dirname, '_headers');
const dest = path.join(__dirname, 'dist', '_headers');

try {
  fs.copyFileSync(source, dest);
  console.log('✓ _headers copied to dist/');
} catch (error) {
  console.error('✗ Failed to copy _headers:', error.message);
  process.exit(1);
}
