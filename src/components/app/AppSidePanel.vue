<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../../store/auth'

import UiButton from '../ui/UiButton.vue'

import { UserState } from '../../interfaces/UserState'

const router = useRouter()
const authStore = useAuthStore()

const user = ref<UserState | null>(authStore.user)

function logout() {
	authStore.logout()
	router.push('/login')
}
</script>

<template>
	<aside class="home-page__panel">
		<h1>Главная</h1>
		<div>
			Добро пожаловать, <strong>{{ user?.username }}</strong>
		</div>
		<UiButton @click="logout">Выйти</UiButton>
	</aside>
</template>

<style scoped lang="scss">
.home-page__panel {
	grid-area: side-panel;
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 200px;
	z-index: 2000;
	height: 100vh;
	padding: 24px 16px;
	background-color: $white;

	h1 {
		display: inline-block;
		text-align: center;
		margin-bottom: 32px;
	}

	& > div {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;

		strong {
			text-align: center;
		}
	}

	button {
		margin-top: auto;
	}
}
</style>
