# Modern Portfolio Website Specification

## Project Overview

A cutting-edge personal portfolio website showcasing innovation, AI, and data expertise with a strong emphasis on modern design, 3D ambient visuals, and artistic typography. The site will reflect both professional capabilities and personal personality through abstract, ever-changing visual elements.

## Technical Architecture

### Core Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with custom design system
- **3D Graphics**: Three.js with React Three Fiber
- **Typography**: Custom artistic fonts (Inter Display, Playfair Display, or Satoshi)
- **Animations**: Framer Motion for page transitions
- **Content**: Markdown files with frontmatter
- **Deployment**: Cloudflare Pages (primary) / Vercel (fallback)
- **Performance**: Progressive loading, device-specific optimizations

### Project Structure
```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Landing)
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── content/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── the-person/
│   │       └── page.tsx
│   ├── components/
│   │   ├── 3d/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── content/
│   ├── lib/
│   │   ├── content.ts
│   │   └── utils.ts
│   └── styles/
├── content/
│   ├── projects/
│   └── posts/
├── public/
└── package.json
```

## Site Architecture & Pages

### 1. Landing Page (`/`)
**Theme**: Abstract, Personal Expression
- **3D Scene**: Continuously transforming abstract patterns
  - Flowing geometric shapes that morph and evolve
  - Color gradients that shift subtly over time
  - Particle systems creating organic movement
  - Non-interactive but mesmerizing ambient visuals
- **Content**:
  - Hero section with name and tagline
  - Brief introduction overlay on 3D background
  - Smooth scroll indicators
  - Social links (LinkedIn, GitHub)
- **Performance**: Optimized 3D rendering with fallbacks for mobile

### 2. Projects Gallery (`/projects`)
**Theme**: Innovation Showcase
- **Layout**: Modern gallery grid with hover effects
- **Features**:
  - Masonry-style layout for visual interest
  - Project cards with preview images/videos
  - Hover animations revealing project details
  - Click to expand with full project information
  - Direct links to GitHub repositories
  - Live demo links where applicable
- **Project Data**: Stored in markdown files with frontmatter
- **Categories**: No filtering, but visual distinction for different project types

### 3. Content Center (`/content`)
**Theme**: Knowledge & Insights
- **Categories**: 
  - Books (reviews and insights)
  - Tech (technical posts and tutorials)
  - Others (external links, miscellaneous content)
- **Layout**:
  - Category tabs with smooth transitions
  - Card-based layout for posts
  - Rich preview cards for external content
  - Reading time estimates
  - Publication dates
- **Initial Content**: 10 posts across categories
- **Content Format**: Markdown files with rich frontmatter

### 4. The Person (`/the-person`)
**Theme**: Personal Story
- **Content**:
  - Personal narrative and background
  - Professional journey and philosophy
  - Values and approach to innovation
  - Personal interests (non-hobby focused)
  - Contact information and social presence
- **Design**: More intimate, storytelling layout

## Design System

### Typography
- **Primary Font**: Satoshi (modern, personality-driven)
- **Secondary Font**: Inter Display (clean, readable)
- **Accent Font**: Space Grotesk (technical, modern)
- **Artistic Elements**: Custom lettering for hero sections

### Color Palette
- **Primary**: Deep blues and purples (innovation/tech theme)
- **Secondary**: Warm accents (coral, amber)
- **Neutral**: Modern grays with high contrast
- **3D Scene**: Dynamic color shifting (blues → purples → teals)

### Visual Elements
- **Gradients**: Subtle, modern gradients throughout
- **Shadows**: Soft, layered shadows for depth
- **Borders**: Minimal, when used
- **Spacing**: Generous whitespace for breathing room

## 3D Scene Specifications

### Concept: "Personal Expression Engine"
An abstract, continuously evolving 3D scene that represents creativity and innovation:

#### Visual Elements
1. **Morphing Geometry**:
   - Fluid, organic shapes that transform over time
   - Geometric patterns that emerge and dissolve
   - Layered transparency effects

2. **Dynamic Patterns**:
   - Flowing lines that connect and disconnect
   - Particle systems with organic movement
   - Gradient shifts across surfaces

3. **Animation Loops**:
   - 60-90 second transformation cycles
   - Smooth, continuous motion
   - No jarring transitions or repetitive patterns

#### Technical Implementation
- **Performance**: 60fps on desktop, 30fps mobile minimum
- **Responsive**: Simplified version for mobile devices
- **Loading**: Progressive enhancement with fallback static image
- **Memory Management**: Efficient geometry updates and cleanup
