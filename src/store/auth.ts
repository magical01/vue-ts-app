import { defineStore } from 'pinia'
import { ref } from 'vue'

import { UserState } from '../interfaces/UserState'

export const useAuthStore = defineStore('auth', () => {
	const user = ref<UserState | null>(null)
	const token = ref<string | null>(null)

	function setAuth(newToken: string) {
		token.value = newToken
		const [username] = atob(newToken).split(':')
		user.value = { username }
	}

	function login(newToken: string) {
		setAuth(newToken)
		localStorage.setItem('token', newToken)
	}

	function logout() {
		user.value = null
		token.value = null
		localStorage.removeItem('token')
	}

	function checkAuth() {
		const storedToken = localStorage.getItem('token')
		storedToken && setAuth(storedToken)
	}

	return {
		user,
		token,
		setAuth,
		login,
		logout,
		checkAuth
	}
})
