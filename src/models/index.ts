// Importing from this barrel registers every model with mongoose,
// which is required for .populate() refs to resolve.
export { default as Product } from './Product'
export { default as Category } from './Category'
export { default as Subcategory } from './Subcategory'
export { default as Order } from './Order'
export { default as User } from './User'
export { default as Contact } from './Contact'

export type { IProduct } from './Product'
export type { ICategory } from './Category'
export type { ISubcategory } from './Subcategory'
export type { IOrder, IOrderItem } from './Order'
export type { IUser } from './User'
export type { IContact } from './Contact'
