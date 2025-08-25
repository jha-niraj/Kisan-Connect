"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Upload,
  X,
  ImageIcon,
  Loader2,
  ArrowLeft,
  Save,
  Eye
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { uploadToCloudinary } from "@/actions/(common)/utils.action"
import { createProduct } from "@/actions/seller.action"
import { Role, ProductCategory } from '@prisma/client';

const categories: ProductCategory[] = [
  ProductCategory.GRAINS,
  ProductCategory.VEGETABLES,
  ProductCategory.FRUITS,
  ProductCategory.HERBS,
  ProductCategory.SPICES,
  ProductCategory.LEGUMES,
  ProductCategory.DAIRY,
  ProductCategory.MEAT,
  ProductCategory.ORGANIC,
  ProductCategory.SEEDS
]

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.GRAINS]: "Grains",
  [ProductCategory.VEGETABLES]: "Vegetables", 
  [ProductCategory.FRUITS]: "Fruits",
  [ProductCategory.HERBS]: "Herbs",
  [ProductCategory.SPICES]: "Spices",
  [ProductCategory.LEGUMES]: "Legumes",
  [ProductCategory.DAIRY]: "Dairy",
  [ProductCategory.MEAT]: "Meat",
  [ProductCategory.ORGANIC]: "Organic",
  [ProductCategory.SEEDS]: "Seeds"
}

const units = [
  "kg",
  "g", 
  "liter",
  "ml",
  "piece",
  "pack",
  "bag",
  "bottle",
  "box",
  "dozen"
]

interface ProductForm {
  name: string
  description: string
  category: ProductCategory | ""
  price: number
  unit: string
  stock: number
  location: string
  district: string
  images: string[]
  organicCertified: boolean
  harvestDate?: Date
  expiryDate?: Date
}

export default function NewProduct() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    category: "",
    price: 0,
    unit: "kg",
    stock: 0,
    location: "",
    district: "",
    images: [],
    organicCertified: false,
    harvestDate: undefined,
    expiryDate: undefined
  })
  
  // No need for separate specification state as it's not in the model

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      redirect("/signin?callbackUrl=/seller/products/new")
      return
    }

    if (session.user.role !== Role.SELLER) {
      redirect("/")
      return
    }
  }, [session, status])

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
      // TODO: Show error toast
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

  const addFeature = () => {
    // Feature functionality removed as it's not in the current Product model
  }

  const updateFeature = (index: number, value: string) => {
    // Feature functionality removed
  }

  const removeFeature = (index: number) => {
    // Feature functionality removed
  }

  const addSpecification = () => {
    // Specification functionality removed as it's not in the current Product model
  }

  const removeSpecification = (key: string) => {
    // Specification functionality removed
  }

  const handleSubmit = async (isDraft = false) => {
    setIsLoading(true)
    try {
      if (formData.category === "") {
        throw new Error("Please select a category")
      }

      const result = await createProduct({
        name: formData.name,
        description: formData.description,
        category: formData.category as ProductCategory,
        price: formData.price,
        unit: formData.unit,
        stock: formData.stock,
        location: formData.location,
        district: formData.district,
        images: formData.images,
        organicCertified: formData.organicCertified,
        harvestDate: formData.harvestDate,
        expiryDate: formData.expiryDate
      })

      if (result.success) {
        router.push('/seller/products')
      } else {
        console.error('Error creating product:', result.error)
        // TODO: Show error toast
      }
    } catch (error) {
      console.error('Error creating product:', error)
      // TODO: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || session.user.role !== Role.SELLER) {
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
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <p className="text-muted-foreground">Create a new product listing for your store</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
          >
            Save as Draft
          </Button>
          <Button 
            onClick={() => handleSubmit(false)}
            disabled={isLoading || !formData.name || !formData.category || formData.price <= 0 || !formData.location || !formData.district}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Publish Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details of your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product, its benefits, and usage instructions"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{categoryLabels[category]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <select
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => handleInputChange("unit", e.target.value)}
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
                Set your product pricing and stock information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price || ""}
                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stock || ""}
                    onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
              <CardDescription>
                Specify where your product is located
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Village/Town name"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    placeholder="e.g., Kathmandu"
                    value={formData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Additional product information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  id="organicCertified"
                  type="checkbox"
                  checked={formData.organicCertified}
                  onChange={(e) => handleInputChange("organicCertified", e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="organicCertified">Organic Certified</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="harvestDate">Harvest Date</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={formData.harvestDate ? formData.harvestDate.toISOString().split('T')[0] : ""}
                    onChange={(e) => handleInputChange("harvestDate", e.target.value ? new Date(e.target.value) : undefined)}
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate ? formData.expiryDate.toISOString().split('T')[0] : ""}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value ? new Date(e.target.value) : undefined)}
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
                Upload high-quality images of your product (Max 5 images)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Area */}
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
                      PNG, JPG up to 5MB each (Max 5 images)
                    </p>
                  </div>
                </div>
              </div>

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
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      {index === 0 && (
                        <Badge className="absolute bottom-1 left-1 text-xs">Main</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Preview</CardTitle>
              <CardDescription>
                This is how your product will appear to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Image */}
              <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                {formData.images.length > 0 ? (
                  <Image
                    src={formData.images[0]}
                    alt="Product preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  {formData.name || "Product Name"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formData.description || "Product description will appear here..."}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    ₹{formData.price.toLocaleString()}/{formData.unit}
                  </span>
                  <Badge variant={formData.stock > 0 ? "default" : "destructive"}>
                    {formData.stock > 0 ? `${formData.stock} available` : "Out of stock"}
                  </Badge>
                </div>
              </div>

              {/* Category and Location */}
              {(formData.category || formData.location) && (
                <div className="space-y-2">
                  {formData.category && (
                    <Badge variant="secondary">{categoryLabels[formData.category as ProductCategory]}</Badge>
                  )}
                  {formData.location && (
                    <p className="text-sm text-muted-foreground">
                      📍 {formData.location}{formData.district ? `, ${formData.district}` : ""}
                    </p>
                  )}
                </div>
              )}

              {/* Organic Certification */}
              {formData.organicCertified && (
                <div>
                  <Badge variant="default" className="bg-green-600">🌱 Organic Certified</Badge>
                </div>
              )}

              {/* Dates */}
              {(formData.harvestDate || formData.expiryDate) && (
                <div className="text-sm space-y-1">
                  {formData.harvestDate && (
                    <p className="text-muted-foreground">
                      Harvested: {formData.harvestDate.toLocaleDateString()}
                    </p>
                  )}
                  {formData.expiryDate && (
                    <p className="text-muted-foreground">
                      Expires: {formData.expiryDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
