import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProductType } from './types/ProductType'

type CartState = {
  cart: ProductType[]
  // addToCart: (product: ProductType) => void
  // removeFromCart: (productId: string) => void
  isOpen: boolean
  toggleCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    set => ({
      cart: [],
      isOpen: false,
      toggleCart: () => set(state => ({ isOpen: !state.isOpen }))
      // addToCart: (product: ProductType) => set((state) => ({ cart: [...state.cart, product] })),
      // removeFromCart: (productId: string) => set((state) => ({ cart: state.cart.filter((product) => product.id !== productId) }))
    }),
    { name: 'cart-storage' }
  )
)
