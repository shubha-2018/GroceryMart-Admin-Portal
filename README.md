# 🥬 GroceryMart — Dedicated Admin Portal

Standalone Administrative Control Center for **GroceryMart**.

## 🚀 Features
- 📊 **Analytics & Metrics**: Live store revenue, total orders, catalog counts, and category breakdowns.
- 📦 **Products & Catalog**: Add, update, delete, stock monitoring, and direct image upload from your computer.
- 🏷️ **Promotional Offers ("Best Offers for You")**: Banner manager, coupon codes, and custom discount badges.
- 🛍️ **Orders Tracking**: Real-time status updates (Order Placed, Processing, Out for Delivery, Delivered, Cancelled).
- ✉️ **Customer Inquiries**: Support messages & inquiries inbox.
- 🔐 **Secure Admin Authentication**: Protected login route with persistent authentication.

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Icons**: Lucide React
- **Styles**: Custom Vanilla CSS & Responsive Modern Design System
- **API Connection**: Express.js + MySQL Backend

## 📦 Setup & Local Development
```bash
npm install
npm run dev
```
Runs locally at: `http://localhost:5174`

## ☁️ Vercel Deployment
1. Connect this repository to Vercel.
2. Root Directory: `./` (Root)
3. Framework Preset: `Vite`
4. Environment Variables:
   - `VITE_API_URL`: Your live backend API URL (e.g., `https://your-backend.onrender.com/api`)
   - `VITE_STORE_URL`: Your live storefront URL (e.g., `https://grocerymart.vercel.app`)
