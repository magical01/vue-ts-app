<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

import TreeComponent from '../components/app/AppTreeComponent.vue'
import EquipmentTable from '../components/app/AppEquipmentTable.vue'

import UiButton from '../components/ui/UiButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const user = ref(authStore.user)

onMounted(() => {
	if (!user.value) {
		router.push('/login')
	}
})

const logout = () => {
	authStore.logout()
	router.push('/login')
}
</script>

<template>
	<div class="home-page">
		<h1>Home Page</h1>
		<div v-if="user">
			<p>Welcome, {{ user.username }}</p>
			<UiButton @click="logout">Logout</UiButton>
			<!-- Древовидная структура -->
			<TreeComponent />
			<!-- Таблица оборудования -->
			<EquipmentTable />
		</div>
		<div v-else>
			<p>You are not logged in. Redirecting to login...</p>
		</div>
	</div>
</template>

<style scoped lang="scss">
.home-page {
	padding: 1rem;
}
</style>
