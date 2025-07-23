"use client"

import { useState } from "react"
import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { Product } from "../types"

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: Product) => void
  onToggleFavorite: (productId: number) => void
  isFavorite: boolean
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}: QuickViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!product) return null

  const images = product.images || [product.image]
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />

              {images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-transparent"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-2 right-2 flex flex-col space-y-1">
                {product.originalPrice && <Badge variant="destructive">خصم {discountPercentage}%</Badge>}
                {product.stock < 10 && product.stock > 0 && (
                  <Badge variant="outline" className="bg-orange-100 text-orange-800">
                    كمية محدودة
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2 space-x-reverse overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                      currentImageIndex === index ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{product.category}</Badge>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{product.rating}</span>
                  {product.reviews && <span className="text-sm text-gray-500">({product.reviews.length} تقييم)</span>}
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-1">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.brand}</p>

              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <span className="text-2xl font-bold text-gray-900">{product.price} ريال</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">{product.originalPrice} ريال</span>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">الوصف</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {product.specifications && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">المواصفات</h3>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">الكمية المتوفرة: {product.stock}</span>
              {product.stock < 10 && product.stock > 0 && (
                <Badge variant="outline" className="text-orange-600">
                  كمية محدودة
                </Badge>
              )}
            </div>

            <div className="flex space-x-3 space-x-reverse">
              <Button className="flex-1" onClick={() => onAddToCart(product)} disabled={product.stock === 0}>
                <ShoppingCart className="h-4 w-4 ml-2" />
                {product.stock === 0 ? "نفد المخزون" : "أضف للسلة"}
              </Button>
              <Button variant="outline" onClick={() => onToggleFavorite(product.id)}>
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>

            {/* Reviews Preview */}
            {product.reviews && product.reviews.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">آراء العملاء</h3>
                  <div className="space-y-3">
                    {product.reviews.slice(0, 2).map((review) => (
                      <div key={review.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{review.userName}</span>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
