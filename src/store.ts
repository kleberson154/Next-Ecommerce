import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProductType } from './types/ProductType'

type CartState = {
  cart: ProductType[]
  addProduct: (product: ProductType) => void
  // removeProduct: (productId: string) => void
  isOpen: boolean
  toggleCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    set => ({
      cart: [],
      isOpen: false,
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
      addProduct: item =>
        set(state => {
          const product = state.cart.find(p => p.id === item.id)
          if (product) {
            const updatedCart = state.cart.map(p => {
              if (p.id === item.id) {
                return { ...p, quantity: p.quantity ? p.quantity + 1 : 1 }
              }
              return p
            })
            return { cart: updatedCart }
          } else {
            return { cart: [...state.cart, { ...item, quantity: 1 }] }
          }
        })
      // removeProduct: (productId: string) => set((state) => ({ cart: state.cart.filter((product) => product.id !== productId) }))
    }),
    { name: 'cart-storage' }
  )
)
