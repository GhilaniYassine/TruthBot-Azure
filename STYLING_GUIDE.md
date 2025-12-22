# 🎨 Chat Interface Styling & Animations Guide

## Overview
The chat interface uses a beautiful color scheme with smooth animations powered by Framer Motion and Tailwind CSS. This guide explains all visual elements and how to customize them.

## 🎯 Color Palette

### Primary Colors
```
Purple Gradient:  from-purple-600 to-blue-600
Purple (hover):   from-purple-700 to-blue-700
Accent Purple:    purple-500 / purple-400
Border Purple:    purple-500/30 (with transparency)
```

### Background Colors
```
Dark gradient:    from-slate-900 via-purple-900 to-slate-900
Darker variant:   from-slate-950 via-purple-950 to-slate-950
Card background:  slate-800/50 (semi-transparent)
Input background: slate-800 (dark slate)
```

### Text Colors
```
Primary text:     text-white (user messages, headers)
Secondary text:   text-slate-100 (regular content)
Muted text:       text-slate-400 (timestamps, metadata)
Disabled text:    text-slate-500 (disabled states)
```

### Verdict Type Colors

#### TRUE - Success Green
```
Icon color:       text-green-300
Border:           border-green-500/30
Background:       bg-green-500/10
Badge:            bg-green-500/20 text-green-300
Gradient:         from-green-400 to-emerald-500
```

#### FALSE - Danger Red  
```
Icon color:       text-red-300
Border:           border-red-500/30
Background:       bg-red-500/10
Badge:            bg-red-500/20 text-red-300
Gradient:         from-red-400 to-rose-500
```

#### PARTIALLY_TRUE - Warning Yellow
```
Icon color:       text-yellow-300
Border:           border-yellow-500/30
Background:       bg-yellow-500/10
Badge:            bg-yellow-500/20 text-yellow-300
Gradient:         from-yellow-400 to-amber-500
```

#### UNVERIFIABLE - Slate Gray
```
Icon color:       text-slate-300
Border:           border-slate-500/30
Background:       bg-slate-500/10
Badge:            bg-slate-500/20 text-slate-300
Gradient:         from-slate-400 to-slate-500
```

#### MISLEADING - Orange Alert
```
Icon color:       text-orange-300
Border:           border-orange-500/30
Background:       bg-orange-500/10
Badge:            bg-orange-500/20 text-orange-300
Gradient:         from-orange-400 to-red-500
```

## 🎬 Animations

### CSS Animations (index.css)
All animations are defined in `index.css` and available as Tailwind utilities.

#### Existing Animations
```css
animate-fade-in       /* Opacity 0 → 1, translateY 10px → 0 */
animate-slide-up      /* Opacity 0 → 1, translateY 30px → 0 */
animate-slide-down    /* Opacity 0 → 1, translateY -10px → 0 */
animate-pulse-soft    /* Soft pulse with scale */
animate-pulse-slow    /* Slow opacity pulse */
animate-shake         /* Shake left-right */
animate-bounce-slow   /* Slow vertical bounce */
animate-glow-pulse    /* Box-shadow glow effect */
animate-shimmer       /* Shimmer/shine effect */
animate-float         /* Floating motion */
```

### Framer Motion Animations
Used in ChatInterface, ChatMessage, and VerdictMessage components.

#### Container Variants
```typescript
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,  // 0.1s delay between children
    },
  },
};
```

#### Item Variants
```typescript
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};
```

#### Hover Effects
```typescript
whileHover={{ scale: 1.02 }}  // Slight scale on hover
whileHover={{ x: 5 }}         // Slide right on hover
whileHover={{ scale: 1.1 }}   // Larger scale on hover
```

### Loading Animation
```
Bouncing dots with staggered timing:
- Dot 1: animate-bounce (standard)
- Dot 2: animate-bounce + 0.1s delay
- Dot 3: animate-bounce + 0.2s delay

Colors: Purple and blue gradient
Size: w-2 h-2 (8px)
```

## 📐 Spacing & Layout

### ChatInterface Container
```
- Background: Full viewport (h-screen)
- Layout: Flex column (flex-col)
- Header: Fixed height, gradient background
- Messages: Flex-1 (takes remaining space), overflow-y-auto
- Input: Sticky bottom, dark background
```

### Messages Container
```
- Max width: 4xl (56rem)
- Padding: px-4 py-6
- Centered: mx-auto
- Gap: space-y-4 between messages
```

### Message Bubbles
```
User message (right-aligned):
- Max width: xs on mobile, md on desktop (max-w-xs lg:max-w-md)
- Padding: px-4 py-3
- Border radius: rounded-2xl
- No bottom-right radius: rounded-br-none

Bot message (left-aligned):
- Max width: xs on mobile, md on desktop
- Padding: px-4 py-3
- Border radius: rounded-2xl
- No bottom-left radius: rounded-bl-none
- Border: 2px border-purple-500/20
```

### Input Area
```
- Position: Sticky bottom
- Background: slate-900/80 with backdrop-blur-sm
- Padding: px-4 py-4
- Form layout: flex gap-3
- Input: flex-1 (takes remaining space)
- Button: Fixed size w-12 h-12
```

## 🎨 Tailwind Classes Used

### Text Classes
```
text-2xl font-bold       → Header title
text-sm font-semibold   → Section headers in verdict
text-xs                 → Timestamps, small text
text-gradient           → Gradient text effect
```

### Background Classes
```
bg-gradient-to-br       → Background gradient (top-left to bottom-right)
bg-gradient-to-r        → Verdict header gradients (left to right)
bg-slate-800/50         → Semi-transparent card background
bg-purple-600           → Button backgrounds
```

