import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const pathSrc = path.resolve(__dirname, 'src')

export default defineConfig({
	resolve: {
		alias: {
			'@': pathSrc
		}
	},
	plugins: [vue()],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
          @import "@/styles/_variables.scss";
					@import "@/styles/_mixin.scss";
        `
			}
		}
	}
})
//
