import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  bookID: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (book: { bookID: number; title: string; price: number }) => void;
  removeItem: (bookID: number) => void;
  updateQty: (bookID: number, qty: number) => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(book: { bookID: number; title: string; price: number }) {
    setItems(prev => {
      const existing = prev.find(i => i.bookID === book.bookID);
      if (existing) {
        return prev.map(i =>
          i.bookID === book.bookID ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  }

  function removeItem(bookID: number) {
    setItems(prev => prev.filter(i => i.bookID !== bookID));
  }

  function updateQty(bookID: number, qty: number) {
    if (qty <= 0) {
      removeItem(bookID);
    } else {
      setItems(prev =>
        prev.map(i => (i.bookID === bookID ? { ...i, quantity: qty } : i))
      );
    }
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
