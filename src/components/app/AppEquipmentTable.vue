<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

import { useEquipmentStore } from '../../store/equipmentStore'

import UiContextMenu from '../ui/UiContextMenu.vue'
import UiModal from '../ui/UiModal.vue'
import UiButton from '../ui/UiButton.vue'
import UiInput from '../ui/UiInput.vue'

import { TreeItem } from '../../interfaces/TreeItem'
import { Equipment } from '../../interfaces/Equipment'

const props = defineProps<{
	selectedItem: TreeItem | null
}>()

const equipmentStore = useEquipmentStore()

const showMenu = ref<boolean>(false)
const menuPosition = ref({ x: 0, y: 0 })
const selectedEquipment = ref<Equipment | null>(null)

const showModal = ref<boolean>(false)
const modalTitle = ref<string>('')
const formData = ref<Partial<Equipment>>({})

const menuActions = [
	{ label: 'Добавить', action: 'add' },
	{ label: 'Изменить', action: 'edit' },
	{ label: 'Удалить', action: 'delete' }
]

const tableLabel = [{ label: 'Название' }, { label: 'Тип' }, { label: 'Серийный номер' }, { label: 'Дата установки' }]

const equipmentList = computed(() => {
	if (props.selectedItem && isLastChild(props.selectedItem)) {
		return equipmentStore.getEquipment(props.selectedItem.id)
	}
	return []
})

function isLastChild(item: TreeItem) {
	return !item.children || item.children.length === 0
}

function showContextMenu(event: MouseEvent, equipment: Equipment | null) {
	if (!event) return

	event.preventDefault()
	event.stopPropagation()
	menuPosition.value = { x: event.clientX, y: event.clientY }
	selectedEquipment.value = equipment
	showMenu.value = true
}

function handleMenuAction(action: string) {
	showMenu.value = false
	if (!props.selectedItem) return

	switch (action) {
		case 'add':
			modalTitle.value = 'Добавить оборудование'
			formData.value = {}
			showModal.value = true
			break
		case 'edit':
			if (selectedEquipment.value) {
				modalTitle.value = 'Изменить оборудование'
				formData.value = { ...selectedEquipment.value }
				showModal.value = true
			}
			break
		case 'delete':
			if (selectedEquipment.value) {
				equipmentStore.deleteEquipment(props.selectedItem.id, selectedEquipment.value.id)
			}
			break
	}
}

function submitForm() {
	if (!props.selectedItem) return

	if (modalTitle.value === 'Добавить оборудование') {
		equipmentStore.addEquipment(props.selectedItem.id, formData.value as Omit<Equipment, 'id'>)
	} else {
		if (selectedEquipment.value) {
			equipmentStore.updateEquipment(props.selectedItem.id, selectedEquipment.value.id, formData.value)
		}
	}
	closeModal()
}

function closeModal() {
	showModal.value = false
	formData.value = {}
}

function handleOutsideClick(event: MouseEvent) {
	const target = event.target as HTMLElement

	if (!target.closest('.context-menu')) showMenu.value = false
}

onMounted(() => document.addEventListener('click', handleOutsideClick))

onUnmounted(() => document.removeEventListener('click', handleOutsideClick))
</script>

<template>
	<div class="equipment-wrapper">
		<div v-if="selectedItem && isLastChild(selectedItem)" class="equipment">
			<h2>Оборудование для {{ selectedItem.name }}</h2>
			<table class="equipment__table">
				<thead>
					<tr>
						<th v-for="(label, index) in tableLabel" :key="index">{{ label.label }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="equipment in equipmentList" :key="equipment.id" @contextmenu="showContextMenu($event, equipment)">
						<td v-for="(item, index) in Object.values(equipment).slice(1)" :key="index">{{ item }}</td>
						<!-- <td>{{ equipment.name }}</td>
						<td>{{ equipment.type }}</td>
						<td>{{ equipment.serialNumber }}</td>
						<td>{{ equipment.installationDate }}</td> -->
					</tr>
				</tbody>
			</table>
			<UiButton type="button" @click="showContextMenu($event, null)">Добавить оборудование</UiButton>
		</div>
		<div v-else class="no-equipment">Нет оборудования для отображения</div>

		<UiContextMenu v-if="showMenu" :position="menuPosition" :actions="menuActions" @select="handleMenuAction" />

		<UiModal v-if="showModal" @close="closeModal">
			<template #header>{{ modalTitle }}</template>
			<template #body>
				<form @submit.prevent="submitForm" class="modal__form">
					<div>
						<label>Название:</label>
						<UiInput v-model="formData.name" placeholder="Название" required />
					</div>
					<div>
						<label>Тип:</label>
						<UiInput v-model="formData.type" placeholder="Тип" required />
					</div>
					<div>
						<label>Серийный номер:</label>
						<UiInput v-model="formData.serialNumber" placeholder="Серийный номер" required />
					</div>
					<div>
						<label>Дата установки:</label>
						<UiInput v-model="formData.installationDate" type="date" required />
					</div>
					<UiButton type="submit">Сохранить</UiButton>
				</form>
			</template>
		</UiModal>
	</div>
</template>

<style scoped lang="scss">
.equipment {
	padding: 20px;
	border: 1px solid $gray;
	border-radius: 8px;
	background-color: #f9f9f9;

	h2 {
		margin-bottom: 20px;
		font-size: 24px;
		text-align: center;
	}

	&__table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 20px;

		th,
		td {
			border: 1px solid $gray;
			padding: 8px;
			text-align: left;
		}

		th {
			background-color: #f2f2f2;
		}

		tr:nth-child(even) {
			background-color: #f9f9f9;
		}

		tr:hover {
			background-color: #f1f1f1;
		}
	}
}

.no-equipment {
	margin-bottom: 20px;
	text-align: center;
	color: #999;
}

.modal__form {
	display: flex;
	flex-direction: column;
	gap: 24px;

	& > div {
		display: flex;
		flex-direction: column;
		gap: 12px;

		& > div {
			display: flex;
			flex-direction: column;
			gap: 12px;
		}
	}
}
</style>
