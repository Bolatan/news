import { defineConfig, ViteDevServer, PreviewServer } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { spawn, ChildProcess } from 'node:child_process';

let backendProcess: ChildProcess | null = null;

function startBackend() {
  if (backendProcess) return;
  console.log('Starting Express backend server...');
  backendProcess = spawn('npx', ['tsx', 'watch', 'server/index.ts'], {
    stdio: 'inherit',
    detached: true,
    shell: true,
  });

  backendProcess.on('close', (code: number | null) => {
    console.log(`Express backend exited with code ${code}`);
    backendProcess = null;
  });
}

// Kill the entire process group of the backend process to prevent orphaned child processes
function stopBackend() {
  if (backendProcess && backendProcess.pid) {
    console.log('Stopping Express backend server...');
    try {
      process.kill(-backendProcess.pid);
    } catch {
      // ignore
    }
    backendProcess = null;
  }
}

process.on('exit', () => {
  stopBackend();
});
process.on('SIGINT', () => {
  stopBackend();
  process.exit();
});
process.on('SIGTERM', () => {
  stopBackend();
  process.exit();
});

const expressBackendPlugin = () => ({
  name: 'express-backend',
  configureServer(server: ViteDevServer) {
    startBackend();
    server.httpServer?.on('close', () => {
      stopBackend();
    });
  },
  configurePreviewServer(server: PreviewServer) {
    startBackend();
    server.httpServer?.on('close', () => {
      stopBackend();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), expressBackendPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
