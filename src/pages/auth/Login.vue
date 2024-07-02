<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../../store/auth'
import { mockLogin } from '../../mocks/auth'

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
 * Обрабатывает отправку формы входа.
 * @returns {Promise<void>}
 */
async function handleSubmit() {
	try {
		const token = await mockLogin(username.value, password.value)
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
			<h2 class="form__title">Вход в аккаунт</h2>
			<UiInput v-model="username" type="text" placeholder="Логин" />
			<UiInput v-model="password" type="password" placeholder="Пароль" />
			<UiButton type="submit">Войти</UiButton>
			<strong class="form__subtitle">Страница регистрации</strong>
			<UiButton @click="$router.push('/register')">Регистрация</UiButton>
		</form>
	</AppScreen>
</template>

<style lang="scss">
.form {
	display: flex;
	flex-direction: column;
	gap: 24px;
	border-radius: 24px;
	padding: 24px;
	width: 360px;
	background-color: $white;

	@include mobile {
		width: 90%;
	}

	&__title {
		text-align: center;
	}

	&__subtitle {
		font-size: 20px;
		text-align: center;
	}
}
</style>
