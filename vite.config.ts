import { defineConfig } from 'vite';
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    {
      name: 'after-build-fvn',
      buildEnd: () => {
        console.log('???');
      },
    },
  ],
  base: '/fvn-translation/',
  resolve: process.env.NODE_ENV === 'development' ? {} : {
		alias: {
			'react-dom/server': 'react-dom/server.node',
		},
	},
})
