import { UserMock } from '../interfaces/UserMock'

// Инициализация пользователей из localStorage
let users: UserMock[] = JSON.parse(localStorage.getItem('users') || '[]')

/**
 * Сохраняет текущий список пользователей в localStorage.
 */
const saveUsers = () => localStorage.setItem('users', JSON.stringify(users))

/**
 * Выполняет вход пользователя.
 * @param {string} username - Имя пользователя.
 * @param {string} password - Пароль пользователя.
 * @returns {Promise<string>} Возвращает токен аутентификации в случае успеха.
 * @throws {Error} Если имя пользователя или пароль неверны.
 */
export async function mockLogin(username: string, password: string): Promise<string> {
	const user = users.find((u) => u.username === username && u.password === password)
	if (user) return btoa(`${username}:${password}`)
	else throw new Error('Неверное имя пользователя или пароль')
}

/**
 * Регистрирует нового пользователя.
 * @param {string} username - Имя пользователя.
 * @param {string} password - Пароль пользователя.
 * @returns {Promise<string>} Возвращает токен аутентификации в случае успеха.
 * @throws {Error} Если пользователь с таким именем уже существует.
 */
export async function mockRegister(username: string, password: string): Promise<string> {
	const userExists = users.some((u) => u.username === username)

	if (userExists) throw new Error('Пользователь уже существует')
	else {
		users.push({ username, password })
		saveUsers()
		return btoa(`${username}:${password}`)
	}
}
