# AURA · AI Personality Configurator

> Build your own personalized AI assistant through a 16-question personality assessment.

## 🎯 What is AURA?

AURA is an interactive web application that helps you create a customized AI personality configuration. Answer 16 carefully designed questions about your communication style, work preferences, and relationship with AI, and we'll generate a comprehensive system prompt tailored to your needs.

## ✨ Features

- **16-Question Assessment**: Deep personality profiling across multiple dimensions
  - Interaction style (proactive, balanced, passive)
  - Communication style (concise, detailed, casual)
  - Feedback preferences (direct, gentle, supportive)
  - Task handling (planned, agile, options-based)
  - And 12 more dimensions...

- **Multi-Dimensional Analysis**: 
  - 5-axis personality radar chart
  - Animated stat bars showing Initiative, Clarity, Honesty, Execution, Empathy
  - Detailed personality breakdown

- **High-Quality Config Export**:
  - Professional system prompt with role definition, communication guidelines, work style, growth support
  - Markdown format with YAML frontmatter
  - Ready to use with any AI assistant

- **Beautiful UI**:
  - Dark theme with gradient accents
  - Smooth animations and transitions
  - Fully responsive (mobile, tablet, desktop)
  - Confetti celebration on completion

- **Multi-Language Support**: Chinese (中文) & English

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
git clone https://github.com/DW-WJ/aura-ai.git
cd aura-ai
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
aura-app/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Main entry point
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── pages/             # Page components
│   │   │   ├── WelcomePage.tsx
│   │   │   ├── QuizPage.tsx
│   │   │   ├── LoadingPage.tsx
│   │   │   ├── ResultPage.tsx
│   │   │   ├── RadarChart.tsx
│   │   │   └── StatsBars.tsx
│   │   └── ui/                # UI components
│   │       ├── Nav.tsx
│   │       ├── ParticleBackground.tsx
│   │       └── ProgressBar.tsx
│   ├── data/
│   │   └── questions.ts       # 16 assessment questions (ZH + EN)
│   ├── lib/
│   │   └── buildResult.ts     # Core personality matrix & config generation
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── package.json
└── tsconfig.json
```

## 🎨 Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: CSS animations + Canvas (for radar chart)
- **Deployment**: Vercel-ready

## 🧠 How It Works

1. **Assessment**: User answers 16 questions across 8 personality dimensions
2. **Analysis**: System calculates personality scores (0-100) for 5 core metrics
3. **Generation**: AI personality matrix generates:
   - Unique AI name (from curated pool)
   - Personality type label
   - Detailed description
   - Communication guidelines
   - Work style directives
   - Growth support strategies
4. **Export**: User can copy or download the config as `.md` file

## 📊 Personality Dimensions

| Dimension | Scale | Examples |
|-----------|-------|----------|
| **Initiative** | Proactive ↔ Passive | Defines how much AI should volunteer information |
| **Clarity** | Concise ↔ Detailed | Communication style preference |
| **Honesty** | Frank ↔ Gentle | Feedback delivery method |
| **Execution** | Agile ↔ Planned | Task handling approach |
| **Empathy** | Professional ↔ Warm | Emotional tone |

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Self-Hosted

```bash
npm run build
# Deploy the `.next` directory to your server
```

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit PRs.

## 📧 Contact

Questions? Reach out to [@DW-WJ](https://github.com/DW-WJ)

---

**Built with ❤️ to help you find your perfect AI companion**
