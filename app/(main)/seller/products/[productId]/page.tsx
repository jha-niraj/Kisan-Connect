"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { 
    Card, CardContent, CardDescription, 
    CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
    ArrowLeft, Save, Edit, Eye, Upload, X, ImageIcon, Loader2,
    AlertCircle, CheckCircle, Package
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Role, ProductCategory, ProductStatus } from '@prisma/client'
import { uploadToCloudinary } from "@/actions/(common)/utils.action"
import {
    getSellerProduct, updateProduct, toggleProductStatus
} from "@/actions/(seller)/seller.action"
import { PRODUCT_CATEGORIES, PRODUCT_UNITS } from "@/types/product"

const productCategories = PRODUCT_CATEGORIES.map(category => ({
    value: category,
    label: category
}))

// const productUnits = PRODUCT_UNITS.map(unit => ({
//     value: unit,
//     label: unit
// }))

const productStatuses = [
    { value: "ACTIVE", label: "Active", color: "green" },
    { value: "INACTIVE", label: "Inactive", color: "gray" },
    { value: "SOLD_OUT", label: "Sold Out", color: "red" },
    { value: "PENDING", label: "Pending", color: "yellow" }
]

const units = [
    "kg", "g", "liter", "ml", "piece", "pack", "bag", "bottle", "box", "set", "dozen"
]

