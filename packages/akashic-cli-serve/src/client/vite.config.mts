import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	base: "/public/",
	build: {
		outDir: "../../www/public/",
		emptyOutDir: false,
	},
	server: {
		proxy: {
			'/api': 'http://localhost:3300',
			'/contents': 'http://localhost:3300',
			'/public': 'http://localhost:3300',
			'/internal': 'http://localhost:3300',
			'/socket.io': {
				target: 'ws://localhost:3300',
				ws: true,
				// プロキシが CSRF 攻撃に無防備なままになる可能性があるとのこと。HMR のサーバはインターネットに公開すべきではない。
				// ref. https://ja.vite.dev/config/server-options.html#server-proxy
				rewriteWsOrigin: true,
			},
		},
	},
});

