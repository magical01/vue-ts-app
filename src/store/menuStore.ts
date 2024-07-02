import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * Модуль для управления видимостью меню.
 */
export const useMenuStore = defineStore('menu', () => {
	/**
	 * Состояние видимости меню.
	 * @type {Ref<boolean>}
	 */
	const isMenuVisible = ref<boolean>(true)

	/**
	 * Переключает состояние видимости меню.
	 */
	function toggleMenu() {
		isMenuVisible.value = !isMenuVisible.value
	}

	return { isMenuVisible, toggleMenu }
})
