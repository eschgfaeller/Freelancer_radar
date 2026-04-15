# 📊 Freelancer Earnings Radar

A mobile-first Progressive Web App (PWA) for freelancers to track daily earnings and forecast monthly income. Built with Next.js, TypeScript, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8) ![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)

## ✨ Features

- 📅 **Daily Status Tracking** — Tap any day to mark it as worked, vacation, sick, holiday, or free
- 💰 **Earnings Overview** — See total earned this month at a glance (big, bold numbers)
- 📈 **Income Forecast** — Real-time monthly income projection based on remaining workdays
- ⚠️ **Cost of Day Off** — Instantly see how much taking a day off costs you
- 💡 **Scenario Slider** — "What if" earnings calculator with interactive slider
- 📱 **PWA** — Install on your iPhone home screen for a native-like experience
- 🇨🇭 **Swiss Holidays** — Pre-configured with Swiss public holidays (Zürich canton)
- 💾 **Offline-First** — All data stored in localStorage, no account needed

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm**, **yarn**, or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/eschgfaeller/Freelancer_radar.git
cd Freelancer_radar

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📱 Install as PWA (iPhone)

1. Open the deployed app URL in **Safari**
2. Tap the **Share** button (box with arrow)
3. Scroll down and tap **“Add to Home Screen”**
4. Tap **“Add”**

The app will appear on your home screen and work offline!

## ⚙️ Default Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Daily Rate | CHF 1’100 | Your gross daily rate |
| Net Ratio | 65% | Percentage you keep after taxes/insurance |
| Working Days/Week | 5 | Standard work days per week |

**Daily Net = Daily Rate × Net Ratio = CHF 715.00**

All settings are editable via the ⚙️ Settings page and saved to your device.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | [TypeScript](https://typescriptlang.org) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Storage | `localStorage` (no backend) |
| PWA | Web App Manifest + Service Worker |
| Icons | Dynamic generation via `next/og` ImageResponse |

## 📦 Deploy on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **"New Project"**
4. Import your GitHub repository (`eschgfaeller/Freelancer_radar`)
5. Click **"Deploy"**

Vercel will automatically detect Next.js and configure the build. That’s it!

## 📁 Project Structure

```
src/
├── app/
│   ├── api/icon/         # Dynamic PWA icon generation
│   ├── settings/         # Settings page
│   ├── globals.css       # Global styles + range slider
│   ├── icon.tsx          # Favicon (auto-generated)
│   ├── apple-icon.tsx    # Apple touch icon (auto-generated)
│   ├── layout.tsx        # Root layout + PWA meta tags
│   ├── manifest.ts       # PWA manifest
│   └── page.tsx          # Main dashboard
├── components/
│   ├── Calendar.tsx      # Interactive month calendar grid
│   ├── CostOfDayOff.tsx  # Day-off cost alert
│   ├── EarningsHero.tsx  # Big earnings number display
│   ├── ForecastCard.tsx  # Monthly forecast card
│   ├── Header.tsx        # Sticky header bar
│   ├── MonthSelector.tsx # Month navigation
│   ├── ScenarioSlider.tsx# "What if" slider
│   ├── StatsGrid.tsx     # Stats grid (worked/vac/sick/etc.)
│   └── StatusPicker.tsx  # Bottom-sheet status selector
├── hooks/
│   ├── useDayData.ts     # Per-month day status management
│   ├── useLocalStorage.ts# Generic localStorage hook
│   └── useSettings.ts    # User settings hook
└── lib/
    ├── calculations.ts   # All earnings/forecast math
    ├── constants.ts      # Defaults, colors, labels
    ├── holidays.ts       # Swiss public holiday engine
    └── types.ts          # TypeScript interfaces
```

## 🧠 How Calculations Work

```
daily_net = daily_rate × net_ratio
total_earned = worked_days × daily_net

remaining_workdays = future weekdays - holidays - assigned days
expected_total = (worked_days + remaining_workdays) × daily_net

cost_of_day_off = daily_net
```

## License

MIT
