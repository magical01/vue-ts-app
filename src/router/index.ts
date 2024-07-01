import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/index/Home.vue'
import Login from '../pages/auth/Login.vue'
import Register from '../pages/auth/Register.vue'

import { useAuthStore } from '../store/auth'

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
