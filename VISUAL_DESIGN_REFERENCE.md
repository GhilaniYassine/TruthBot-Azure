# 🎨 Chat Interface - Visual Design Reference

## Interface Overview

```
╔════════════════════════════════════════════════════════════════╗
║ 🔍 TruthBot - AI-Powered Fact-Checking                    [New] ║ ← Header
╠════════════════════════════════════════════════════════════════╣
║                                                                  ║
║                                                                  ║
║   Welcome! 👋 I'm TruthBot, your AI-powered fact-checking    │   ║
║   assistant. Ask me to verify any claim, and I'll dive        │   ║
║   deep into the web to find the truth. What would you like    │   ║
║   me to fact-check today?                                     │   ║
║                                                                  ║ ← Messages
║   Your claim is false, the moon is not made of cheese. 👤 │    ║   Area
║                                                                  ║
║   Checking your claim...                                    🤖 │   ║
║                                                                  ║
║   ╔══════════════════════════════════════════════════════════╗ ║
║   ║ ✅ CORRECT 🎉                      Confidence: 95%      ║ ║
║   ╠══════════════════════════════════════════════════════════╣ ║
║   ║ Claim: "The moon is Earth's natural satellite"         ║ ║
║   ║                                                         ║ ║
║   ║ Analysis: This claim is scientifically accurate...    ║ ║
║   ║                                                         ║ ║
║   ║ Sources: 🔗 [NASA Official - 2024]                    ║ ║
║   ║         🔗 [Scientific Consensus...]                 ║ ║
║   ║                                                         ║ ║
║   ║ Limitations: 📌 Based on current scientific data      ║ ║
║   ║            Evidence from 47 sources                    ║ ║
║   ╚══════════════════════════════════════════════════════════╝ ║
║                                                                  ║
│   That's correct! ✅ The evidence strongly supports this      │   ║
│   claim.                                                      │   ║
║                                                                  ║
├──────────────────────────────────────────────────────────────────┤
│ [Enter a claim to fact-check... e.g., 'The moon is made...] [✈️] │ ← Input
╚════════════════════════════════════════════════════════════════╝
```

## Message Types

### User Message
```
┌──────────────────────────┐
│ 🎨 Color: Purple Gradient│ → Right-aligned
│ 📝 Font: Regular weight  │
│ ⏰ Timestamp: Below text │
└──────────────────────────┘
```

**Example:**
```
                    ┌────────────────────────┐
                    │ The moon is round      │
                    │ 2:34 PM                │
                    └────────────────────────┘
```

### Bot Message
```
┌────────────────────────────┐
│ 🎨 Color: Slate-800/50     │ ← Left-aligned
│ 🎀 Border: Purple accent   │
│ 📝 Font: Regular weight    │
│ ⏰ Timestamp: Below text   │
└────────────────────────────┘
```

**Example:**
```
┌────────────────────────────────┐
│ That's correct! ✅ The evidence│
│ strongly supports this claim.  │
│ 2:35 PM                        │
└────────────────────────────────┘
```

### Loading Message
```
⏸ ⏸ ⏸
(Bouncing dots, alternating colors)
Appears while API processes claim
```

## Verdict Card Layout

```
╔════════════════════════════════════════════════════════════════╗
║                                                                 ║
║  Header Row                                                    ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ ✅ CORRECT  🎉          Confidence Score: 95%           │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                                 ║
║  Claim Section                                                 ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ Claim                                                    │ ║
║  │ "Your statement goes here"                              │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                                 ║
║  Analysis Section                                              ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ Analysis                                                 │ ║
║  │ Detailed reasoning about the verdict and why it was     │ ║
║  │ determined to be true or false...                       │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                                 ║
║  Sources Section                                               ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ Sources                                                  │ ║
║  │ 🔗 Source Title 1                                        │ ║
║  │    domain.com                                            │ ║
║  │ 🔗 Source Title 2                                        │ ║
║  │    anotherdomain.com                                     │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                                 ║
║  Limitations Section                                           ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ 📌 Limitations                                           │ ║
║  │ • Limitation 1 explaining context                        │ ║
║  │ • Limitation 2 providing caveats                         │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                                 ║
║  Analyzed 47 web sources                                       ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
```

