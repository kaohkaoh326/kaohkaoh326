export interface Product {
  id: number
  name: string
  price: number
  image: string
  images?: string[]
  category: string
  rating: number
  description: string
  originalPrice?: number
  stock: number
  brand: string
  specifications?: Record<string, string>
  reviews?: Review[]
}

export interface Review {
  id: number
  userId: number
  userName: string
  rating: number
  comment: string
  date: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  address?: Address
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Order {
  id: number
  userId: number
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  shippingAddress: Address
}
