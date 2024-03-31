'use client'

import { useCartStore } from '@/store'
import { IoCartOutline } from 'react-icons/io5'
import CartDrawer from './CartDrawer'

export default function Cart() {
  const useStore = useCartStore()
  return (
    <>
      <div
        onClick={() => useStore.toggleCart()}
        className="flex items-center cursor-pointer relative"
      >
        <IoCartOutline className="h-7 w-7 " />
        <span className="bg-teal-600 text-sm font-bold rounded-full h-5 w-5 flex items-center justify-center absolute left-4 bottom-4">
          {useStore.cart?.length}
        </span>
      </div>

      {useStore.isOpen && <CartDrawer />}
    </>
  )
}
