"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MapPin, Home, Building, Plus } from "lucide-react"

interface Address {
  id: number
  label: string
  type: string
  name: string
  phone: string
  street: string
  municipality: string
  district: string
  province: string
  isDefault: boolean
  notes?: string
}

interface AddressSelectorProps {
  addresses: Address[]
  selectedAddressId?: number
  onAddressSelect: (address: Address) => void
  onAddNewAddress?: () => void
  showAddNew?: boolean
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onAddressSelect,
  onAddNewAddress,
  showAddNew = true,
}: AddressSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string>(selectedAddressId?.toString() || "")

  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId)

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

  const handleSelectAddress = () => {
    const address = addresses.find((addr) => addr.id.toString() === selectedId)
    if (address) {
      onAddressSelect(address)
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            {selectedAddress ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getAddressIcon(selectedAddress.type)}
                    <span className="font-medium">{selectedAddress.label}</span>
                    {selectedAddress.isDefault && (
                      <Badge variant="default" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    Change
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{selectedAddress.name}</p>
                  <p>{selectedAddress.street}</p>
                  <p>
                    {selectedAddress.district}, {selectedAddress.province}
                  </p>
                  <p>{selectedAddress.phone}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Select delivery address</span>
                </div>
                <Button variant="ghost" size="sm">
                  Select
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Delivery Address</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup value={selectedId} onValueChange={setSelectedId}>
            {addresses.map((address) => (
              <div key={address.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} className="mt-1" />
                <Label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getAddressIcon(address.type)}
                      <span className="font-medium">{address.label}</span>
                      {address.isDefault && (
                        <Badge variant="default" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{address.name}</p>
                      <p>{address.phone}</p>
                      <p>{address.street}</p>
                      <p>{address.municipality}</p>
                      <p>
                        {address.district}, {address.province}
                      </p>
                      {address.notes && <p className="italic">Note: {address.notes}</p>}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {showAddNew && (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
              <Button
                variant="ghost"
                className="w-full h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => {
                  setIsOpen(false)
                  onAddNewAddress?.()
                }}
              >
                <Plus className="h-6 w-6 text-primary" />
                <span>Add New Address</span>
              </Button>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button onClick={handleSelectAddress} disabled={!selectedId} className="flex-1">
              Use This Address
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
