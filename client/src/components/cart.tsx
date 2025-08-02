import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

interface CartDialogProps {
  children: React.ReactNode;
}

export function CartDialog({ children }: CartDialogProps) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
  } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleQuantityChange = (recipeId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(recipeId);
    } else {
      updateQuantity(recipeId, newQuantity);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Recipe Collection ({getTotalItems()} items)</span>
            {cartItems.length > 0 && (
              <Button
                onClick={clearCart}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Clear All
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h1.05a1 1 0 01.95.69l.59 2.15a1 1 0 00.95.69h6.9a1 1 0 00.95-.69l.59-2.15a1 1 0 01.95-.69H17a1 1 0 110 2h-.76l-.77 2.8a3 3 0 01-2.84 2.2H7.37a3 3 0 01-2.84-2.2L3.76 6H3a1 1 0 01-1-1z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your Recipe Collection is Empty
            </h3>
            <p className="text-gray-500">
              Start adding some delicious recipes to your collection!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start space-x-4 p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      Chef: {item.chef}
                    </span>
                    <span className="text-sm text-gray-500">
                      ⏱️ {item.cookingTime}
                    </span>
                    <span className="text-sm text-gray-500">
                      👥 {item.servings} servings
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {item.category}
                    </span>
                    {item.dietaryRestrictions.map((restriction) => (
                      <span
                        key={restriction}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {restriction}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                  <Button
                    onClick={() => removeFromCart(item.id)}
                    variant="outline"
                    size="sm"
                    className="ml-2 text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">
                  Total Recipes: {getTotalItems()}
                </span>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Start Cooking! 👨‍🍳
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
