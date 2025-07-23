"use client"

import { useState } from "react"
import { Star, Heart, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "../types"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onToggleFavorite: (productId: number) => void
  onQuickView: (product: Product) => void
  isFavorite: boolean
}

export function ProductCard({ product, onAddToCart, onToggleFavorite, onQuickView, isFavorite }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className={`w-full h-48 object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Overlay buttons */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2 space-x-reverse">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onQuickView(product)}
            className="bg-white/90 hover:bg-white"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onToggleFavorite(product.id)}
            className="bg-white/90 hover:bg-white"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          {product.originalPrice && (
            <Badge variant="destructive" className="text-xs">
              خصم {discountPercentage}%
            </Badge>
          )}
          {product.stock < 10 && (
            <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">
              كمية محدودة
            </Badge>
          )}
        </div>

        {/* Stock indicator */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="text-sm">
              نفد المخزون
            </Badge>
          </div>
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
            {product.reviews && <span className="text-xs text-gray-500">({product.reviews.length})</span>}
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-lg font-bold text-gray-900">{product.price} ريال</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">{product.originalPrice} ريال</span>
            )}
          </div>
          <span className="text-xs text-gray-500">متوفر: {product.stock}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={() => onAddToCart(product)} disabled={product.stock === 0}>
          <ShoppingCart className="h-4 w-4 ml-2" />
          {product.stock === 0 ? "نفد المخزون" : "أضف للسلة"}
        </Button>
      </CardFooter>
    </Card>
  )
}
