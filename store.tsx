"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus, Star, Heart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  rating: number
  description: string
  originalPrice?: number
}

interface CartItem extends Product {
  quantity: number
}

const products: Product[] = [
  {
    id: 1,
    name: "هاتف ذكي متطور",
    price: 2500,
    originalPrice: 3000,
    image: "/placeholder.svg?height=300&width=300",
    category: "إلكترونيات",
    rating: 4.5,
    description: "هاتف ذكي بمواصفات عالية وكاميرا متقدمة",
  },
  {
    id: 2,
    name: "حقيبة يد أنيقة",
    price: 450,
    image: "/placeholder.svg?height=300&width=300",
    category: "أزياء",
    rating: 4.8,
    description: "حقيبة يد جلدية فاخرة بتصميم عصري",
  },
  {
    id: 3,
    name: "ساعة رياضية ذكية",
    price: 800,
    originalPrice: 950,
    image: "/placeholder.svg?height=300&width=300",
    category: "إلكترونيات",
    rating: 4.3,
    description: "ساعة ذكية لتتبع اللياقة البدنية والصحة",
  },
  {
    id: 4,
    name: "كتاب الطبخ العربي",
    price: 120,
    image: "/placeholder.svg?height=300&width=300",
    category: "كتب",
    rating: 4.7,
    description: "مجموعة شاملة من وصفات الطبخ العربي التقليدي",
  },
  {
    id: 5,
    name: "سماعات لاسلكية",
    price: 350,
    image: "/placeholder.svg?height=300&width=300",
    category: "إلكترونيات",
    rating: 4.4,
    description: "سماعات عالية الجودة مع إلغاء الضوضاء",
  },
  {
    id: 6,
    name: "عطر فاخر",
    price: 280,
    image: "/placeholder.svg?height=300&width=300",
    category: "عطور",
    rating: 4.6,
    description: "عطر فرنسي فاخر برائحة مميزة وثابتة",
  },
]

const categories = ["الكل", "إلكترونيات", "أزياء", "كتب", "عطور"]

export default function Component() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<number[]>([])

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "الكل" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId)
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
      }
      return prevCart.filter((item) => item.id !== productId)
    })
  }

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <h1 className="text-2xl font-bold text-gray-900">متجري</h1>
              <Badge variant="secondary">متجر إلكتروني</Badge>
            </div>

            <div className="hidden md:flex items-center space-x-4 space-x-reverse flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="ابحث عن المنتجات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

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
              <SheetContent side="left" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>سلة التسوق</SheetTitle>
                  <SheetDescription>لديك {getTotalItems()} عنصر في السلة</SheetDescription>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">السلة فارغة</p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 space-x-reverse border-b pb-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.price} ريال</p>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button variant="outline" size="sm" onClick={() => addToCart(item)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>المجموع:</span>
                          <span>{getTotalPrice()} ريال</span>
                        </div>
                        <Button className="w-full mt-4" size="lg">
                          إتمام الشراء
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-3 bg-white border-b">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="ابحث عن المنتجات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 space-x-reverse py-4 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 left-2 p-2"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </Button>
                {product.originalPrice && (
                  <Badge className="absolute top-2 right-2" variant="destructive">
                    خصم
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-lg font-bold text-gray-900">{product.price} ريال</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice} ريال</span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => addToCart(product)}>
                  <ShoppingCart className="h-4 w-4 ml-2" />
                  أضف للسلة
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد منتجات تطابق البحث</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">متجري</h3>
              <p className="text-gray-400">متجرك الإلكتروني المفضل للتسوق الآمن والسريع</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400">
                <li>عن المتجر</li>
                <li>اتصل بنا</li>
                <li>الشحن والتوصيل</li>
                <li>سياسة الإرجاع</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">الفئات</h4>
              <ul className="space-y-2 text-gray-400">
                <li>إلكترونيات</li>
                <li>أزياء</li>
                <li>كتب</li>
                <li>عطور</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">تابعنا</h4>
              <p className="text-gray-400 mb-4">اشترك في النشرة الإخبارية للحصول على أحدث العروض</p>
              <div className="flex space-x-2 space-x-reverse">
                <Input placeholder="بريدك الإلكتروني" className="flex-1" />
                <Button>اشتراك</Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 متجري. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
