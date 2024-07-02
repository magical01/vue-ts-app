import { ref } from 'vue'
import { defineStore } from 'pinia'

import { UserState } from '../interfaces/UserState'

/**
 * Модуль для управления аутентификацией.
 * @module useAuthStore
 */

/**
 * Создает store для аутентификации.
 * @returns {Object} Store аутентификации с состоянием и методами.
 */

export const useAuthStore = defineStore('auth', () => {
	/**
	 * Состояние пользователя.
	 * @type {import('vue').Ref<UserState | null>}
	 */
	const user = ref<UserState | null>(null)
	/**
	 * Токен аутентификации.
	 * @type {import('vue').Ref<string | null>}
	 */
	const token = ref<string | null>(null)

	/**
	 * Устанавливает токен аутентификации и обновляет состояние пользователя.
	 * @param {string} newToken - Новый токен аутентификации.
	 */
	function setAuth(newToken: string) {
		token.value = newToken
		const [username] = atob(newToken).split(':')
		user.value = { username }
	}

	/**
	 * Выполняет вход пользователя и сохраняет токен в localStorage.
	 * @param {string} newToken - Новый токен аутентификации.
	 */
	function login(newToken: string) {
		setAuth(newToken)
		localStorage.setItem('token', newToken)
	}

	/**
	 * Выполняет выход пользователя и удаляет токен из localStorage.
	 */
	function logout() {
		user.value = null
		token.value = null
		localStorage.removeItem('token')
	}

	/**
	 * Проверяет наличие токена в localStorage и устанавливает его, если он найден.
	 */
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
