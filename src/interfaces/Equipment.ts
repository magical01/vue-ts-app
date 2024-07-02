/**
 * Представляет оборудование.
 * @typedef {Object} Equipment
 * @property {string} id - Уникальный идентификатор оборудования.
 * @property {string} name - Название оборудования.
 * @property {string} type - Тип оборудования.
 * @property {string} installationDate - Дата установки оборудования.
 */
export interface Equipment {
	id: string
	name: string
	type: string
	installationDate: string
}
