// Auction and bidding related types

export interface Auction {
  id: string
  productId: string
  startingPrice: number
  currentBid: number
  highestBidderId?: string
  startTime: Date
  endTime: Date
  status: AuctionStatus
  product: {
    id: string
    name: string
    description: string
    images: string[]
    category: string
    unit: string
  }
  farmer: {
    id: string
    name: string
    image?: string
  }
  bids: Bid[]
  createdAt: Date
  updatedAt: Date
}

export enum AuctionStatus {
  ACTIVE = "ACTIVE",
  ENDED = "ENDED",
  CANCELLED = "CANCELLED"
}

export interface Bid {
  id: string
  auctionId: string
  bidderId: string
  amount: number
  bidder: {
    id: string
    name: string
    image?: string
  }
  createdAt: Date
}

export interface CreateAuctionData {
  productId: string
  startingPrice: number
  startTime: Date
  endTime: Date
}

export interface BidData {
  auctionId: string
  amount: number
}
