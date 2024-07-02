import { defineStore } from 'pinia'
import { ref } from 'vue'

import { TreeItem } from '../interfaces/TreeItem'

/**
 * Модуль для управления древовидной структурой элементов.
 * @module useTreeStore
 */

/**
 * Создает store для управления деревом элементов.
 * @returns {Object} Store дерева элементов с состоянием и методами.
 */
export const useTreeStore = defineStore('tree', () => {
	/**
	 * Состояние дерева элементов.
	 * @type {import('vue').Ref<TreeItem[]>}
	 */
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
										{ id: '1-1-1-1-1', name: 'Подъезд 1', attributes: { capacity: 10 }, children: [] },
										{ id: '1-1-1-1-2', name: 'Подъезд 2', attributes: { capacity: 30 }, children: [] }
									]
								},
								{
									id: '1-1-1-2',
									name: 'Дом 2',
									attributes: { builtYear: 2000 },
									children: [
										{ id: '1-1-1-2-1', name: 'Подъезд 1', attributes: { capacity: 25 }, children: [] },
										{ id: '1-1-1-2-2', name: 'Подъезд 2', attributes: { capacity: 38 }, children: [] }
									]
								}
							]
						},
						{
							id: '1-1-2',
							name: 'Улица B',
							attributes: { length: '500m' },
							children: []
						}
					]
				},
				{
					id: '1-2',
					name: 'Район 2',
					attributes: { population: 5000 },
					children: []
				}
			]
		}
	])

	/**
	 * Добавляет новый элемент к родительскому элементу.
	 * @param {string} parentId - Идентификатор родительского элемента.
	 * @param {Omit<TreeItem, 'id'>} newItem - Новый элемент без идентификатора.
	 */
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

	/**
	 * Обновляет элемент по его идентификатору.
	 * @param {string} id - Идентификатор элемента.
	 * @param {Partial<TreeItem>} updatedItem - Обновленные данные элемента.
	 */
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

	/**
	 * Удаляет элемент по его идентификатору.
	 * @param {string} id - Идентификатор элемента.
	 */
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

	/**
	 * Возвращает дочерние элементы для заданного элемента.
	 * @param {string} itemId - Идентификатор элемента.
	 * @returns {TreeItem[]} Массив дочерних элементов.
	 */
	function getChildren(itemId: string): TreeItem[] {
		const item = findItemById(itemId)
		return item && item.children ? item.children : []
	}

	/**
	 * Находит элемент по его идентификатору.
	 * @param {string} itemId - Идентификатор элемента.
	 * @returns {TreeItem | undefined} Найденный элемент или undefined, если элемент не найден.
	 */
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

	/**
	 * Перемещает элемент дерева в новую позицию.
	 * @param {string} draggedItemId - ID перетаскиваемого элемента.
	 * @param {string} targetItemId - ID целевого элемента, к которому будет добавлен перетаскиваемый элемент.
	 */
	function moveItem(draggedItemId: string, targetItemId: string) {
		const draggedItem = findItemById(draggedItemId)
		const targetItem = findItemById(targetItemId)

		if (!draggedItem || !targetItem) return

		deleteItem(draggedItemId)

		if (!targetItem.children) targetItem.children = []
		targetItem.children.push(draggedItem)
	}

	return { items, addItem, updateItem, deleteItem, getChildren, moveItem, findItemById }
})
