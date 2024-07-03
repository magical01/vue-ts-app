<script setup lang="ts">
import { ref } from 'vue'

import { useMenuStore } from '../../store/menuStore'

import AppSidePanel from '../../components/app/AppSidePanel.vue'
import AppTreeView from '../../components/app/AppTreeView.vue'
import AppEquipmentTable from '../../components/app/AppEquipmentTable.vue'

import UiBurger from '../../components/ui/UiBurger.vue'

import { TreeItem } from '../../interfaces/TreeItem'

/**
 * Store аутентификации.
 * @type {ReturnType<typeof useAuthStore>}
 */
const menuStore = useMenuStore()

/**
 * Выбранный элемент дерева.
 * @type {import('vue').Ref<TreeItem | null>}
 */
const selectedItem = ref<TreeItem | null>(null)

/**
 * Обрабатывает событие выбора элемента дерева.
 * @param {TreeItem} item - Выбранный элемент.
 */
function onItemSelected(item: TreeItem) {
	selectedItem.value = item
}
</script>

<template>
	<div :class="{ 'home-page': true, 'panel-open': menuStore.isMenuVisible }">
		<div :class="{ overlay: true, 'overlay-open': menuStore.isMenuVisible }" @click="menuStore.toggleMenu"></div>
		<UiBurger @click="menuStore.toggleMenu" />
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
	transition: $transition;

	@include mobile {
		grid-template-columns: 0px 1fr;
		gap: 0;
		padding: 16px;
	}

	.overlay {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		background-color: rgba($black, 0.3);
		transition: opacity $base-transition;
		opacity: 0;
		pointer-events: none;
		&.overlay-open {
			@include mobile {
				opacity: 1;
				pointer-events: auto;
			}
		}
	}

	&__content {
		grid-area: home-content;

		@include mobile {
			padding-top: 32px;
		}
	}
}
</style>
