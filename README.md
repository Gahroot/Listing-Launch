# Listing Launch - Realtor Content Generation SaaS

**No Nonsense Content Generation Done For You, Not By You**

A modern SaaS application that instantly creates comprehensive marketing content for realtor property listings, including social media posts, videos, landing pages, and email templates.

## ✨ Features

### 🏠 **Complete Marketing Package Generation**
- **Social Media Content**: Captions and hashtags optimized for 6+ platforms including YouTube, Facebook, Instagram, LinkedIn, X (Twitter), and TikTok
- **Video Content**: AI-generated scripts and concepts for property tours and promotional videos
- **Landing Pages**: SEO-optimized microsites with lead capture forms
- **Email Marketing**: Professional templates with multiple subject line variations
- **Real-time Progress**: Live updates during the 6-step generation process

### 🎨 **Modern Dark Mode UI**
- Sleek dark theme with purple accent colors
- Responsive design optimized for all devices
- Professional Bento Box layout for content approval
- Interactive theme toggle (light/dark mode)

### ⚡ **Streamlined Workflow**
1. **Create** (`/create`) - Input property address, status, and agent branding
2. **Generate** (`/generate`) - Watch real-time progress as content is created
3. **Approve** (`/approve`) - Review, edit, and approve all generated content

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- n8n workflow endpoint (or use the included mock responses)

### Installation

1. **Clone and install dependencies:**
```bash
cd realtor-content-saas
npm install
```

2. **Configure environment variables:**
```bash
# Copy the environment template
cp .env.local.example .env.local

# Edit .env.local with your settings
N8N_WEBHOOK_URL=https://n8n.srv975468.hstgr.cloud/webhook-test/listing-launch
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Sample Test Data
Use this sample data to test the application:
- **Address**: `630 Vaughan Rd, Bloomfield Hills, MI 48304`
- **Status**: `For Sale` or `Recently Sold`
- **Agent Name**: `Nolan Grout`
- **Phone**: `248.225.9677`
- **Email**: `SOLD@NolanGrout.com`
- **Headshot URL**: `https://storage.googleapis.com/msgsndr/MtezI3tzORLaDpEMxDAM/media/68adf57c35b4091326c6dce4.jpeg`
- **Colors**: Primary: `#FFFFFF`, Secondary: `#e8e0d6`, Accent: `#7c89c9`

### Workflow Steps

1. **Property Creation** - Fill out the form with property details and agent information
2. **Content Generation** - Watch the 6-step progress as your marketing package is created
3. **Content Approval** - Review, edit, approve, and download your complete marketing package

## 🎯 Platform Support

### Social Media Platforms
- **YouTube** 📺 - Video descriptions, tags, and promotional content
- **Facebook** 📘 - Posts, carousels, and video content
- **Instagram** 📷 - Feed posts, Reels, and Stories
- **LinkedIn** 💼 - Professional posts and articles
- **X (Twitter)** 🐦 - Threads and media posts
- **TikTok** 🎵 - Vertical videos with trending hashtags

## 🔗 n8n Integration

The application integrates with n8n workflows via webhook at:
`https://n8n.srv975468.hstgr.cloud/webhook-test/listing-launch`

## 🛠️ Technical Stack
- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS v4 + Shadcn/ui components
- **Theme**: Next-themes for dark/light mode
- **Backend**: n8n workflow integration via webhooks
- **Deployment**: Vercel-ready configuration

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

---

**Built with modern web technologies for real estate professionals who need marketing content fast.** ⚡