interface ProductForm {
    name: string
    description: string
    price: number
    unit: string
    stock: number
    category: ProductCategory
    status: ProductStatus
    location: string
    district: string
    organicCertified: boolean
    harvestDate: string
    expiryDate: string
    images: string[]
}

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { productId } = use(params);

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [uploadingImages, setUploadingImages] = useState(false)
    const [product, setProduct] = useState<any>(null)
    const [formData, setFormData] = useState<ProductForm>({
        name: "",
        description: "",
        price: 0,
        unit: "kg",
        stock: 0,
        category: "GRAINS" as ProductCategory,
        status: "ACTIVE" as ProductStatus,
        location: "",
        district: "",
        organicCertified: false,
        harvestDate: "",
        expiryDate: "",
        images: []
    })
    const [saveMessage, setSaveMessage] = useState("")

    const loadProduct = useCallback(async () => {
        try {
            setIsLoading(true)
            const result = await getSellerProduct(productId)

            if (result.success && result.product) {
                setProduct(result.product)
                setFormData({
                    name: result.product.name,
                    description: result.product.description,
                    price: result.product.price,
                    unit: result.product.unit,
                    stock: result.product.stock,
                    category: result.product.category,
                    status: result.product.status,
                    location: result.product.location,
                    district: result.product.district,
                    organicCertified: result.product.organicCertified,
                    harvestDate: result.product.harvestDate ? new Date(result.product.harvestDate).toISOString().split('T')[0] : "",
                    expiryDate: result.product.expiryDate ? new Date(result.product.expiryDate).toISOString().split('T')[0] : "",
                    images: result.product.images || []
                })
            } else {
                router.push("/seller/products")
            }
        } catch (error) {
            console.error("Error loading product:", error)
            router.push("/seller/products")
        } finally {
            setIsLoading(false)
        }
    }, [productId]);

    useEffect(() => {
        if (status === "loading") return

        if (!session) {
            redirect("/signin?callbackUrl=/seller/products/" + productId)
            return
        }

        if (session.user.role !== Role.SELLER) {
            redirect("/")
            return
        }

        loadProduct()
    }, [session, status, productId, loadProduct])

    const handleInputChange = (field: keyof ProductForm, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleImageUpload = async (files: FileList) => {
        if (!files || files.length === 0) return

        setUploadingImages(true)
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                return uploadToCloudinary(file)
            })

            const results = await Promise.all(uploadPromises)
            const newImages = results.map(result => result.secure_url)

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }))
        } catch (error) {
            console.error('Error uploading images:', error)
            setSaveMessage("Error uploading images")
        } finally {
            setUploadingImages(false)
        }
    }

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        setSaveMessage("")

        try {
            const updateData = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                unit: formData.unit,
                stock: formData.stock,
                category: formData.category,
                status: formData.status,
                location: formData.location,
                district: formData.district,
                organicCertified: formData.organicCertified,
                harvestDate: formData.harvestDate ? new Date(formData.harvestDate) : null,
                expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
                images: formData.images
            }

            const result = await updateProduct(productId, updateData)

            if (result.success) {
                setSaveMessage("Product updated successfully!")
                setIsEditing(false)
                await loadProduct() // Reload to get updated data
            } else {
                setSaveMessage(result.error || "Failed to update product")
            }
        } catch (error) {
            console.error("Error saving product:", error)
            setSaveMessage("Failed to save changes")
        } finally {
            setIsSaving(false)
        }
    }

    const handleStatusToggle = async () => {
        try {
            const result = await toggleProductStatus(productId!)
            if (result.success) {
                await loadProduct()
                setSaveMessage("Product status updated!")
            } else {
                setSaveMessage(result.error || "Failed to update status")
            }
        } catch (error) {
            console.error("Error toggling status:", error)
            setSaveMessage("Failed to update status")
        }
    }

    const getStatusBadge = (status: ProductStatus) => {
        const statusInfo = productStatuses.find(s => s.value === status)
        if (!statusInfo) return <Badge variant="outline">{status}</Badge>

        const variant = status === "ACTIVE" ? "default" :
            status === "SOLD_OUT" ? "destructive" : "secondary"

        return <Badge variant={variant}>{statusInfo.label}</Badge>
    }

    if (status === "loading" || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!session || session.user.role !== Role.SELLER || !product) {
        return null
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/seller/products">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <p className="text-muted-foreground">
                            {isEditing ? "Edit product details" : "View product details"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {saveMessage && (
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm ${saveMessage.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                            {saveMessage.includes("success") ? (
                                <CheckCircle className="h-4 w-4" />
                            ) : (
                                <AlertCircle className="h-4 w-4" />
                            )}
                            <span>{saveMessage}</span>
                        </div>
                    )}

                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Product
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Product name, description, and category
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    disabled={!isEditing}
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => handleInputChange("category", e.target.value as ProductCategory)}
                                        disabled={!isEditing}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {productCategories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="unit">Unit</Label>
                                    <select
                                        id="unit"
                                        value={formData.unit}
                                        onChange={(e) => handleInputChange("unit", e.target.value)}
                                        disabled={!isEditing}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {units.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing and Inventory */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Inventory</CardTitle>
                            <CardDescription>
                                Set your product price and manage stock levels
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="price">Price (₹ per {formData.unit})</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price || ""}
                                        onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="stock">Stock Quantity</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        value={formData.stock || ""}
                                        onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || 0)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="organicCertified"
                                    checked={formData.organicCertified}
                                    onCheckedChange={(checked) => handleInputChange("organicCertified", checked)}
                                    disabled={!isEditing}
                                />
                                <Label htmlFor="organicCertified">Organic Certified</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Location Information</CardTitle>
                            <CardDescription>
                                Where the product is located
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange("location", e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="e.g., Village/City name"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="district">District</Label>
                                    <Input
                                        id="district"
                                        value={formData.district}
                                        onChange={(e) => handleInputChange("district", e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="e.g., Kathmandu"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dates */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Dates</CardTitle>
                            <CardDescription>
                                Harvest and expiry information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="harvestDate">Harvest Date</Label>
                                    <Input
                                        id="harvestDate"
                                        type="date"
                                        value={formData.harvestDate}
                                        onChange={(e) => handleInputChange("harvestDate", e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="expiryDate">Expiry Date</Label>
                                    <Input
                                        id="expiryDate"
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                            <CardDescription>
                                Upload and manage product photos (Max 5 images)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isEditing && (
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                                    <div className="text-center">
                                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="image-upload"
                                                className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                            >
                                                {uploadingImages ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Upload className="h-4 w-4 mr-2" />
                                                )}
                                                {uploadingImages ? "Uploading..." : "Upload Images"}
                                            </Label>
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                                                disabled={formData.images.length >= 5 || uploadingImages}
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                PNG, JPG up to 5MB each
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Image Preview */}
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-5 gap-4">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <div className="relative w-full h-24 bg-muted rounded-lg overflow-hidden">
                                                <Image
                                                    src={image}
                                                    alt={`Product image ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            {isEditing && (
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            )}
                                            {index === 0 && (
                                                <Badge className="absolute bottom-1 left-1 text-xs">Main</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Product Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Status</CardTitle>
                            <CardDescription>
                                Current status and visibility
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Current Status</Label>
                                    <div className="mt-1">
                                        {getStatusBadge(product.status)}
                                    </div>
                                </div>
                                {!isEditing && (
                                    <Button variant="outline" size="sm" onClick={handleStatusToggle}>
                                        Toggle Status
                                    </Button>
                                )}
                            </div>

                            {isEditing && (
                                <div>
                                    <Label htmlFor="status">Change Status</Label>
                                    <select
                                        id="status"
                                        value={formData.status}
                                        onChange={(e) => handleInputChange("status", e.target.value as ProductStatus)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {productStatuses.map(status => (
                                            <option key={status.value} value={status.value}>{status.label}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Product Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Price</span>
                                    <span className="font-medium">₹{product.price}/{product.unit}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Stock</span>
                                    <span className={`font-medium ${product.stock === 0 ? "text-red-500" :
                                        product.stock <= 10 ? "text-yellow-500" : "text-green-500"
                                        }`}>
                                        {product.stock} {product.unit}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Category</span>
                                    <span className="font-medium">
                                        {productCategories.find(cat => cat.value === product.category)?.label}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Location</span>
                                    <span className="font-medium">{product.location}, {product.district}</span>
                                </div>
                                {product.organicCertified && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Organic</span>
                                        <Badge variant="secondary">Certified</Badge>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Created</span>
                                        <span className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Updated</span>
                                        <span className="text-sm">{new Date(product.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button asChild variant="outline" className="w-full justify-start">
                                <Link href={`/products/${product.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Public Page
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full justify-start">
                                <Link href="/seller/products">
                                    <Package className="h-4 w-4 mr-2" />
                                    Back to Products
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}