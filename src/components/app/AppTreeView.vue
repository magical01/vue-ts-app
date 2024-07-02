<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

import { useTreeStore } from '../../store/treeStore'

import UiContextMenu from '../ui/UiContextMenu.vue'
import UiModal from '../ui/UiModal.vue'
import UiButton from '../ui/UiButton.vue'
import UiInput from '../ui/UiInput.vue'

import { TreeItem } from '../../interfaces/TreeItem'

const treeStore = useTreeStore()

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
 * Выбранный элемент дерева.
 * @type {Ref<TreeItem | null>}
 */
const selectedItem = ref<TreeItem | null>(null)

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
 * @type {Ref<Partial<TreeItem>>}
 */
const formData = ref<Partial<TreeItem>>({})

/**
 * Ссылка на перетаскиваемый элемент дерева.
 * @type {import('vue').Ref<TreeItem | null>}
 */
const draggedItem = ref<TreeItem | null>(null)
/**
 * Ссылка на элемент дерева, над которым в данный момент находится перетаскиваемый элемент.
 * @type {import('vue').Ref<TreeItem | null>}
 */
const dragOverItem = ref<TreeItem | null>(null)

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
 * Элементы дерева.
 * @type {ComputedRef<TreeItem[]>}
 */
const treeItems = computed(() => treeStore.items)

/**
 * Плоский список элементов дерева.
 * @type {ComputedRef<Array<{ item: TreeItem, level: number }>>}
 */
const flattenedItems = computed(() => flattenTree(treeItems.value.map((item) => ({ item, level: 0 }))))

const emit = defineEmits(['item-selected'])

/**
 * Выбирает элемент дерева.
 * @param {TreeItem} item - Элемент дерева.
 */
function selectItem(item: TreeItem) {
	emit('item-selected', item)
}
/**
 * Преобразует дерево в плоский список.
 * @param {Array} tree - Дерево.
 * @returns {Array} Плоский список элементов дерева.
 */
const flattenTree = (tree: any) => {
	const stack = [...tree]
	const result = []

	while (stack.length > 0) {
		const { item, level } = stack.pop()
		result.push({ ...item, level })

		if (item.children && item.children.length > 0) {
			for (let i = item.children.length - 1; i >= 0; i--) {
				stack.push({ item: item.children[i], level: level + 1 })
			}
		}
	}

	return result
}

/**
 * Обработчик начала перетаскивания элемента.
 * @param {DragEvent} event - Событие начала перетаскивания.
 * @param {TreeItem} item - Перетаскиваемый элемент дерева.
 */
function onDragStart(event: DragEvent, item: TreeItem) {
	draggedItem.value = item
	if (event.dataTransfer) {
		event.dataTransfer.effectAllowed = 'move'
		event.dataTransfer.setData('text/plain', item.id)
	}
}

/**
 * Обработчик перетаскивания элемента над другим элементом.
 * @param {DragEvent} event - Событие перетаскивания.
 * @param {TreeItem} item - Элемент дерева, над которым происходит перетаскивание.
 */
function onDragOver(event: DragEvent, item: TreeItem) {
	event.preventDefault()
	dragOverItem.value = item
}

/**
 * Обработчик сброса перетаскиваемого элемента.
 * @param {DragEvent} event - Событие сброса.
 * @param {TreeItem} targetItem - Целевой элемент дерева, на который происходит сброс.
 */
function onDrop(event: DragEvent, targetItem: TreeItem) {
	event.preventDefault()
	if (draggedItem.value && draggedItem.value !== targetItem) {
		treeStore.moveItem(draggedItem.value.id, targetItem.id)
	}
	draggedItem.value = null
	dragOverItem.value = null
}

/**
 * Обработчик начала касания элемента на сенсорном устройстве.
 * @param {TreeItem} item - Элемент дерева, которого коснулись.
 */
function onTouchStart(item: TreeItem) {
	draggedItem.value = item
}

/**
 * Обработчик перемещения касания по экрану.
 * @param {TouchEvent} event - Событие перемещения касания.
 */
function onTouchMove(event: TouchEvent) {
	event.preventDefault()
	const touch = event.touches[0]
	const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY)
	const treeItem = elementsAtPoint.find((el): el is HTMLElement => el instanceof HTMLElement && el.classList.contains('tree-view__item'))
	if (treeItem) {
		const itemId = treeItem.getAttribute('data-item-id')
		if (itemId) {
			const foundItem = treeStore.findItemById(itemId)
			if (foundItem) dragOverItem.value = foundItem
		}
	}
}

/**
 * Обработчик окончания касания на сенсорном устройстве.
 */
function onTouchEnd() {
	if (draggedItem.value && dragOverItem.value && draggedItem.value !== dragOverItem.value) {
		treeStore.moveItem(draggedItem.value.id, dragOverItem.value.id)
	}
	draggedItem.value = null
	dragOverItem.value = null
}

/**
 * Показывает контекстное меню.
 * @param {MouseEvent} event - Событие мыши.
 * @param {TreeItem} item - Элемент дерева.
 */
function showContextMenu(event: MouseEvent, item: TreeItem) {
	menuPosition.value = { x: event.clientX, y: event.clientY }
	selectedItem.value = item
	showMenu.value = true
}

