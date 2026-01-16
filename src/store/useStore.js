import { create } from 'zustand'

export const useStore = create((set) => ({
  // Switch color state
  switchColor: 'red',
  setSwitchColor: (color) => set({ switchColor: color }),

  // Auto rotate state
  autoRotate: true,
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),

  // Explode animation amount (0-1)
  explodeAmount: 0,
  setExplodeAmount: (amount) => set({ explodeAmount: amount }),

  // Loading state
  isLoaded: false,
  setLoaded: (loaded) => set({ isLoaded: loaded }),

  // Cart state
  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (id) => set((state) => ({ 
    cart: state.cart.filter((item) => item.id !== id) 
  })),
  clearCart: () => set({ cart: [] })
}))
