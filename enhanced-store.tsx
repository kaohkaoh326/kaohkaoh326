"use client"

import { useState, useMemo } from "react"
import { Search, Filter, SlidersHorizontal, Grid3X3, List, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import { ProductCard } from "./components/product-card"
import { QuickViewModal } from "./components/quick-view-modal"
import { CartSidebar } from "./components/cart-sidebar"
import { products, categories } from "./lib/data"
import type { Product, CartItem } from "./types"

type SortOption = "newest" | "price-low" | "price-high" | "rating" | "name"
type ViewMode = "grid" | "list"

export default function Component() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<number[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showOnlyOnSale, setShowOnlyOnSale] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  // Get unique brands
  const brands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand)))
  }, [])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || categories.find((c) => c.id === selectedCategory)?.name === product.category
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
      const matchesStock = !showOnlyInStock || product.stock > 0
      const matchesSale = !showOnlyOnSale || product.originalPrice

      return matchesCategory && matchesSearch && matchesPrice && matchesBrand && matchesStock && matchesSale
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.name.localeCompare(b.name, "ar")
        default:
          return b.id - a.id // newest first
      }
    })

    return filtered
  }, [selectedCategory, searchTerm, priceRange, selectedBrands, showOnlyInStock, showOnlyOnSale, sortBy])

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        }
        return prevCart
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity: Math.min(quantity, item.stock) } : item)),
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const handleCheckout = () => {
    alert("سيتم توجيهك لصفحة الدفع قريباً!")
  }

  const clearFilters = () => {
    setSelectedCategory("all")
    setSearchTerm("")
    setPriceRange([0, 5000])
    setSelectedBrands([])
    setShowOnlyInStock(false)
    setShowOnlyOnSale(false)
    setSortBy("newest")
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <h1 className="text-2xl font-bold text-gray-900">متجري</h1>
              <Badge variant="secondary">متجر إلكتروني متطور</Badge>
            </div>

            <div className="hidden md:flex items-center space-x-4 space-x-reverse flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="ابحث عن المنتجات، العلامات التجارية..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <CartSidebar
                cart={cart}
                onUpdateQuantity={updateCartQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={handleCheckout}
              />
            </div>
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
          <div className="flex items-center justify-between py-4">
            <div className="flex space-x-1 space-x-reverse overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name}
                  <Badge variant="secondary" className="mr-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Mobile Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden bg-transparent">
                    <Filter className="h-4 w-4 ml-2" />
                    فلترة
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80" dir="rtl">
                  <SheetHeader>
                    <SheetTitle>فلترة المنتجات</SheetTitle>
                    <SheetDescription>اختر المعايير المناسبة لك</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Price Range */}
                    <div>
                      <Label className="text-sm font-medium">نطاق السعر</Label>
                      <div className="mt-2">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={5000}
                          step={50}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>{priceRange[0]} ريال</span>
                          <span>{priceRange[1]} ريال</span>
                        </div>
                      </div>
                    </div>

                    {/* Brands */}
                    <div>
                      <Label className="text-sm font-medium">العلامات التجارية</Label>
                      <div className="mt-2 space-y-2">
                        {brands.map((brand) => (
                          <div key={brand} className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                              id={brand}
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedBrands([...selectedBrands, brand])
                                } else {
                                  setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                                }
                              }}
                            />
                            <Label htmlFor={brand} className="text-sm">
                              {brand}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Other Filters */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox id="in-stock" checked={showOnlyInStock} onCheckedChange={setShowOnlyInStock} />
                        <Label htmlFor="in-stock" className="text-sm">
                          متوفر فقط
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox id="on-sale" checked={showOnlyOnSale} onCheckedChange={setShowOnlyOnSale} />
                        <Label htmlFor="on-sale" className="text-sm">
                          العروض فقط
                        </Label>
                      </div>
                    </div>

                    <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                      مسح الفلاتر
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Filters */}
              <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SlidersHorizontal className="h-4 w-4 ml-2" />
                      فلاتر متقدمة
                      <ChevronDown className="h-4 w-4 mr-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-80 p-4" dir="rtl">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">نطاق السعر</Label>
                        <div className="mt-2">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={5000}
                            step={50}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>{priceRange[0]} ريال</span>
                            <span>{priceRange[1]} ريال</span>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id="desktop-in-stock"
                          checked={showOnlyInStock}
                          onCheckedChange={setShowOnlyInStock}
                        />
                        <Label htmlFor="desktop-in-stock" className="text-sm">
                          متوفر فقط
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox id="desktop-on-sale" checked={showOnlyOnSale} onCheckedChange={setShowOnlyOnSale} />
                        <Label htmlFor="desktop-on-sale" className="text-sm">
                          العروض فقط
                        </Label>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <span className="text-sm text-gray-600">{filteredAndSortedProducts.length} منتج</span>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="price-low">السعر: من الأقل للأعلى</SelectItem>
                  <SelectItem value="price-high">السعر: من الأعلى للأقل</SelectItem>
                  <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                  <SelectItem value="name">الاسم</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden sm:flex items-center space-x-1 space-x-reverse">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-500 mb-4">لم نجد أي منتجات تطابق معايير البحث الخاصة بك</p>
              <Button onClick={clearFilters}>مسح جميع الفلاتر</Button>
            </div>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            }`}
          >
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onToggleFavorite={toggleFavorite}
                onQuickView={setQuickViewProduct}
                isFavorite={favorites.includes(product.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
        onToggleFavorite={toggleFavorite}
        isFavorite={quickViewProduct ? favorites.includes(quickViewProduct.id) : false}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">متجري</h3>
              <p className="text-gray-400 mb-4">
                متجرك الإلكتروني المفضل للتسوق الآمن والسريع مع أفضل المنتجات وأسعار تنافسية
              </p>
              <div className="flex space-x-3 space-x-reverse">
                <Badge variant="secondary">شحن مجاني</Badge>
                <Badge variant="secondary">إرجاع سهل</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">عن المتجر</li>
                <li className="hover:text-white cursor-pointer">اتصل بنا</li>
                <li className="hover:text-white cursor-pointer">الشحن والتوصيل</li>
                <li className="hover:text-white cursor-pointer">سياسة الإرجاع</li>
                <li className="hover:text-white cursor-pointer">الأسئلة الشائعة</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">الفئات</h4>
              <ul className="space-y-2 text-gray-400">
                {categories.slice(1).map((category) => (
                  <li key={category.id} className="hover:text-white cursor-pointer">
                    {category.name} ({category.count})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">تابعنا</h4>
              <p className="text-gray-400 mb-4">اشترك في النشرة الإخبارية للحصول على أحدث العروض والمنتجات الجديدة</p>
              <div className="flex space-x-2 space-x-reverse mb-4">
                <Input placeholder="بريدك الإلكتروني" className="flex-1" />
                <Button>اشتراك</Button>
              </div>
              <div className="flex space-x-4 space-x-reverse text-gray-400">
                <span className="hover:text-white cursor-pointer">فيسبوك</span>
                <span className="hover:text-white cursor-pointer">تويتر</span>
                <span className="hover:text-white cursor-pointer">إنستغرام</span>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2024 متجري. جميع الحقوق محفوظة.</p>
            <div className="flex space-x-4 space-x-reverse mt-4 md:mt-0">
              <span className="hover:text-white cursor-pointer">سياسة الخصوصية</span>
              <span className="hover:text-white cursor-pointer">شروط الاستخدام</span>
              <span className="hover:text-white cursor-pointer">ملفات تعريف الارتباط</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
