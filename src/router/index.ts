import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'

import { useAuthStore } from '../store/auth'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: HomePage,
		meta: { requiresAuth: true }
	},
	{
		path: '/login',
		name: 'Login',
		component: LoginPage
	},
	{
		path: '/register',
		name: 'Register',
		component: RegisterPage
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

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