### Border Classes
```
border-2                → Verdict cards
border-purple-500/20    → Chat message borders
border-purple-500/30    → Input focus border
border-t                → Separator lines
```

### Shadow Classes
```
shadow-lg               → Verdict cards
shadow-xl               → Verdict cards (larger)
hover:shadow-purple-500/50  → Glow effect on hover
```

### Opacity Classes
```
opacity-50              → Disabled states
opacity-75              → Secondary text
opacity-90              → Slightly transparent headers
```

## 🔧 Customization Examples

### Change Verdict Header Color (TRUE)
**File:** `frontend/src/components/VerdictMessage.tsx`

```typescript
// Find verdictConfig
const verdictConfig = {
  TRUE: {
    color: "from-green-400 to-emerald-500",  // Change this
    // ... rest of config
  }
};
```

### Modify Message Bubble Width
**File:** `frontend/src/components/ChatMessage.tsx`

```typescript
<div className="max-w-xs lg:max-w-md ...">  // Change max-w-xs or max-w-md
```

### Change Input Placeholder Color
**File:** `frontend/src/components/ChatInterface.tsx`

```jsx
className="... placeholder-slate-400 ..."  // Change placeholder color
```

### Adjust Animation Duration
**File:** `frontend/src/components/VerdictMessage.tsx`

```typescript
// Change duration values in variants:
transition: { duration: 0.3 }  // Change 0.3 to any value in seconds
```

### Modify Header Height
**File:** `frontend/src/components/ChatInterface.tsx`

```jsx
<div className="... py-4 ...">  // py-4 controls padding, increase for height
```

## 🎯 Responsive Breakpoints

The design uses Tailwind's responsive prefixes:

```
Default (mobile-first)
sm:    640px+
md:    768px+   ← Most breakpoint in code
lg:    1024px+
xl:    1280px+
2xl:   1536px+
```

### Key Responsive Classes
```
max-w-xs lg:max-w-md     → Messages narrower on mobile
text-2xl                 → Header stays consistent
px-4                     → Consistent padding
```

## ✨ Visual Hierarchy

### Importance Levels
```
Level 1 (Most Important):
- User messages (purple gradient)
- Verdict cards (large, prominent)
- Header (full width, fixed)

Level 2 (Important):
- Bot messages (good contrast, clear)
- Input field (sticky, always visible)
- Sources (links in verdict)

Level 3 (Secondary):
- Timestamps (small, muted)
- Limitations (smaller font, muted background)
- Metadata (search count)
```

### Size Hierarchy
```
Largest:   Header (text-2xl), Verdict confidence (text-3xl)
Large:     Main message text (text-sm), Section headers (text-sm bold)
Small:     Timestamps, metadata (text-xs)
```

## 🌙 Dark Mode Support

The design primarily uses dark mode (slate-900/950 backgrounds). Light mode variables are defined in `index.css` but interface is optimized for dark theme.

To enable light mode toggle, you would:
1. Add a mode toggle button in Header
2. Use Tailwind's `dark:` prefix for alternate colors
3. Example: `bg-white dark:bg-slate-800`

## 📊 Performance Considerations

### GPU Acceleration
Animations use:
- `transform` for scale/translate (GPU accelerated)
- `opacity` for fading (GPU accelerated)
- Avoid animating: `width`, `height`, `padding` (CPU intensive)

### Browser Rendering
- Message list uses `overflow-y-auto` for efficient scrolling
- Framer Motion uses `will-change` CSS for optimized rendering
- Animations disabled reduce CPU usage significantly

## 🎬 Animation Timing Reference

| Animation | Duration | Easing |
|-----------|----------|--------|
| Message entrance | 0.5s | ease-out |
| Verdict item stagger | 0.1s | default |
| Item appearance | 0.3s | default |
| Hover scale | instant | default |
| Input focus ring | 0.2s | default |
| Loading dots | ∞ | ease-in-out |

## 🔨 Common Customization Tasks

### Make Verdict Cards Larger
```css
/* In VerdictMessage.tsx, change max-w-2xl */
className="max-w-2xl ..."  → "max-w-4xl ..."
```

### Speed Up All Animations
```typescript
// In variants, multiply all durations by 0.5:
transition: { duration: 0.5 * 0.5 }  // 0.25s instead of 0.5s
```

### Change Input Field Height
```jsx
className="... py-3 ..."  // Increase py-3 to py-4 or py-5
```

### Modify Verdict Card Spacing
```jsx
className="p-6 space-y-4"  // Change p-6 or space-y-4 values
```

## 📚 CSS Variables (Root)

Key variables defined in `index.css`:

```css
--background: 0 0% 98%;        /* Light background */
--foreground: 222 47% 11%;     /* Light text */
--primary: 263 70% 42%;        /* Purple primary */
--gradient-primary: linear-gradient(...);
--shadow-lg: 0 16px 48px...;
```

Customize in `.dark` mode section for dark theme (which we use).

---

## 🎓 Advanced Styling Tips

1. **Glassmorphism**: Use `backdrop-blur-sm` with `bg-opacity-50`
2. **Glow Effects**: Combine `shadow-lg` with colored shadow
3. **Gradient Text**: Use `bg-clip-text text-transparent` + gradient bg
4. **Smooth Transitions**: Add `transition-all duration-300`
5. **Active States**: Use `hover:` and `focus:` prefixes

## 📖 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [Color Psychology](https://www.color-hex.com/)

---

**Version:** 2.0 | **Last Updated:** November 2024 | **Status:** ✅ Production Ready
