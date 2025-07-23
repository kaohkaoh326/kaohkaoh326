"use client"

import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { CartItem } from "../types"

interface CartSidebarProps {
  cart: CartItem[]
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemoveItem: (productId: number) => void
  onCheckout: () => void
}

export function CartSidebar({ cart, onUpdateQuantity, onRemoveItem, onCheckout }: CartSidebarProps) {
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getShippingCost = () => {
    const total = getTotalPrice()
    return total > 500 ? 0 : 25 // شحن مجاني للطلبات أكثر من 500 ريال
  }

  const getFinalTotal = () => {
    return getTotalPrice() + getShippingCost()
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <ShoppingCart className="h-4 w-4 ml-2" />
          السلة
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -left-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px]" dir="rtl">
        <SheetHeader>
          <SheetTitle>سلة التسوق</SheetTitle>
          <SheetDescription>
            {getTotalItems() === 0 ? "السلة فارغة" : `لديك ${getTotalItems()} عنصر في السلة`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-full">
          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">السلة فارغة</p>
                <p className="text-gray-400 text-sm">ابدأ بإضافة بعض المنتجات</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 space-x-reverse border-b pb-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-1">{item.brand}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.price} ريال</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>المجموع الفرعي:</span>
                    <span>{getTotalPrice()} ريال</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>الشحن:</span>
                    <span className={getShippingCost() === 0 ? "text-green-600" : ""}>
                      {getShippingCost() === 0 ? "مجاني" : `${getShippingCost()} ريال`}
                    </span>
                  </div>
                  {getShippingCost() > 0 && (
                    <p className="text-xs text-gray-500">أضف {500 - getTotalPrice()} ريال للحصول على شحن مجاني</p>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>المجموع الكلي:</span>
                    <span>{getFinalTotal()} ريال</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={onCheckout}>
                  إتمام الشراء
                </Button>

                <p className="text-xs text-center text-gray-500">الضرائب محسوبة عند الدفع</p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
