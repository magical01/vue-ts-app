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

/**
 * Показывает ли контекстное меню.
 * @type {Ref<boolean>}
 */
const showMenu = ref<boolean>(false)

/**
 * Позиция контекстного меню.
 * @type {Ref<{ x: number, y: number }>}
 */
const menuPosition = ref({ x: 0, y: 0 })

/**
 * Выбранное оборудование.
 * @type {Ref<Equipment | null>}
 */
const selectedEquipment = ref<Equipment | null>(null)

/**
 * Показывает ли модальное окно.
 * @type {Ref<boolean>}
 */
const showModal = ref<boolean>(false)

/**
 * Заголовок модального окна.
 * @type {Ref<string>}
 */
const modalTitle = ref<string>('')

/**
 * Данные формы для модального окна.
 * @type {Ref<Partial<Equipment>>}
 */
const formData = ref<Partial<Equipment>>({})

/**
 * Действия контекстного меню.
 * @type {Array<{ label: string, action: string }>}
 */
const menuActions = [
	{ label: 'Добавить', action: 'add' },
	{ label: 'Изменить', action: 'edit' },
	{ label: 'Удалить', action: 'delete' }
]

/**
 * Метки таблицы.
 * @type {Array<{ label: string }>}
 */
const tableLabel = [{ label: 'Название' }, { label: 'Тип' }, { label: 'Дата установки' }]

/**
 * Список оборудования, соответствующий выбранному элементу.
 * @type {ComputedRef<Equipment[]>}
 */
const equipmentList = computed(() => {
	if (props.selectedItem && isLastChild(props.selectedItem) && props.selectedItem?.id.length === 9) {
		return equipmentStore.getEquipment(props.selectedItem.id)
	}
	return []
})

/**
 * Проверяет, является ли элемент последним потомком.
 * @param {TreeItem} item - Элемент дерева.
 * @returns {boolean} - True, если элемент не имеет детей.
 */
function isLastChild(item: TreeItem) {
	return !item.children || item.children.length === 0
}

/**
 * Показывает контекстное меню.
 * @param {MouseEvent} event - Событие мыши.
 * @param {Equipment | null} equipment - Оборудование.
 */
function showContextMenu(event: MouseEvent, equipment: Equipment | null) {
	if (!event) return

	event.preventDefault()
	event.stopPropagation()
	menuPosition.value = { x: event.clientX, y: event.clientY }
	selectedEquipment.value = equipment
	showMenu.value = true
}

/**
 * Обрабатывает действие контекстного меню.
 * @param {string} action - Действие.
 */
function handleMenuAction(action: string) {
	if (showMenu.value) showMenu.value = false

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

/**
 * Отправляет форму.
 */
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

/**
 * Закрывает модальное окно.
 */
function closeModal() {
	showModal.value = false
	formData.value = {}
}

/**
 * Обрабатывает клик вне контекстного меню.
 * @param {MouseEvent} event - Событие мыши.
 */
function handleOutsideClick(event: MouseEvent) {
	const target = event.target as HTMLElement

	if (!target.closest('.context-menu')) showMenu.value = false
}

onMounted(() => document.addEventListener('click', handleOutsideClick))

onUnmounted(() => document.removeEventListener('click', handleOutsideClick))
</script>

<template>
	<div class="equipment-wrapper">
		<div v-if="selectedItem && isLastChild(selectedItem) && props.selectedItem?.id.length === 9" class="equipment">
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
					</tr>
				</tbody>
			</table>
			<UiButton type="button" @click="showContextMenu($event, null)">Добавить оборудование</UiButton>
		</div>
		<div v-else class="no-equipment">Кликни по последнему элементу дерева</div>

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

	@include mobile {
		padding: 10px;
	}

	h2 {
		margin-bottom: 20px;
		font-size: 24px;
		text-align: center;

		@include tablet {
			font-size: 16px;
		}
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

			@include tablet {
				font-size: 14px;
			}
		}

		tr:nth-child(even) {
			background-color: #f9f9f9;
		}

		tr {
			@include hover {
				&:hover {
					background-color: #f1f1f1;
				}
			}
		}

		td {
			@include mobile {
				font-size: 13px;
			}
		}
	}
}

.no-equipment {
	margin-bottom: 20px;
	text-align: center;
	color: #999;

	@include tablet {
		font-size: 14px;
	}
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
