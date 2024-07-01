import { defineStore } from 'pinia'
import { ref } from 'vue'

import { Equipment } from '../interfaces/Equipment'

export const useEquipmentStore = defineStore('equipment', () => {
	const equipment = ref<Record<string, Equipment[]>>({})

	function addEquipment(itemId: string, newEquipment: Omit<Equipment, 'id'>) {
		if (!equipment.value[itemId]) {
			equipment.value[itemId] = []
		}
		const id = `${itemId}-equip-${equipment.value[itemId].length + 1}`
		equipment.value[itemId].push({ id, ...newEquipment })
	}

	function updateEquipment(itemId: string, equipmentId: string, updatedEquipment: Partial<Equipment>) {
		const index = equipment.value[itemId].findIndex((e) => e.id === equipmentId)

		if (index !== -1) {
			equipment.value[itemId][index] = { ...equipment.value[itemId][index], ...updatedEquipment }
		}
	}

	function deleteEquipment(itemId: string, equipmentId: string) {
		equipment.value[itemId] = equipment.value[itemId].filter((e) => e.id !== equipmentId)
	}

	function getEquipment(itemId: string): Equipment[] {
		return equipment.value[itemId] || []
	}

	return { addEquipment, updateEquipment, deleteEquipment, getEquipment }
})
