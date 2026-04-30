# Design Brief — Tutor Finder

## Aesthetic Direction

Premium, trusted, frictionless. Bold vivid gradient primary; minimal surfaces. Indian marketplace velocity. Zero clutter. Trust through social proof (ratings, verification, distance). Card-layered depth with soft shadows. Mobile-first Android UX. Funded-startup feel.

## Color Palette

| Role | Value | Purpose |
|------|-------|---------|
| Primary | oklch(0.55 0.22 280) | Vivid purple-lean blue-purple gradient base |
| Secondary | oklch(0.65 0.20 240) | Accent bright blue for highlights |
| Success | oklch(0.65 0.15 140) | Soft green for verified/trusted badges |
| Caution | oklch(0.72 0.18 50) | Warm orange for pending/attention states |
| Text | oklch(0.12 0 0) | Deep charcoal foreground (light mode) |
| Muted | oklch(0.55 0.02 0) | Slate secondary text |
| Background | oklch(0.99 0 0) | Pure white |
| Card | oklch(1.0 0 0) | White elevated cards |
| Border | oklch(0.92 0.01 0) | Soft grey dividers |
| Input | oklch(0.96 0.01 0) | Light grey form fields |

## Typography

| Tier | Font | Usage |
|------|------|-------|
| Display | General Sans (bold, 600–900) | Headers, CTAs, tutor names |
| Body | DM Sans (regular, 400–500) | Content, descriptions, form labels |
| Mono | Geist Mono (400–700) | Ratings, prices, distance, stats |

## Structural Zones

| Zone | Treatment |
|------|-----------|
| Header | Soft gradient border-b, subtle shadow separator |
| Content | Clean white bg, card-based hierarchy with 14px radius |
| Bottom Nav | Elevated bar with soft shadow, glass-frosted appearance |
| Card Interactive | bg-card, 14px radius, soft-shadow hover state |
| Form Inputs | 8px radius, border-2 primary focus state |
| Buttons | Primary/Secondary/Outline, 12px radius, scale-95 active |

## Spacing & Rhythm

Base grid: 16px. Micro: 4px gaps (tags, badges). Macro: 24px section breaks. Card padding: 16px internal, 12px gaps between. Dense mobile UX, no breathing room wasted.

## Component Patterns

**Cards**: elevated whites (shadow-card: 0 4px 12px rgba(0,0,0,0.08)), 14px radius. Tutor cards include: name (display), subjects (body), rating (mono + star icon), distance (mono), price (display bold), verification badge (trust-badge class), action buttons (btn-primary, btn-secondary, btn-outline).

**Buttons**: Full-width on mobile, fixed padding. Primary (gradient bg, white text), Secondary (solid accent), Outline (border + transparent). Active state: scale-95 depth. Hover: opacity-90 + shadow-hover.

**Inputs**: Border-focused UX. 8px radius, border-2 on default, border-primary on focus. Placeholder text in muted-foreground. Mobile keyboard-aware (no fixed footers).

**Badges**: Trust badges (bg-muted, rounded-full, xs text). Rating badges (bg-accent/10, text-accent). Chips (filter/select state-aware, chip + chip-active classes).

## Interactive Motion

Entrance: fade-in + slide-up (0.3s ease-out). Hover: shadow-hover transition (0.3s smooth). Card swipe (Tinder mode): transform 0.4s cubic-bezier. Active button: scale-95 (100ms). Loading: pulse-subtle (2s).

## 8-Screen Architecture

1. **Login (Phone OTP)**: Logo, phone input (input-field), "Send OTP" btn-primary, clean layout
2. **Mode Selection**: "How do you want to learn?" title, two large cards (Learn at Home, Go to Tutor), icons
3. **Requirements**: Class dropdown, subjects chips (chip + chip-active), budget slider, location input (input-field), "Find Tutors" btn-primary
4. **Tutor Listing**: "Top Matches for You", card-interactive tutor cards with ratings, distance, price, tags, Save/View Profile/Unlock buttons
5. **Swipe (Tinder)**: Full-screen card mode, swipe-right = interested, swipe-left = skip
6. **Unlock/Payment**: Blurred contact, "Unlock for ₹99" btn-primary, free unlock badge, trust elements
7. **Booking**: Calendar date picker, time slots, confirm btn-primary
8. **Review**: 5-star rating input, comment box (textarea), submit btn-primary

## Differentiation

Vivid gradient + premium typography + trust-focused card design = real startup. Every tutor card is a trust artifact (ratings, verification, experience). No generic purple, no flat UI. Indian marketplace speed: 4–5 taps max per flow. Bottom nav enables rapid mode-switching. Monetization visible (₹99 unlock) but non-intrusive.

## Dark Mode

Intentional inverse: backgrounds L: 0.13, cards L: 0.17, text L: 0.95. Primary L: 0.65 (brighter purple). Border L: 0.24. Maintains contrast AA+. Startup apps rarely ship dark mode; omitted unless requested.
