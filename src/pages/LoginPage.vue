<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { mockLogin } from '../mocks/auth'

import AppScreen from '../components/app/AppScreen.vue'

import UiInput from '../components/ui/UiInput.vue'
import UiButton from '../components/ui/UiButton.vue'

const username = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleSubmit = async () => {
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

	&__title {
		text-align: center;
	}
}
</style>
