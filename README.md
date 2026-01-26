# Oriental Oracle - AI-Powered Fortune Stick Reading

A modern, elegant web application that brings the ancient Chinese tradition of fortune stick reading (关帝灵签) into the digital age, enhanced with AI-powered deep interpretations.

## 🌟 Features

- **Traditional Fortune Stick Drawing**: Experience the authentic ritual of drawing fortune sticks
- **AI-Powered Deep Interpretation**: Get personalized, psychological insights based on your question and drawn stick
- **Beautiful UI/UX**: Elegant design with oriental mystique, featuring golden accents and premium aesthetics
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Save & Share**: Save your readings as images and access your collection
- **Bilingual Support**: English interface with Chinese original poetry

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Integration**: OpenRouter API (Claude, GPT-4, DeepSeek)
- **Image Export**: html2canvas

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenRouter API key (for AI interpretations)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd 签筒抽签解读
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_MODEL=anthropic/claude-3.5-sonnet  # Optional, defaults to Claude 3.5 Sonnet
   NEXT_PUBLIC_APP_URL=http://localhost:3000  # Your app URL
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Ask a Question**: Enter your question on the `/ask` page
2. **Draw a Stick**: Shake your device or click to draw a fortune stick
3. **View Results**: See your fortune stick reading on the results page
4. **Get AI Interpretation**: Unlock the deep AI-powered interpretation (requires payment)
5. **Save Your Reading**: Save as an image or to your collection

## 🔧 Configuration

### OpenRouter Setup

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get your API key from the dashboard
3. Add it to `.env.local` as `OPENROUTER_API_KEY`

See [OPENROUTER_SETUP.md](./OPENROUTER_SETUP.md) for detailed setup instructions.

### Supported AI Models

The app supports multiple AI models with automatic fallback:
- Claude 3.5 Sonnet (default)
- GPT-4 / GPT-4 Turbo
- DeepSeek Chat / DeepSeek Coder
- GPT-3.5 Turbo

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── interpret/      # AI interpretation API
│   ├── ask/                # Question input page
│   ├── toss/               # Fortune stick drawing page
│   ├── result-en/          # Results page (English)
│   ├── interpret/          # AI deep interpretation page
│   └── history/            # Saved readings collection
├── lib/
│   ├── fortune-sticks.ts   # Fortune stick data utilities
│   ├── ai-prompt.ts        # AI prompt generation
│   └── signs.json          # Fortune stick database
└── public/                 # Static assets
```

## 🎨 Design Philosophy

The application emphasizes:
- **Oriental Mystique**: Traditional Chinese aesthetics with modern design
- **Premium Feel**: High-quality visuals and smooth animations
- **User Experience**: Intuitive flow and responsive interactions
- **Accessibility**: Clear typography and readable content

## 🔒 Security Notes

- Never commit `.env.local` to version control
- API keys are server-side only
- User data is stored in browser localStorage (will be migrated to database)

## 🚧 Roadmap

- [ ] User authentication (Google OAuth)
- [ ] Payment integration (Stripe/PayPal)
- [ ] Database integration (Supabase)
- [ ] User accounts and cloud sync
- [ ] Social sharing features
- [ ] Multi-language support

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For inquiries, please contact the repository owner.

## 📧 Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ by BANXIA LAB
