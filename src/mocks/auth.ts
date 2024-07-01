import { UserMock } from '../interfaces/UserMock'

// Инициализация пользователей из localStorage
let users: UserMock[] = JSON.parse(localStorage.getItem('users') || '[]')

const saveUsers = () => localStorage.setItem('users', JSON.stringify(users))

export async function mockLogin(username: string, password: string): Promise<string> {
	const user = users.find((u) => u.username === username && u.password === password)
	if (user) return btoa(`${username}:${password}`)
	else throw new Error('Invalid username or password')
}

export async function mockRegister(username: string, password: string): Promise<string> {
	const userExists = users.some((u) => u.username === username)

	if (userExists) throw new Error('User already exists')
	else {
		users.push({ username, password })
		saveUsers()
		return btoa(`${username}:${password}`)
	}
}
