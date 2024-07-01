import { Attributes } from './Attributes'

export interface TreeItem {
	id: string
	name: string
	children?: TreeItem[]
	attributes?: Attributes
}
