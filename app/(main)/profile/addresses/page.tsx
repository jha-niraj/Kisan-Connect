"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, MapPin, Edit, Trash2, Home, Building, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Nepal provinces and districts data
const nepalProvinces = {
  "Province 1": [
    "Bhojpur",
    "Dhankuta",
    "Ilam",
    "Jhapa",
    "Khotang",
    "Morang",
    "Okhaldhunga",
    "Panchthar",
    "Sankhuwasabha",
    "Solukhumbu",
    "Sunsari",
    "Taplejung",
    "Terhathum",
    "Udayapur",
  ],
  "Madhesh Province": ["Bara", "Dhanusha", "Mahottari", "Parsa", "Rautahat", "Saptari", "Sarlahi", "Siraha"],
  "Bagmati Province": [
    "Bhaktapur",
    "Chitwan",
    "Dhading",
    "Dolakha",
    "Kathmandu",
    "Kavrepalanchok",
    "Lalitpur",
    "Makwanpur",
    "Nuwakot",
    "Ramechhap",
    "Rasuwa",
    "Sindhuli",
    "Sindhupalchok",
  ],
  "Gandaki Province": [
    "Baglung",
    "Gorkha",
    "Kaski",
    "Lamjung",
    "Manang",
    "Mustang",
    "Myagdi",
    "Nawalpur",
    "Parbat",
    "Syangja",
    "Tanahun",
  ],
  "Lumbini Province": [
    "Arghakhanchi",
    "Banke",
    "Bardiya",
    "Dang",
    "Gulmi",
    "Kapilvastu",
    "Nawalparasi (East)",
    "Nawalparasi (West)",
    "Palpa",
    "Pyuthan",
    "Rolpa",
    "Rukum (East)",
  ],
  "Karnali Province": [
    "Dailekh",
    "Dolpa",
    "Humla",
    "Jajarkot",
    "Jumla",
    "Kalikot",
    "Mugu",
    "Rukum (West)",
    "Salyan",
    "Surkhet",
  ],
  "Sudurpashchim Province": [
    "Achham",
    "Baitadi",
    "Bajhang",
    "Bajura",
    "Dadeldhura",
    "Darchula",
    "Doti",
    "Kailali",
    "Kanchanpur",
  ],
}

// Mock saved addresses
const initialAddresses = [
  {
    id: 1,
    label: "Home",
    type: "home",
    name: "Ram Bahadur Sharma",
    phone: "+977-9841234567",
    street: "Ward No. 5, Thamel",
    municipality: "Kathmandu Metropolitan City",
    district: "Kathmandu",
    province: "Bagmati Province",
    isDefault: true,
    notes: "Near Thamel Chowk, blue gate",
  },
  {
    id: 2,
    label: "Office",
    type: "office",
    name: "Ram Bahadur Sharma",
    phone: "+977-9841234567",
    street: "Ward No. 11, New Baneshwor",
    municipality: "Kathmandu Metropolitan City",
    district: "Kathmandu",
    province: "Bagmati Province",
    isDefault: false,
    notes: "Office building, 3rd floor",
  },
  {
    id: 3,
    label: "Parents House",
    type: "other",
    name: "Dil Bahadur Sharma",
    phone: "+977-9851234567",
    street: "Ward No. 2, Bazar Area",
    municipality: "Bharatpur Municipality",
    district: "Chitwan",
    province: "Bagmati Province",
    isDefault: false,
    notes: "Near the main market",
  },
]

interface Address {
  id?: number
  label: string
  type: string
  name: string
  phone: string
  street: string
  municipality: string
  district: string
  province: string
  isDefault: boolean
  notes: string
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState<Address>({
    label: "",
    type: "home",
    name: "",
    phone: "",
    street: "",
    municipality: "",
    district: "",
    province: "",
    isDefault: false,
    notes: "",
  })

  const availableDistricts = formData.province
    ? nepalProvinces[formData.province as keyof typeof nepalProvinces] || []
    : []

  const handleAddAddress = () => {
    setEditingAddress(null)
    setFormData({
      label: "",
      type: "home",
      name: "",
      phone: "",
      street: "",
      municipality: "",
      district: "",
      province: "",
      isDefault: false,
      notes: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setFormData(address)
    setIsDialogOpen(true)
  }

  const handleSaveAddress = () => {
    if (
      !formData.label ||
      !formData.name ||
      !formData.phone ||
      !formData.street ||
      !formData.province ||
      !formData.district
    ) {
      alert("Please fill in all required fields")
      return
    }

    if (editingAddress) {
      // Update existing address
      setAddresses(
        addresses.map((addr) => (addr.id === editingAddress.id ? { ...formData, id: editingAddress.id } : addr)),
      )
    } else {
      // Add new address
      const newAddress = { ...formData, id: Date.now() }
      setAddresses([...addresses, newAddress])
    }

    // If this is set as default, remove default from others
    if (formData.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === (editingAddress?.id || Date.now()) ? true : false,
        })),
      )
    }

    setIsDialogOpen(false)
  }

  const handleDeleteAddress = (id: number) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter((addr) => addr.id !== id))
    }
  }

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map((addr) => ({ ...addr, isDefault: addr.id === id })))
  }

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-4 w-4" />
      case "office":
        return <Building className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
          <div>
            <h1 className="font-serif text-3xl font-bold">My Addresses</h1>
            <p className="text-muted-foreground">Manage your delivery addresses</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Add New Address Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[200px]">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Add New Address</h3>
                <p className="text-sm text-muted-foreground mb-4">Add a new delivery address for your orders</p>
                <Button onClick={handleAddAddress}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Existing Addresses */}
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getAddressIcon(address.type)}
                      <CardTitle className="text-lg">{address.label}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      {address.isDefault && <Badge variant="default">Default</Badge>}
                      <Button variant="ghost" size="sm" onClick={() => handleEditAddress(address)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(address.id!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{address.name}</p>
                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                  </div>

                  <div className="text-sm">
                    <p>{address.street}</p>
                    <p>{address.municipality}</p>
                    <p>
                      {address.district}, {address.province}
                    </p>
                  </div>

                  {address.notes && (
                    <div className="text-sm">
                      <p className="text-muted-foreground">Notes: {address.notes}</p>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id!)}
                        className="bg-transparent"
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                      className="bg-transparent"
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Address Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Address Label *</Label>
                  <Input
                    id="label"
                    placeholder="e.g., Home, Office"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Address Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Ram Bahadur Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+977-98XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  placeholder="Ward No. 5, Tole Name"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Province *</Label>
                  <Select
                    value={formData.province}
                    onValueChange={(value) => {
                      setFormData({ ...formData, province: value, district: "" })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(nepalProvinces).map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) => setFormData({ ...formData, district: value })}
                    disabled={!formData.province}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDistricts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipality">Municipality/VDC *</Label>
                <Input
                  id="municipality"
                  placeholder="Municipality or VDC name"
                  value={formData.municipality}
                  onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any landmarks or special instructions..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="default"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
                />
                <Label htmlFor="default">Set as default address</Label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={handleSaveAddress} className="flex-1">
                  {editingAddress ? "Update Address" : "Save Address"}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-transparent">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  )
}
