<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../../store/auth'

import AppSidePanel from '../../components/app/AppSidePanel.vue'
import AppTreeView from '../../components/app/AppTreeView.vue'
import AppEquipmentTable from '../../components/app/AppEquipmentTable.vue'

import { TreeItem } from '../../interfaces/TreeItem'
import { UserState } from '../../interfaces/UserState'

const router = useRouter()
const authStore = useAuthStore()

const user = ref<UserState | null>(authStore.user)

const selectedItem = ref<TreeItem | null>(null)

function onItemSelected(item: TreeItem) {
	selectedItem.value = item
}

onMounted(() => !user.value && router.push('/login'))
</script>

<template>
	<div class="home-page">
		<AppSidePanel />
		<div class="home-page__content">
			<AppTreeView @item-selected="onItemSelected" />
			<AppEquipmentTable :selectedItem="selectedItem" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.home-page {
	padding: 24px 24px 24px 0;
	display: grid;
	grid-template-columns: 200px 1fr;
	grid-template-areas: 'side-panel home-content';
	gap: 24px;
	width: 100%;
	height: max-content;
	min-height: 100%;

	&__content {
		grid-area: home-content;
	}
}
</style>
