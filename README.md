# KisanConnect

**KisanConnect** is a modern agricultural marketplace platform that directly connects farmers with buyers across Nepal. Built with Next.js, TypeScript, and Prisma, it provides a comprehensive solution for agricultural product trading, bidding, and farmer empowerment.

## ✨ Features

### 🌾 **Agricultural Marketplace**
- **Product Catalog** - Browse organic and fresh agricultural products
- **Advanced Search & Filters** - Find products by category, location, price range
- **Product Details** - Comprehensive product information with farmer profiles
- **Shopping Cart & Checkout** - Seamless purchasing experience

### 🔨 **Live Bidding System**
- **Real-time Auctions** - Live bidding on agricultural products
- **Bid Management** - Track active bids and auction status
- **Time-based Auctions** - Countdown timers and automatic bid closure
- **Auction Analytics** - Historical bidding data and trends

### 👨‍🌾 **Farmer Dashboard**
- **Product Management** - Add, edit, and manage agricultural listings
- **Auction Creation** - Set up live auctions for products
- **Sales Analytics** - Track earnings, orders, and performance metrics
- **Inventory Management** - Monitor stock levels and product status

### 🔐 **Authentication & Security**
- **Email Verification** - OTP-based email verification system
- **Role-based Access** - Different access levels (USER, SELLER, ADMIN)
- **Password Recovery** - Secure password reset functionality
- **Google OAuth** - Social login integration

### 🎯 **User Experience**
- **Responsive Design** - Mobile-first approach with modern UI
- **Dark/Light Mode** - Theme switching support
- **Real-time Updates** - Live bidding and inventory updates
- **Profile Management** - User profiles with address management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/kisanconnect
   cd kisanconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/kisanconnect"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_SECRET_ID="your-google-client-secret"
   RESEND_API_KEY="your-resend-api-key"
   CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
   CLOUDINARY_API_KEY="your-cloudinary-key"
   CLOUDINARY_API_SECRET="your-cloudinary-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Tech Stack

- **Framework** - Next.js 15
- **Authentication** - NextAuth.js v5
- **Database** - PostgreSQL with Prisma ORM
- **Styling** - Tailwind CSS
- **Language** - TypeScript
- **UI Components** - Radix UI + shadcn/ui
- **Image Storage** - Cloudinary
- **Email Service** - Resend
- **Animation** - Framer Motion

## 📁 Project Structure

```
kisanconnect/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   ├── (admin)/           # Admin panel pages
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── layout/           # Layout components
│   ├── farmer/           # Farmer-specific components
│   └── bidding/          # Bidding-related components
├── lib/                  # Utility functions
├── prisma/               # Database schema
├── actions/              # Server actions
└── public/               # Static assets
```

## 🌟 Key Features Breakdown

### Authentication System
- **Email/Password Registration** with OTP verification
- **Google OAuth Integration** for quick signup
- **Password Recovery** with secure token-based reset
- **Role-based Authorization** (USER, SELLER, ADMIN)
- **Session Management** with JWT tokens

### Marketplace Features
- **Product Catalog** with search and filtering
- **Category-based Browsing** (Grains, Vegetables, Fruits, etc.)
- **Farmer Profiles** with ratings and reviews
- **Shopping Cart** with quantity management
- **Secure Checkout** process

### Bidding System
- **Live Auctions** with real-time updates
- **Bid History** and tracking
- **Automatic Bid Closure** with winner notification
- **Minimum Bid Increments** and validation

### Farmer Dashboard
- **Product Management** (CRUD operations)
- **Auction Management** with time controls
- **Sales Analytics** and reporting
- **Order Management** and fulfillment tracking

## 📝 Configuration

### Database Setup

The project uses PostgreSQL as the primary database. Update your `schema.prisma` file if you want to use a different database:

```prisma
// For PostgreSQL (Recommended)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// For MySQL
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// For SQLite (development only)
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Authentication Providers

Configure your authentication providers in the NextAuth configuration:

- **Credentials Provider** - Email/password authentication
- **Google Provider** - OAuth integration
- **Custom OTP System** - Email verification workflow

### Environment Variables

Required environment variables for the application:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kisanconnect"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_SECRET_ID="your-google-client-secret"

# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key"

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 🚗 Roadmap

### Phase 1 (Current)
- ✅ User Authentication System
- ✅ Basic Product Marketplace
- ✅ Bidding System Foundation
- ✅ Farmer Dashboard

### Phase 2 (In Progress)
- 🔄 Payment Integration
- 🔄 Order Management System
- 🔄 Real-time Notifications
- 🔄 Mobile App Development

### Phase 3 (Planned)
- 📋 Advanced Analytics Dashboard
- 📋 Multi-language Support (Nepali)
- 📋 Logistics Integration
- 📋 AI-powered Price Recommendations

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Support

If this project helped you, please consider giving it a star on GitHub!

---

**Built with ❤️ for Nepali Farmers by [KisanConnect Team](https://github.com/your-org/kisanconnect)**
