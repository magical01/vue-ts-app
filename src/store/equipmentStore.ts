import { defineStore } from 'pinia'
import { ref } from 'vue'

import { Equipment } from '../interfaces/Equipment'

/**
 * Модуль для управления оборудованием.
 * @module useEquipmentStore
 */

/**
 * Создает store для управления оборудованием.
 * @returns {Object} Store управления оборудованием с состоянием и методами.
 */
export const useEquipmentStore = defineStore('equipment', () => {
	/**
	 * Состояние оборудования, где ключ - это идентификатор элемента, а значение - массив оборудования.
	 * @type {import('vue').Ref<Record<string, Equipment[]>>}
	 */
	const equipment = ref<Record<string, Equipment[]>>({})

	/**
	 * Добавляет новое оборудование к элементу.
	 * @param {string} itemId - Идентификатор элемента.
	 * @param {Omit<Equipment, 'id'>} newEquipment - Новое оборудование без идентификатора.
	 */
	function addEquipment(itemId: string, newEquipment: Omit<Equipment, 'id'>) {
		if (!equipment.value[itemId]) {
			equipment.value[itemId] = []
		}
		const id = `${itemId}-equip-${equipment.value[itemId].length + 1}`
		equipment.value[itemId].push({ id, ...newEquipment })
	}

	/**
	 * Обновляет оборудование для заданного элемента.
	 * @param {string} itemId - Идентификатор элемента.
	 * @param {string} equipmentId - Идентификатор оборудования.
	 * @param {Partial<Equipment>} updatedEquipment - Обновленные данные оборудования.
	 */
	function updateEquipment(itemId: string, equipmentId: string, updatedEquipment: Partial<Equipment>) {
		const index = equipment.value[itemId].findIndex((e) => e.id === equipmentId)

		if (index !== -1) {
			equipment.value[itemId][index] = { ...equipment.value[itemId][index], ...updatedEquipment }
		}
	}

	/**
	 * Удаляет оборудование из заданного элемента.
	 * @param {string} itemId - Идентификатор элемента.
	 * @param {string} equipmentId - Идентификатор оборудования.
	 */
	function deleteEquipment(itemId: string, equipmentId: string) {
		equipment.value[itemId] = equipment.value[itemId].filter((e) => e.id !== equipmentId)
	}

	/**
	 * Возвращает оборудование для заданного элемента.
	 * @param {string} itemId - Идентификатор элемента.
	 * @returns {Equipment[]} Массив оборудования.
	 */
	function getEquipment(itemId: string): Equipment[] {
		return equipment.value[itemId] || []
	}

	return { addEquipment, updateEquipment, deleteEquipment, getEquipment }
})
