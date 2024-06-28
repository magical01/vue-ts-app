import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'

import { useAuthStore } from './store/auth'

import './styles/main.scss'

import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(createPinia())

const authStore = useAuthStore()
authStore.checkAuth()

app.mount('#app')
