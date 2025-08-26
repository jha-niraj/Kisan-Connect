// Order related types

export interface Order {
    id: string
    buyerId: string
    sellerId?: string
    farmerId?: string
    productId: string
    quantity: number
    totalAmount: number
    status: OrderStatus
    deliveryAddress: string
    orderDate: Date
    expectedDeliveryDate?: Date
    actualDeliveryDate?: Date
    product: {
        id: string
        name: string
        price: number
        unit: string
        images: string[]
    }
    buyer: {
        id: string
        name: string
        email: string
        phone?: string
    }
    seller?: {
        id: string
        name: string
        email: string
        phone?: string
    }
    farmer?: {
        id: string
        name: string
        email: string
        phone?: string
    }
    createdAt: Date
    updatedAt: Date
}

export enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}

export interface CreateOrderData {
    productId: string
    quantity: number
    deliveryAddress: string
}

export interface OrderFilters {
    status?: OrderStatus | 'all'
    dateFrom?: Date
    dateTo?: Date
    search?: string
}
