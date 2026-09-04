import { createContext, useContext, useMemo, useReducer, useState } from "react";

/**
 * Cart state lives in a reducer rather than scattered useState calls so that
 * every mutation is one named, testable action. Nothing is persisted to browser
 * storage, which keeps the demo deterministic on every reload.
 */
const CartContext = createContext(null);

function cartReducer(items, action) {
  switch (action.type) {
    case "add": {
      const { product, size } = action;
      const existing = items.find(
        (item) => item.id === product.id && item.size === size
      );
      if (existing) {
        return items.map((item) =>
          item === existing ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          qty: 1,
        },
      ];
    }
    case "increment":
      return items.map((item, index) =>
        index === action.index ? { ...item, qty: item.qty + 1 } : item
      );
    case "decrement":
      return items
        .map((item, index) =>
          index === action.index ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0);
    case "remove":
      return items.filter((_, index) => index !== action.index);
    case "clear":
      return [];
    default:
      return items;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState("");

  const value = useMemo(() => {
    const count = items.reduce((total, item) => total + item.qty, 0);
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );

    function notify(message) {
      setToast(message);
      window.setTimeout(() => setToast(""), 2400);
    }

    return {
      items,
      count,
      subtotal,
      isOpen,
      toast,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      notify,
      add: (product, size = product.sizes?.[1] ?? "M") => {
        dispatch({ type: "add", product, size });
        notify(`${product.name} added to your bag`);
      },
      increment: (index) => dispatch({ type: "increment", index }),
      decrement: (index) => dispatch({ type: "decrement", index }),
      remove: (index) => dispatch({ type: "remove", index }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [items, isOpen, toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
}
