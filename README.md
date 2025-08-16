# Modern Portfolio Website

A cutting-edge personal portfolio website showcasing innovation, AI, and data expertise with a strong emphasis on modern design, 3D ambient visuals, and artistic typography.

## 🚀 Features

- **3D Landing Experience**: Interactive abstract 3D scene using Three.js and React Three Fiber
- **Modern Design System**: Custom Tailwind CSS configuration with artistic typography
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Content Management**: Markdown-based content system for projects and posts
- **Performance Optimized**: Built with Next.js 14+ for optimal performance
- **Smooth Animations**: Framer Motion for seamless page transitions
- **SEO Ready**: Comprehensive meta tags and structured data

## 🛠 Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Three.js + React Three Fiber** - 3D graphics and animations

### Content Management
- **Markdown** - Content files with frontmatter
- **Gray Matter** - Frontmatter parsing
- **Custom Content API** - Type-safe content management

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Prettier** - Code formatting (recommended)

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   ├── projects/          # Projects pages
│   │   ├── content/           # Content pages
│   │   └── the-person/        # About page
│   ├── components/            # React components
│   │   ├── 3d/               # Three.js components
│   │   ├── ui/               # UI components
│   │   ├── layout/           # Layout components
│   │   └── content/          # Content components
│   ├── lib/                   # Utility functions
│   └── styles/               # Global styles
├── content/                   # Markdown content
│   ├── projects/             # Project markdown files
│   └── posts/                # Blog post markdown files
├── public/                    # Static assets
└── PORTFOLIO_SPECIFICATION.md # Detailed project specification
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Content Management

### Adding Projects

Create a new markdown file in `content/projects/`:

```markdown
---
title: "Project Title"
description: "Brief project description"
technologies: ["React", "Node.js", "AI/ML"]
github: "https://github.com/username/repo"
demo: "https://project-demo.com"
image: "/images/projects/project-name.jpg"
featured: true
date: "2024-01-15"
---

# Project content in markdown...
```

### Adding Posts

Create a new markdown file in `content/posts/`:

```markdown
---
title: "Post Title"
category: "book" | "tech" | "others"
description: "Post description"
date: "2024-01-15"
readTime: "5 min read"
external: "https://external-link.com" (optional)
image: "/images/posts/post-name.jpg"
tags: ["AI", "Innovation", "Review"]
---

# Post content in markdown...
```

## 🎨 Design System

### Colors
- **Primary**: Blue tones (#6366f1 to #312e81)
- **Secondary**: Orange tones (#f97316 to #431407)
- **Accent**: Coral (#ff6b6b), Amber (#fbbf24), Teal (#14b8a6), Purple (#8b5cf6)
- **Neutral**: Comprehensive gray scale (#ffffff to #09090b)

### Typography
- **Primary**: Inter (fallback for Satoshi)
- **Display**: Inter Display
- **Mono**: Space Grotesk

### Components
- Modern card designs with soft shadows
- Gradient backgrounds and text
- Smooth hover animations
- Responsive grid layouts

## 🔧 Customization

### Updating Colors
Edit `tailwind.config.ts` to modify the color palette:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      }
    }
  }
}
```

### Modifying 3D Scene
Edit `src/components/3d/AbstractScene.tsx` to customize the 3D elements:
- Change geometries and materials
- Adjust animation speeds and patterns
- Modify colors and lighting

### Content Categories
Update category types in `src/lib/content.ts` and corresponding components.

## 📱 Responsive Design

The website is fully responsive with optimizations for:
- **Desktop** (1024px+): Full 3D experience and complex layouts
- **Tablet** (768px-1023px): Optimized 3D scene and adapted layouts  
- **Mobile** (< 768px): Simplified 3D or static fallback, mobile-first layouts

## 🎯 Performance

### Optimization Features
- Progressive 3D scene loading
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Efficient bundle sizes with tree shaking

### Performance Targets
- **LCP**: < 2.5 seconds
- **FID**: < 100 milliseconds
- **CLS**: < 0.1
- **3D Performance**: 60fps desktop, 30fps mobile minimum

## 🚀 Deployment

### Recommended Platforms
- **Cloudflare Pages** (primary)
- **Vercel** (alternative)
- **Netlify** (alternative)

### Build Commands
```bash
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📞 Contact

- **Portfolio**: [Your Website]
- **LinkedIn**: [Your LinkedIn]
- **GitHub**: [Your GitHub]

---

Built with ❤️ using Next.js, Three.js, and modern web technologies.