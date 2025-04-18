import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import react from '@vitejs/plugin-react';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	base: "/public/",
	build: {
		outDir: "../../www/public/",
		emptyOutDir: false,
		rollupOptions: {
			input: {
				serve: resolve(__dirname, "index.html"),
				sandbox: resolve(__dirname, "sandbox", "index.html"),
			},
		},
	},

	// vite serve 用の設定。利用時は別で適当なコンテンツを実行する serve を起動しておく必要がある (e.g. `node bin/run.js -B --port 3300 <content>`) 。
	// TODO HMR が効かない問題を解消する
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

