import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  
  addItem: (barang) => {
    set((state) => {
      const existing = state.items.find((item) => item.id === barang.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === barang.id
              ? { ...item, qty: item.qty + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { ...barang, qty: 1 }] };
    });
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  updateQty: (id, qty) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, qty) } : item
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce((total, item) => total + (item.harga_jual * item.qty), 0);
  },
}));

export default useCartStore;
