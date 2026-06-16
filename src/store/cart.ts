import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string             // MongoDB _id as string
  productId: string      // MongoDB _id as string
  code?: string          // product code, e.g. "FI1"
  name: string
  price: number
  shippingCharge?: number
  originalPrice?: number
  image: string
  category: string
  quantity: number
  brand: string
}

interface CartStore {
  items: CartItem[]
  savedItems: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, quantity: number) => void
  clearCart: () => void
  total: () => number
  shippingTotal: () => number
  count: () => number
  saveForLater: (productId: string) => void
  moveToCart: (productId: string) => void
  removeSavedItem: (productId: string) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      addItem: (item) => {
        const existing = get().items.find(i => i.productId === item.productId)
        if (existing) {
          set(s => ({ items: s.items.map(i =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
          )}))
        } else {
          set(s => ({ items: [...s.items, { ...item, quantity: 1 }] }))
        }
      },
      removeItem: (productId) =>
        set(s => ({ items: s.items.filter(i => i.productId !== productId) })),
      updateQty: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set(s => ({ items: s.items.map(i =>
          i.productId === productId ? { ...i, quantity } : i
        )}))
      },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      shippingTotal: () => get().items.reduce((s, i) => s + (i.shippingCharge || 0) * i.quantity, 0),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
      
      saveForLater: (productId) => {
        const item = get().items.find(i => i.productId === productId)
        if (item) {
          set(s => ({
            items: s.items.filter(i => i.productId !== productId),
            savedItems: [...s.savedItems, { ...item, quantity: 1 }] // Reset quantity when saving for later
          }))
        }
      },
      moveToCart: (productId) => {
        const item = get().savedItems.find(i => i.productId === productId)
        if (item) {
          set(s => {
            const existingInCart = s.items.find(i => i.productId === productId)
            let newItems = s.items
            if (existingInCart) {
              newItems = s.items.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i)
            } else {
              newItems = [...s.items, { ...item, quantity: 1 }]
            }
            return {
              savedItems: s.savedItems.filter(i => i.productId !== productId),
              items: newItems
            }
          })
        }
      },
      removeSavedItem: (productId) =>
        set(s => ({ savedItems: s.savedItems.filter(i => i.productId !== productId) })),
    }),
    { name: 'fortune-india-cart' }
  )
)
