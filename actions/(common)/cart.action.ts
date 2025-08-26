"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addToCart(productId: string, quantity: number = 1) {
	try {
		const session = await auth()

		if (!session?.user) {
			throw new Error("Please sign in to add items to cart")
		}

		// Check if product exists and is available
		const product = await prisma.product.findUnique({
			where: { id: productId },
			select: {
				id: true,
				name: true,
				price: true,
				stock: true,
				status: true
			}
		})

		if (!product) {
			throw new Error("Product not found")
		}

		if (product.status !== "ACTIVE") {
			throw new Error("Product is not available")
		}

		if (product.stock < quantity) {
			throw new Error(`Only ${product.stock} items available in stock`)
		}

		// Check if item already exists in cart
		const existingCartItem = await prisma.cartItem.findUnique({
			where: {
				userId_productId: {
					userId: session.user.id,
					productId
				}
			}
		})

		let cartItem

		if (existingCartItem) {
			// Update quantity
			const newQuantity = existingCartItem.quantity + quantity
			
			if (newQuantity > product.stock) {
				throw new Error(`Cannot add more items. Only ${product.stock} available in stock`)
			}

			cartItem = await prisma.cartItem.update({
				where: {
					id: existingCartItem.id
				},
				data: {
					quantity: newQuantity
				},
				include: {
					product: {
						select: {
							id: true,
							name: true,
							price: true,
							images: true,
							unit: true,
							stock: true
						}
					}
				}
			})
		} else {
			// Create new cart item
			cartItem = await prisma.cartItem.create({
				data: {
					userId: session.user.id,
					productId,
					quantity
				},
				include: {
					product: {
						select: {
							id: true,
							name: true,
							price: true,
							images: true,
							unit: true,
							stock: true
						}
					}
				}
			})
		}

		revalidatePath("/cart")
		return { success: true, cartItem }
	} catch (error) {
		console.error("Error adding to cart:", error)
		return { success: false, error: error instanceof Error ? error.message : "Failed to add to cart" }
	}
}

export async function getCartItems() {
	try {
		const session = await auth()

		if (!session?.user) {
			return { success: true, items: [] }
		}

		const cartItems = await prisma.cartItem.findMany({
			where: {
				userId: session.user.id
			},
			include: {
				product: {
					select: {
						id: true,
						name: true,
						price: true,
						images: true,
						unit: true,
						stock: true,
						status: true,
						farmer: {
							select: {
								id: true,
								name: true,
								location: true,
								district: true
							}
						}
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return { success: true, items: cartItems }
	} catch (error) {
		console.error("Error fetching cart items:", error)
		return { success: false, error: "Failed to fetch cart items" }
	}
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
	try {
		const session = await auth()

		if (!session?.user) {
			throw new Error("Unauthorized")
		}

		if (quantity <= 0) {
			throw new Error("Quantity must be greater than 0")
		}

		// Get cart item with product info
		const cartItem = await prisma.cartItem.findUnique({
			where: { id: cartItemId },
			include: {
				product: {
					select: {
						stock: true,
						status: true
					}
				}
			}
		})

		if (!cartItem) {
			throw new Error("Cart item not found")
		}

		// Check if user owns this cart item
		if (cartItem.userId !== session.user.id) {
			throw new Error("Unauthorized")
		}

		// Check stock availability
		if (quantity > cartItem.product.stock) {
			throw new Error(`Only ${cartItem.product.stock} items available in stock`)
		}

		// Check if product is still active
		if (cartItem.product.status !== "ACTIVE") {
			throw new Error("Product is no longer available")
		}

		const updatedCartItem = await prisma.cartItem.update({
			where: { id: cartItemId },
			data: { quantity },
			include: {
				product: {
					select: {
						id: true,
						name: true,
						price: true,
						images: true,
						unit: true,
						stock: true
					}
				}
			}
		})

		revalidatePath("/cart")
		return { success: true, cartItem: updatedCartItem }
	} catch (error) {
		console.error("Error updating cart item:", error)
		return { success: false, error: error instanceof Error ? error.message : "Failed to update cart item" }
	}
}

export async function removeFromCart(cartItemId: string) {
	try {
		const session = await auth()

		if (!session?.user) {
			throw new Error("Unauthorized")
		}

		// Verify cart item belongs to user
		const cartItem = await prisma.cartItem.findUnique({
			where: { id: cartItemId }
		})

		if (!cartItem) {
			throw new Error("Cart item not found")
		}

		if (cartItem.userId !== session.user.id) {
			throw new Error("Unauthorized")
		}

		await prisma.cartItem.delete({
			where: { id: cartItemId }
		})

		revalidatePath("/cart")
		return { success: true }
	} catch (error) {
		console.error("Error removing from cart:", error)
		return { success: false, error: error instanceof Error ? error.message : "Failed to remove from cart" }
	}
}

export async function clearCart() {
	try {
		const session = await auth()

		if (!session?.user) {
			throw new Error("Unauthorized")
		}

		await prisma.cartItem.deleteMany({
			where: {
				userId: session.user.id
			}
		})

		revalidatePath("/cart")
		return { success: true }
	} catch (error) {
		console.error("Error clearing cart:", error)
		return { success: false, error: "Failed to clear cart" }
	}
}

export async function getCartItemCount() {
	try {
		const session = await auth()

		if (!session?.user) {
			return { success: true, count: 0 }
		}

		const count = await prisma.cartItem.count({
			where: {
				userId: session.user.id
			}
		})

		return { success: true, count }
	} catch (error) {
		console.error("Error getting cart count:", error)
		return { success: false, error: "Failed to get cart count", count: 0 }
	}
}
