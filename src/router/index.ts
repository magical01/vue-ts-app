import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/index/Home.vue'
import Login from '../pages/auth/Login.vue'
import Register from '../pages/auth/Register.vue'

import { useAuthStore } from '../store/auth'

/**
 * Определение маршрутов для приложения.
 * @type {Array<Object>}
 */
const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		meta: { requiresAuth: true }
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/register',
		name: 'Register',
		component: Register
	}
]

/**
 * Создает и настраивает роутер.
 * @returns {Router} Экземпляр роутера.
 */
const router = createRouter({
	history: createWebHistory(),
	routes
})

/**
 * Проверяет перед каждым переходом, требуется ли аутентификация для маршрута.
 * Если требуется и пользователь не аутентифицирован, перенаправляет на страницу логина.
 * @param {RouteLocationNormalized} to - Маршрут, на который происходит переход.
 * @param {RouteLocationNormalized} from - Маршрут, с которого происходит переход.
 * @param {Function} next - Функция для продолжения или отмены перехода.
 */
router.beforeEach((to, _from, next) => {
	const authStore = useAuthStore()
	authStore.checkAuth()

	if (to.meta.requiresAuth && !authStore.user) {
		next('/login')
	} else {
		next()
	}
})

export default router