## Verdict Type Colors

### TRUE (Green) ✅
```
Header:     from-green-400 to-emerald-500
Icon:       CheckCircle2 (green)
Badge:      Green background, green text
Background: Green tinted
```

### FALSE (Red) ❌
```
Header:     from-red-400 to-rose-500
Icon:       XCircle (red)
Badge:      Red background, red text
Background: Red tinted
```

### PARTIALLY_TRUE (Yellow) ⚠️
```
Header:     from-yellow-400 to-amber-500
Icon:       AlertCircle (yellow)
Badge:      Yellow background, yellow text
Background: Yellow tinted
```

### UNVERIFIABLE (Gray) ❓
```
Header:     from-slate-400 to-slate-500
Icon:       HelpCircle (gray)
Badge:      Gray background, gray text
Background: Gray tinted
```

### MISLEADING (Orange) 🚨
```
Header:     from-orange-400 to-red-500
Icon:       Eye (orange)
Badge:      Orange background, orange text
Background: Orange tinted
```

## Animation Timeline

### Message Entrance (0.5s)
```
Time  Opacity  TranslateY  Description
0%    0%       +20px       Hidden below
25%   25%      +15px       Fading in
50%   50%      +10px       Moving up
75%   75%      +5px        Almost visible
100%  100%     0px         Fully visible
```

### Verdict Card Stagger (0.1s between items)
```
Item 1 (Header):     Starts at 0.0s, finishes at 0.3s
Item 2 (Claim):      Starts at 0.1s, finishes at 0.4s
Item 3 (Analysis):   Starts at 0.2s, finishes at 0.5s
Item 4 (Sources):    Starts at 0.3s, finishes at 0.6s
Item 5 (Limits):     Starts at 0.4s, finishes at 0.7s
```

### Loading Indicator
```
Time    Dot 1      Dot 2      Dot 3
0%      Bottom     Bottom     Bottom
25%     Up         Bottom     Bottom
50%     Up         Up         Bottom
75%     Bottom     Up         Up
100%    Bottom     Bottom     Up
```

## Responsive Behavior

### Desktop (> 1024px)
```
Message max-width: 28rem (md)
Chat max-width: 56rem (4xl)
Header height: auto
Padding: 24px
Font sizes: Standard
```

### Tablet (768px - 1024px)
```
Message max-width: 20rem (xs + adjustments)
Chat max-width: 48rem (3xl)
Header height: auto
Padding: 16px
Font sizes: Slightly smaller
```

### Mobile (< 768px)
```
Message max-width: 20rem (xs)
Chat max-width: full width
Header height: auto
Padding: 16px
Font sizes: Reduced for smaller screens
Input: Full-width, larger touch targets
```

## Color Reference

### Primary Gradient
```
┌──────────────────────────────────┐
│ from-purple-600 to-blue-600      │
│ #9333EA → #2563EB                │
└──────────────────────────────────┘
```

### Background Gradient
```
┌──────────────────────────────────┐
│ from-slate-900 via-purple-900    │
│ to-slate-900                     │
│ #0F172A → #2D1B69 → #0F172A      │
└──────────────────────────────────┘
```

### Text Colors
```
Primary:      #FFFFFF (white)
Secondary:    #E2E8F0 (slate-200)
Muted:        #94A3B8 (slate-400)
Disabled:     #64748B (slate-500)
```

### Message Bubble Colors
```
User:         Gradient purple-600 to blue-600
Bot:          Slate-800/50 with border
Border:       Purple-500/20
```

## Typography Hierarchy

