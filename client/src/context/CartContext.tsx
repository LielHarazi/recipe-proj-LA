import React, { createContext, useContext, useState, useEffect } from "react";
import type { recipe } from "@/types";

interface CartItem extends recipe {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (recipe: recipe) => void;
  removeFromCart: (recipeId: string) => void;
  updateQuantity: (recipeId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("recipeCart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recipeCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (recipe: recipe) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === recipe.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === recipe.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...recipe, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (recipeId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== recipeId)
    );
  };

  const updateQuantity = (recipeId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(recipeId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === recipeId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
