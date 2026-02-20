# ReceiptAI - The Anti-Gaslighting Money App 🧾💰

**"Your receipts don't lie. Find out where your money really went."**

## Overview

ReceiptAI is a modern web application that helps you track inflation's impact on your spending by analyzing receipts and comparing prices to 2022 baselines. Built with React, TypeScript, and Tailwind CSS, it features a dark theme with neon green accents and smooth animations.

## Features

### 📸 Receipt Scanning
- Upload any receipt (JPG, PNG, PDF)
- AI-powered line item extraction
- Real-time price comparison vs 2022 baselines

### 📊 Inflation Tracking
- Track overpayment vs historical prices
- Monthly spending trends visualization
- Category breakdown with charts
- Rage Score meter

### 💀 Subscription Graveyard
- Automatic subscription detection
- Unused subscription alerts
- Monthly waste calculation
- One-click cancellation links

### 🔥 Price Gouging Leaderboard
- Top 5 most overpriced items
- Price increase percentages
- Historical price comparisons

### 🎨 Beautiful UI
- Dark mode with glass-morphism effects
- Smooth Framer Motion animations
- Responsive design for all devices
- Interactive charts with Recharts

### 📤 Shareable Reports
- Generate beautiful report cards
- Download as PNG
- Share to social media
- Viral-ready content

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Routing:** React Router v7
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Image Export:** html2canvas

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will be available at `http://localhost:5173/`

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
│   ├── LandingPage.tsx
│   ├── Dashboard.tsx
│   ├── ScanResults.tsx
│   ├── Insights.tsx
│   └── Settings.tsx
├── services/       # Business logic and data services
├── stores/         # Zustand state management
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── index.css       # Global styles and Tailwind config
```

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The app is configured for zero-config deployment to Vercel with the included `vercel.json`.

## Features Roadmap

- [ ] Real OCR integration
- [ ] Email subscription scanning
- [ ] Price alert notifications
- [ ] Historical price database
- [ ] Multi-currency support
- [ ] Mobile app (React Native)

## License

See LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a PR.

---

**© 2025 ReceiptAI. Your receipts don't lie.**