```
H1: Header Title (TruthBot)
    ├─ Font Size: text-2xl (28px)
    ├─ Weight: font-bold (700)
    └─ Color: white

H2: Verdict Badge (CORRECT, INCORRECT, etc.)
    ├─ Font Size: text-sm (14px)
    ├─ Weight: font-semibold (600)
    └─ Color: badge color

H3: Section Headers (Claim, Analysis, Sources)
    ├─ Font Size: text-sm (14px)
    ├─ Weight: font-semibold (600)
    └─ Color: slate-300

Body: Message and Verdict Text
    ├─ Font Size: text-sm (14px)
    ├─ Weight: font-regular (400)
    └─ Color: slate-200

Small: Timestamps, Metadata
    ├─ Font Size: text-xs (12px)
    ├─ Weight: font-regular (400)
    └─ Color: slate-400
```

## Spacing Reference

```
Header:
  Padding Y: py-4 (16px)
  Padding X: px-4 (16px)
  Gap: gap-3 (12px)

Messages:
  Container gap: space-y-4 (16px)
  Padding: px-4 py-6 (16px, 24px)
  Message padding: px-4 py-3 (16px, 12px)

Input:
  Padding: px-4 py-4 (16px, 16px)
  Gap: gap-3 (12px)
  Input height: py-3 (12px padding = ~44px total)
```

## Shadow Effects

```
Subtle:  shadow-lg
         0 10px 15px -3px rgba(0,0,0,0.1)

Hover:   shadow-xl + hover:shadow-purple-500/50
         0 16px 24px -4px rgba(0,0,0,0.15)
         0 0 40px rgba(147, 51, 234, 0.5)

Glow:    shadow-lg with color-specific shadow
         Custom glow based on verdict type
```

## Border Styles

```
Header border-b:     border-b border-purple-500/20
Message border:      border border-purple-500/20
Input border focus:  border-2 border-purple-500
Card border:         border-2 border-color/30

Border Radius:
- Messages:          rounded-2xl
- Cards:             rounded-2xl
- Input:             rounded-full
- Button:            rounded-full
```

## Interactive Elements

### Button
```
Default:   bg-gradient-to-r from-purple-600 to-blue-600
Hover:     from-purple-700 to-blue-700
Active:    Translate Y -2px
Disabled:  opacity-50, cursor-not-allowed
Focus:     ring-2 ring-purple-500/50
```

### Input Field
```
Default:   border-2 border-purple-500/30
Focus:     border-2 border-purple-500
           ring-2 ring-purple-500/20
Active:    Solid border color
Disabled:  opacity-50, cursor-not-allowed
```

### Links (Sources)
```
Default:   text-blue-300 (implied by link)
Hover:     Translate X 5px (slide right)
           bg-slate-700/50 (background highlight)
Active:    Darker text color
Focus:     ring-2 ring-blue-500
```

## Micro-interactions

### Hover Effects
```
Messages:        Scale to 1.02 (2% larger)
Verdict Cards:   Scale to 1.02, shadow increases
Source Links:    Translate X 5px (slide right)
Buttons:         Translate Y -2px (press effect)
Input:           Border color transitions
```

### Focus States
```
Input:     Ring appears around field
           Border color changes
           Text input cursor visible
           
Buttons:   Ring effect appears
           Background slightly brighter
           Cursor changes to pointer
```

### Active States
```
Buttons:   Shadow increases (press effect)
Input:     Cursor blinks in field
Messages:  Scale animates
Cards:     All items animate in sequence
```

## Accessibility Features

```
Semantic HTML:
  <button> for clickable elements
  <input> for form inputs
  <a> for links
  Proper heading hierarchy

Color Contrast:
  Text on buttons: WCAG AAA compliant
  Text on backgrounds: WCAG AA minimum
  Focus indicators: Clear and visible

Keyboard Navigation:
  Tab order: Logical flow
  Enter key: Submit forms
  Escape: Could dismiss modals (if added)
```

---

## Quick Reference Checklist

✅ **Colors are properly themed**
✅ **Spacing is consistent**
✅ **Typography is hierarchical**
✅ **Animations are smooth**
✅ **Interactive states are clear**
✅ **Mobile layout is responsive**
✅ **Accessibility is built-in**
✅ **Dark mode is optimized**

---

**Version:** 2.0 | **Last Updated:** November 2024
**Visual Design Status:** ✅ Complete and Polished
