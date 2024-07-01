<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

import { useTreeStore } from '../../store/treeStore'

import UiContextMenu from '../ui/UiContextMenu.vue'
import UiModal from '../ui/UiModal.vue'
import UiButton from '../ui/UiButton.vue'
import UiInput from '../ui/UiInput.vue'
// import UiTreeItem from '../ui/UiTreeItem.vue'

import { TreeItem } from '../../interfaces/TreeItem'

const treeStore = useTreeStore()

const showMenu = ref<boolean>(false)
const menuPosition = ref({ x: 0, y: 0 })
const selectedItem = ref<TreeItem | null>(null)

const showModal = ref<boolean>(false)
const modalTitle = ref<string>('')
const formData = ref<Partial<TreeItem>>({})

const menuActions = [
	{ label: 'Добавить', action: 'add' },
	{ label: 'Изменить', action: 'edit' },
	{ label: 'Удалить', action: 'delete' }
]

const treeItems = computed(() => treeStore.items)

const flattenedItems = computed(() => flattenTree(treeItems.value.map((item) => ({ item, level: 0 }))))

const emit = defineEmits(['item-selected'])

function selectItem(item: TreeItem) {
	emit('item-selected', item)
}

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

function showContextMenu(event: MouseEvent, item: TreeItem) {
	menuPosition.value = { x: event.clientX, y: event.clientY }
	selectedItem.value = item
	showMenu.value = true
	console.log('Selected item:', selectedItem.value)
}

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

function closeModal() {
	showModal.value = false
	formData.value = { name: '' }
}

function handleOutsideClick() {
	if (showMenu.value) showMenu.value = false
}

onMounted(() => document.addEventListener('click', handleOutsideClick))

onUnmounted(() => document.removeEventListener('click', handleOutsideClick))
</script>

<template>
	<div class="tree-view">
		<ul class="list">
			<template v-for="item in flattenedItems" :key="item.id">
				<li class="list-item" :class="`level-${item.level}`">
					<span @click="selectItem(item)" @contextmenu.prevent="showContextMenu($event, item)" class="item-name">
						{{ item.name }}
					</span>
					<template v-if="Object.keys(item.attributes!).length > 0">
						<div v-for="(value, key) in item.attributes" :key="key" class="attribute">
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
					<div v-if="Object.keys(formData.attributes!).length > 0">
						<h3>Атрибуты:</h3>
						<div v-for="(value, key) in formData.attributes" :key="key">
							<label>{{ key }}:</label>
							<UiInput
								:model-value="String(value)"
								@update:model-value="(newValue) => (formData.attributes![key] = newValue)"
								:placeholder="key"
							/>
						</div>
					</div>
					<UiButton type="submit">Сохранить</UiButton>
				</form>
			</template>
		</UiModal>
	</div>
</template>

<style lang="scss" scoped>
.tree-view {
	margin-bottom: 32px;

	.list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
}
.list-item {
	border: 1px solid $gray;
	border-radius: 5px;
	padding: 10px;
	// margin-bottom: 10px;
	background-color: #f9f9f9;
	transition: background-color $base-transition;

	@media (any-hover: hover) {
		&:hover {
			background-color: #f1f1f1;
		}
	}
}

.item-name {
	font-size: 18px;
	font-weight: bold;
	cursor: pointer;
	color: $black;
	transition: color $base-transition;

	@media (any-hover: hover) {
		&:hover {
			color: $primary;
		}
	}
}

.attribute {
	margin-left: 20px;
	margin-top: 5px;
	font-size: 14px;
	color: #555;
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
}

.level-2 {
	margin-left: 200px;
}

.level-3 {
	margin-left: 300px;
}

.level-4 {
	margin-left: 400px;
}
</style>
