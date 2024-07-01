import { defineStore } from 'pinia'
import { ref } from 'vue'

import { TreeItem } from '../interfaces/TreeItem'

export const useTreeStore = defineStore('tree', () => {
	const items = ref<TreeItem[]>([
		{
			id: '1',
			name: 'Город',
			attributes: { population: 10000 },
			children: [
				{
					id: '1-1',
					name: 'Район 1',
					attributes: { area: 500 },
					children: [
						{
							id: '1-1-1',
							name: 'Улица A',
							attributes: { length: '1km' },
							children: [
								{
									id: '1-1-1-1',
									name: 'Дом 1',
									attributes: { builtYear: 1990 },
									children: [
										{ id: '1-1-1-1-1', name: 'Подъезд 1', attributes: { capacity: 10 } },
										{ id: '1-1-1-1-2', name: 'Подъезд 2', attributes: { capacity: 30 } }
									]
								}
							]
						}
					]
				}
			]
		}
	])

	function addItem(parentId: string, newItem: Omit<TreeItem, 'id'>) {
		const addChild = (items: TreeItem[]): boolean => {
			for (let item of items) {
				if (item.id === parentId) {
					if (!item.children) {
						item.children = []
					}

					if (item.id.length >= 9) {
						alert('Невозможно создать')
						return true
					}
					const newId = `${parentId}-${item.children.length + 1}`
					item.children.push({ id: newId, ...newItem })
					return true
				}
				if (item.children && addChild(item.children)) {
					return true
				}
			}
			return false
		}

		addChild(items.value)
	}

	function updateItem(id: string, updatedItem: Partial<TreeItem>) {
		const updateInChildren = (items: TreeItem[]): boolean => {
			for (const item of items) {
				if (item.id === id) {
					if (updatedItem.attributes) {
						item.attributes = { ...item.attributes, ...updatedItem.attributes }
					}
					Object.assign(item, updatedItem)
					return true
				}
				if (item.children && updateInChildren(item.children)) return true
			}
			return false
		}

		updateInChildren(items.value)
	}

	function deleteItem(id: string) {
		const deleteFromChildren = (items: TreeItem[]): boolean => {
			for (let i = 0; i < items.length; i++) {
				if (items[i].id === id) {
					items.splice(i, 1)
					return true
				}
				if (items[i].children) {
					if (deleteFromChildren(items[i].children!)) {
						return true
					}
				}
			}
			return false
		}

		if (items.value) {
			deleteFromChildren(items.value)
		}
	}

	function getChildren(itemId: string): TreeItem[] {
		const item = findItemById(itemId)
		return item && item.children ? item.children : []
	}

	function findItemById(itemId: string): TreeItem | undefined {
		function search(items: TreeItem[]): TreeItem | undefined {
			for (const item of items) {
				if (item.id === itemId) {
					return item
				}
				if (item.children) {
					const found = search(item.children)
					if (found) {
						return found
					}
				}
			}
			return undefined
		}
		return search(items.value)
	}

	return { items, addItem, updateItem, deleteItem, getChildren }
})
