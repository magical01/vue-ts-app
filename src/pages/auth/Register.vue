<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../../store/auth'
import { mockRegister } from '../../mocks/auth'

import AppScreen from '../../components/app/AppScreen.vue'

import UiInput from '../../components/ui/UiInput.vue'
import UiButton from '../../components/ui/UiButton.vue'

/**
 * Инициализация роутера для навигации.
 * @type {Router}
 */
const router = useRouter()
/**
 * Store аутентификации.
 * @type {ReturnType<typeof useAuthStore>}
 */
const authStore = useAuthStore()

/**
 * Логин пользователя.
 * @type {import('vue').Ref<string>}
 */
const username = ref<string>('')
/**
 * Пароль пользователя.
 * @type {import('vue').Ref<string>}
 */
const password = ref<string>('')

/**
 * Обрабатывает отправку формы регистрации.
 * @returns {Promise<void>}
 */
async function handleSubmit() {
	try {
		const token = await mockRegister(username.value, password.value)
		authStore.login(token)
		router.push('/')
	} catch (error) {
		alert(error)
	}
}
</script>

<template>
	<AppScreen>
		<form @submit.prevent="handleSubmit" class="form">
			<h2 class="form__title">Регистрация</h2>
			<UiInput v-model="username" type="text" placeholder="Логин" />
			<UiInput v-model="password" type="password" placeholder="Пароль" />
			<UiButton type="submit">Зарегистрироваться</UiButton>
			<strong class="form__subtitle">Страница входа</strong>
			<UiButton @click="$router.push('/login')">Войти</UiButton>
		</form>
	</AppScreen>
</template>

<style scoped lang="scss"></style>
