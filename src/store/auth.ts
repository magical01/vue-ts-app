import { defineStore } from 'pinia'

import { AuthState } from '../interfaces/AuthState'

export const useAuthStore = defineStore('auth', {
	state: (): AuthState => ({
		user: null,
		token: null
	}),

	actions: {
		setAuth(token: string) {
			this.token = token
			const [username] = atob(token).split(':')
			this.user = { username }
		},

		login(token: string) {
			this.setAuth(token)
			localStorage.setItem('token', token)
		},

		logout() {
			this.user = null
			this.token = null
			localStorage.removeItem('token')
		},

		checkAuth() {
			const token = localStorage.getItem('token')
			token && this.setAuth(token)
		}
	}
})