/**
 * Обрабатывает действие контекстного меню.
 * @param {string} action - Действие.
 */
function handleMenuAction(action: string) {
	showMenu.value = false
	if (selectedItem.value === null) return

	switch (action) {
		case 'add':
			modalTitle.value = 'Добавить элемент'
			formData.value = {
				name: '',
				attributes: {
					test: 'test'
				}
			}
			showModal.value = true
			break
		case 'edit':
			modalTitle.value = 'Изменить элемент'
			formData.value = {
				name: selectedItem.value.name,
				attributes: Object.entries(selectedItem.value.attributes || {}).reduce(
					(acc, [key, value]) => {
						acc[key] = String(value)
						return acc
					},
					{} as Record<string, string>
				)
			}
			showModal.value = true
			break
		case 'delete':
			treeStore.deleteItem(selectedItem.value.id)
			break
	}
}

/**
 * Отправляет форму.
 */
function submitForm() {
	if (selectedItem.value === null) return

	if (modalTitle.value === 'Добавить элемент') {
		const newItem: Omit<TreeItem, 'id'> = {
			name: formData.value.name || '',
			attributes: formData.value.attributes || {},
			children: []
		}
		treeStore.addItem(selectedItem.value.id, newItem)
	} else {
		treeStore.updateItem(selectedItem.value.id, formData.value)
	}
	closeModal()
}

/**
 * Закрывает модальное окно.
 */
function closeModal() {
	showModal.value = false
	formData.value = { name: '' }
}

/**
 * Обрабатывает клик вне контекстного меню.
 */
function handleOutsideClick() {
	if (showMenu.value) showMenu.value = false
}

onMounted(() => document.addEventListener('click', handleOutsideClick))

onUnmounted(() => document.removeEventListener('click', handleOutsideClick))
</script>

<template>
	<div class="tree-view" @touchmove="onTouchMove" @touchend="onTouchEnd">
		<ul class="tree-view__list">
			<template v-for="item in flattenedItems" :key="item.id">
				<li
					:class="[`tree-view__item level-${item.level}`, { 'drag-over': dragOverItem === item }]"
					:data-item-id="item.id"
					draggable="true"
					@dragstart="onDragStart($event, item)"
					@dragover="onDragOver($event, item)"
					@drop="onDrop($event, item)"
					@touchstart="onTouchStart(item)"
				>
					<span @click="selectItem(item)" @contextmenu.prevent="showContextMenu($event, item)" class="tree-view__item-name">
						{{ item.name }}
					</span>
					<template v-if="Object.keys(item.attributes!).length">
						<div v-for="(value, key) in item.attributes" :key="key" class="tree-view__attribute">
							<strong>{{ key }}:</strong> {{ value }}
						</div>
					</template>
				</li>
			</template>
		</ul>
		<UiContextMenu v-if="showMenu" :position="menuPosition" :actions="menuActions" @select="handleMenuAction" />
		<UiModal v-if="showModal" @close="closeModal">
			<template #header>{{ modalTitle }}</template>
			<template #body>
				<form @submit.prevent="submitForm" class="modal__form">
					<div>
						<label>Название:</label>
						<UiInput v-model="formData.name" placeholder="Название" required />
					</div>
					<template v-if="Object.keys(formData.attributes!).length">
						<h3>Атрибуты:</h3>
						<div v-for="(value, key) in formData.attributes" :key="key">
							<label>{{ key }}:</label>
							<UiInput
								:model-value="String(value)"
								@update:model-value="(newValue) => (formData.attributes![key] = newValue)"
								:placeholder="String(key)"
							/>
						</div>
					</template>
					<UiButton type="submit">Сохранить</UiButton>
				</form>
			</template>
		</UiModal>
	</div>
</template>

<style lang="scss" scoped>
.tree-view {
	margin-bottom: 32px;

	&__list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__item {
		border: 1px solid $gray;
		border-radius: 5px;
		padding: 10px;
		background-color: #f9f9f9;
		transition: background-color $base-transition;
		cursor: move;

		@include hover {
			&:hover {
				background-color: #f1f1f1;
			}
		}
	}

	&__item-name {
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
		color: $black;
		transition: color $base-transition;

		@include hover {
			&:hover {
				color: $primary;
			}
		}

		@include tablet {
			font-size: 14px;
		}
	}

	&__attribute {
		margin-left: 20px;
		margin-top: 5px;
		font-size: 14px;
		color: #555;

		@include tablet {
			font-size: 12px;
		}
	}
}

.drag-over {
	border: 2px dashed #007bff;
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

.level-0 {
	margin-left: 0;
}

.level-1 {
	margin-left: 100px;

	@include tablet {
		margin-left: 50px;
	}

	@include mobile {
		margin-left: 30px;
	}
}

.level-2 {
	margin-left: 200px;

	@include tablet {
		margin-left: 100px;
	}

	@include mobile {
		margin-left: 60px;
	}
}

.level-3 {
	margin-left: 300px;

	@include tablet {
		margin-left: 150px;
	}

	@include mobile {
		margin-left: 90px;
	}
}

.level-4 {
	margin-left: 400px;

	@include tablet {
		margin-left: 200px;
	}

	@include mobile {
		margin-left: 120px;
	}
}
</style>
