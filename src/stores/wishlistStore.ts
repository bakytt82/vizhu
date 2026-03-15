import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface WishlistStore {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product) => {
        const items = get().items;
        const exists = items.some((item) => item.id === product.id);
        if (exists) {
          set({ items: items.filter((item) => item.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    { name: 'vizhu-wishlist' }
  )
);
