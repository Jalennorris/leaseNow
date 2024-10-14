import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface StoreState {
  propertyId: string | null
  setPropertyId: (id: string) => void
  clearPropertyId: () => void
  getPropertyId: () => string | null
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      propertyId: null,
      setPropertyId: (id: string) => set({ propertyId: id }),
      clearPropertyId: () => set({ propertyId: null }),
      getPropertyId: () => get().propertyId,
    }),
    {
      name: 'property-storage', // Name of the storage key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useStore