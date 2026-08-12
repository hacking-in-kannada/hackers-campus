---
name: Cyber-Sentinel Interface
colors:
  surface: '#0a141e'
  surface-dim: '#0a141e'
  surface-bright: '#303a46'
  surface-container-lowest: '#050f19'
  surface-container-low: '#131c27'
  surface-container: '#17202b'
  surface-container-high: '#212b36'
  surface-container-highest: '#2c3641'
  on-surface: '#d9e3f2'
  on-surface-variant: '#c0cbae'
  inverse-surface: '#d9e3f2'
  inverse-on-surface: '#28313d'
  outline: '#8a947a'
  outline-variant: '#404a34'
  surface-tint: '#87dd00'
  primary: '#ffffff'
  on-primary: '#1e3700'
  primary-container: '#9bfc00'
  on-primary-container: '#427000'
  inverse-primary: '#3e6a00'
  secondary: '#c2c7cd'
  on-secondary: '#2c3135'
  secondary-container: '#42474c'
  on-secondary-container: '#b1b5bb'
  tertiary: '#ffffff'
  on-tertiary: '#28313a'
  tertiary-container: '#dae3ee'
  on-tertiary-container: '#5c656f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9bfc00'
  primary-fixed-dim: '#87dd00'
  on-primary-fixed: '#0f2000'
  on-primary-fixed-variant: '#2e4f00'
  secondary-fixed: '#dfe3e9'
  secondary-fixed-dim: '#c2c7cd'
  on-secondary-fixed: '#171c20'
  on-secondary-fixed-variant: '#42474c'
  tertiary-fixed: '#dae3ee'
  tertiary-fixed-dim: '#bec7d2'
  on-tertiary-fixed: '#131d24'
  on-tertiary-fixed-variant: '#3f4851'
  background: '#0a141e'
  on-background: '#d9e3f2'
  surface-variant: '#2c3641'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-md:
    fontFamily: Courier Prime
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 20px
  container-max: 1440px
---

## Brand & Style
The design system adopts a **"Cybersecurity Mission Control"** aesthetic, characterized by high-contrast utility and precision-engineered layouts. The core personality is technical, authoritative, and high-performance, catering to a sophisticated user base in the cybersecurity and developer space.

The style is a fusion of **Corporate Modern** efficiency and **Technological Minimalism**. It leverages deep charcoal surfaces to eliminate visual noise, using razor-sharp neon highlights to draw immediate attention to critical status changes and primary actions. Every element is designed to feel like a module within a tactical command center, emphasizing clarity, speed, and functional hierarchy.

## Colors
The palette is built on a foundation of "Deep Space" grays to ensure maximum contrast for the **Neon Lime** accent. 

- **Primary Action:** Neon Lime (#9DFF00) is reserved exclusively for interactive elements, progress bars, and critical success states.
- **Surface Hierarchy:** The background layers move from the deepest value (#090E12) to the most elevated surface (#10171D) to create depth without using shadows.
- **Borders:** Use `#1C252D` for structural separation and `#151D23` for subtle internal divisions.
- **Status Colors:** Use high-saturation tones for system feedback to ensure visibility against the dark background.

## Typography
IBM Plex Sans provides the industrial, systematic feel required for a technical interface. 

- **Hierarchy:** Use `display-lg` sparingly for dashboard overviews. `label-md` should be used for category headers and metadata, often paired with `text-muted`.
- **Contrast:** High-level headers use `text-primary`. Secondary descriptions and supporting text must use `text-secondary` or `text-muted` to prevent visual fatigue.
- **Monospaced Content:** For IP addresses, code snippets, or hash values, utilize a monospaced alternative to maintain the "hacker" utility feel.

## Layout & Spacing
The layout follows a **Strict Grid** philosophy. Elements are aligned to a 4px baseline to ensure mathematical precision.

- **Desktop:** 12-column fluid grid with 20px gutters. Content is housed in "Modules" (Cards) that clearly define workspace boundaries.
- **Margins:** Use 32px (xl) for outer page margins and 16px (md) for internal component padding.
- **Density:** This design system favors a medium-high density to allow large amounts of data to be visible at once without scrolling.

## Elevation & Depth
Elevation is communicated through **Tonal Layering** and **Border Definition** rather than traditional shadows.

1. **Level 0 (Background):** #090E12 (The canvas).
2. **Level 1 (Sub-modules):** #0C1217 with a 1px border of #151D23.
3. **Level 2 (Active Cards/Modals):** #10171D with a 1px border of #1C252D.

For floating elements like dropdowns or tooltips, a subtle 10% black outer glow can be used to separate the component from the surface below, but the primary indicator of depth remains the stepping of background colors and the use of the Accent Primary (#9DFF00) for active focus borders.

## Shapes
The shape language is controlled and modern. We avoid sharp 0px corners to prevent a "retro-brutalist" look, opting instead for refined geometric curves.

- **Buttons & Inputs:** Use the 8px (sm) radius.
- **Cards & Content Modules:** Use the 10px (md) radius.
- **Large Modals & Containers:** Use the 12px (lg) radius.
- **Interactive States:** On focus, use a 2px solid border of Neon Lime to highlight the shape of the element.

## Components
- **Buttons:** 
  - *Primary:* Solid #9DFF00 background with #090E12 text.
  - *Secondary:* Transparent background with 1px #1C252D border, text in #E9EDF0.
  - *Ghost:* No border, #9DFF00 text, #17270A background on hover.
- **Input Fields:** Background #0C1217, 1px border #1C252D. On focus, the border changes to #9DFF00.
- **Chips/Tags:** Small 8px radius. Background #151D23, text #98A2B0. Active chips use #17270A background and #9DFF00 text.
- **Cards:** Background #10171D with a 1px #1C252D border. Headers within cards should be separated by a 1px #151D23 horizontal line.
- **Progress Indicators:** Use the Neon Lime (#9DFF00) for the fill and #151D23 for the track.
- **Data Tables:** Zebra striping is not used. Use 1px #151D23 horizontal borders between rows. Header row should use `label-md` typography.