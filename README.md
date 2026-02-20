# ReceiptAI - The Anti-Gaslighting Money App 🧠💰

> "Your receipts don't lie. Find out where your money really went."

ReceiptAI is a viral-ready web application that helps users track inflation, expose price gouging, and share their financial discoveries. Built for 2026, this app fills a universal niche by providing the "financial truth machine" everyone needs during times of economic anxiety.

## 🔥 The Viral App Concept for 2026

**Core Niche:** Everyone is economically anxious right now. Inflation, hidden fees, subscription creep, price gouging. People FEEL broke but can't prove why. This app is the financial truth machine.

### How It Works 🎯

**Snap → Scan → Story**

1. 📸 Photo any receipt (restaurant, grocery, gas) — AI extracts every line item instantly
2. 📊 Inflation tracker — "This grocery run cost you $23 more than it would have in 2022"
3. ⚠️ Price gouging alerts — Flags items priced above regional averages
4. 💀 Subscription grave digger — Connects to email, surfaces forgotten recurring charges
5. 📈 Your Money Personality — Weekly shareable report card (the viral hook 🎣)

### Why It Goes Viral 💥

- **Shareable rage content** — "I'm paying 47% more for eggs than 2021" posts EVERYWHERE
- **Satisfying UI** — Receipt scanning is oddly satisfying
- **Zero competition** — Mint/YNAB are budgeting. This is economic journalism for your wallet
- **Built-in viral loop** — User scans receipt → Gets shocking stat → Shares to social → Friend downloads → Repeat

## ✨ Features

### Landing Page (/)
- Animated hero section with receipt scanning visual
- Feature cards showcasing core functionality
- Pricing tiers (Free & Pro)
- Social proof ticker

### Dashboard (/app)
- **Quick Scan Panel**: Drag & drop or click-to-upload receipt images
- **Recent Scans**: Quick access to previously scanned receipts
- **Inflation Hit Card**: Year-to-date overpayment vs 2022 baseline
- **Rage Score Meter**: Price gouging indicator (0-100)
- **Monthly Spend Chart**: 6-month spending history
- **Category Breakdown**: Donut chart of spending by category

### Scan Results (/scan/:id)
- Detailed item-by-item breakdown
- Price comparison to 2022 baseline
- Price gouging badges for items >30% above average
- Summary statistics
- Share functionality

### Insights (/insights)
- **Your Money Story**: AI-generated weekly narrative
- **Subscription Graveyard**: Track unused subscriptions with wasted $ amounts
- **Price Gouging Leaderboard**: Top 5 most overpriced items

### Share Page (/share/:id)
- Beautiful shareable card generator (Spotify Wrapped style)
- Download as PNG for social media
- Twitter share integration
- Copy link functionality

### Settings (/settings)
- User profile management
- Notification preferences
- Connected accounts (Gmail, Bank)
- Currency and region selector
- Pro upgrade options

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Visualization**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Image Export**: html2canvas

## 🎨 Design System

- **Color Palette**:
  - Primary Background: `#0D0F1A` (Deep Navy)
  - Primary Accent: `#00FF85` (Electric Green)
  - Text: White on dark background
- **Typography**:
  - UI: Inter
  - Headings: Space Grotesk
- **Style**: Dark mode only, glass-morphism cards, smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/brandonlacoste9-tech/Receipts-checker-.git

# Navigate to the project directory
cd Receipts-checker-

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

The app is ready for deployment to Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 📊 Mock Data

The app includes realistic mock data for demonstration:

- **15 pre-loaded receipt scans** with actual grocery/restaurant/gas items
- **Inflation multipliers**: Groceries 1.23x, Gas 1.31x, Dining 1.18x
- **User profile**: Alex Chen, Pro Member
- **8 subscription services** with realistic usage data
- **6-month spending history**
- **Total inflation hit**: $1,247 YTD

## 📱 Mobile Responsive

- Collapsible sidebar for mobile devices
- Touch-optimized interactions
- Responsive charts and layouts
- Mobile-first design approach

## 🔒 Security

- ✅ CodeQL security scan: 0 vulnerabilities
- ✅ No sensitive data exposure
- ✅ Input validation on all forms
- ✅ XSS protection via React

## 📈 Monetization Strategy

| Layer | Revenue |
|-------|---------|
| Freemium (5 scans/mo) | User acquisition |
| Pro ($4.99/mo) | Unlimited + insights |
| Brand partnerships | Grocery chains want this data |
| API licensing | Banks, fintechs, journalists |

## 📄 License

See LICENSE file for details.

---

**Built with ❤️ and 🔥 for people tired of being gaslit about their money.**
