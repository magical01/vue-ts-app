import { Attributes } from './Attributes'

/**
 * Представляет элемент древовидной структуры.
 * @typedef {Object} TreeItem
 * @property {string} id - Уникальный идентификатор элемента.
 * @property {string} name - Имя элемента.
 * @property {TreeItem[]} [children] - Дочерние элементы.
 * @property {Attributes} [attributes] - Дополнительные атрибуты элемента.
 */
export interface TreeItem {
	id: string
	name: string
	children?: TreeItem[]
	attributes?: Attributes
}
