import { UserState } from './UserState'

export interface AuthState {
	user: UserState | null
	token: string | null
}
