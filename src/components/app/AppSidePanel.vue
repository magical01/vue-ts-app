<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../../store/auth'
import { useMenuStore } from '../../store/menuStore'

import UiButton from '../ui/UiButton.vue'

import { UserState } from '../../interfaces/UserState'

const router = useRouter()
const authStore = useAuthStore()
const menuStore = useMenuStore()

/**
 * Текущий пользователь.
 * @type {Ref<UserState | null>}
 */
const user = ref<UserState | null>(authStore.user)

/**
 * Вычисляемый класс для боковой панели в зависимости от состояния меню.
 */
const panelClass = computed(() => {
	return {
		'home-page__panel': true,
		'panel-open': menuStore.isMenuVisible
	}
})

/**
 * Выполняет выход пользователя и перенаправляет на страницу входа.
 */
function logout() {
	authStore.logout()
	router.push('/login')
}
</script>

<template>
	<aside :class="panelClass">
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
	padding: 32px 16px;
	background-color: $white;
	transition: transform $base-transition;
	transform: translate(0);

	@include mobile {
		padding: 16px;
		transform: translateX(-100%);
	}

	&.panel-open {
		@include mobile {
			transform: translateX(0);
		}
	}

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
