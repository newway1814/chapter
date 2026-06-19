---
name: Chapter
colors:
  surface: '#fcf8f7'
  surface-dim: '#ddd9d8'
  surface-bright: '#fcf8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e6'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444844'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#757874'
  outline-variant: '#c5c7c3'
  surface-tint: '#5e5f5d'
  primary: '#5e5f5d'
  on-primary: '#ffffff'
  primary-container: '#faf9f6'
  on-primary-container: '#727270'
  inverse-primary: '#c7c6c4'
  secondary: '#9f4121'
  on-secondary: '#ffffff'
  secondary-container: '#fd8862'
  on-secondary-container: '#732103'
  tertiary: '#625d5d'
  on-tertiary: '#ffffff'
  tertiary-container: '#fff7f7'
  on-tertiary-container: '#767171'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3e2e0'
  primary-fixed-dim: '#c7c6c4'
  on-primary-fixed: '#1a1c1a'
  on-primary-fixed-variant: '#464745'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59e'
  on-secondary-fixed: '#3a0b00'
  on-secondary-fixed-variant: '#802a0b'
  tertiary-fixed: '#e8e1de'
  tertiary-fixed-dim: '#ccc5c5'
  on-tertiary-fixed: '#1e1b1b'
  on-tertiary-fixed-variant: '#4a4644'
  background: '#fcf8f7'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-title:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  entry-heading:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-reading:
    fontFamily: Source Serif 4
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-reading-mobile:
    fontFamily: Source Serif 4
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
  ui-label-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  ui-label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  ui-label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  meta-date:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
spacing:
  container-margin: 24px
  stack-gap-lg: 32px
  stack-gap-md: 16px
  stack-gap-sm: 8px
  inline-padding: 12px
---

## Brand & Style

The design system is centered on the concept of digital slow-living. It rejects the frantic, high-velocity aesthetics of modern productivity apps in favor of a "digital memoir" experience. The target audience is individuals seeking a private, reflective space for introspective writing and memory preservation.

The design style is **Warm Minimalism**. It utilizes heavy whitespace to provide breathing room for the user’s thoughts, removing all visual "noise" such as gradients, shadows, or complex depth markers. The UI is completely flat, relying on intentional typography and a restrained color palette to create a sense of calm, permanence, and intellectual clarity. It should evoke the emotional response of opening a high-quality linen-bound notebook.

## Colors

The palette is anchored by an off-white background (`#FAF9F6`) which mimics the appearance of archival paper, reducing eye strain and providing a warmer atmosphere than pure white. 

- **Primary Background:** Used for all main surfaces to maintain a flat, unified plane.
- **Brand Accent:** A deep coral/rust (`#993C1D`) used sparingly for primary actions, active states, and emphasis.
- **Status Indicators:** Amber, Teal, and Gray are reserved strictly for calendar status dots and low-level metadata, ensuring they do not distract from the narrative content.
- **Typography:** The main text color is a soft charcoal (`#1C1917`) rather than pure black, maintaining the organic feel of the system.

## Typography

Typography is the primary vehicle for the brand’s personality. The system uses a tiered approach to distinguish between "Content" (the user's voice) and "Chrome" (the application's utility).

- **Narrative Content:** Uses *Playfair Display* for titles to evoke an editorial feel. *Source Serif 4* is used for long-form entry text for its exceptional legibility and classic bookish character.
- **UI Chrome:** Uses *Inter* for all functional elements (navigation, buttons, settings). This creates a clear mental boundary between the act of writing and the act of managing the app.
- **Hierarchy:** Generous line heights are used for the serif fonts to ensure a comfortable reading pace, while the sans-serif labels are kept compact and precise.

## Layout & Spacing

This design system follows a **Mobile-First Fixed Grid** philosophy. Since the application is centered on the intimate act of journaling, the layout focuses on a single, focused column of content.

- **Margins:** A generous 24px side margin is maintained on mobile (390px) to prevent text from feeling cramped against the screen edges.
- **Vertical Rhythm:** A 4px baseline grid is used to maintain consistent vertical rhythm. Larger gaps (32px) separate distinct journal entries or chapters, while smaller gaps (16px) separate headers from body text.
- **Touch Targets:** All interactive elements maintain a minimum 44px height/width, even if their visual footprint is smaller, ensuring ease of use without visual clutter.

## Elevation & Depth

This system intentionally avoids depth. There are no shadows, blurs, or Z-axis stacking metaphors.

- **Flat Hierarchy:** Visual hierarchy is achieved through scale, color contrast, and rule lines (1px strokes). 
- **Rule Lines:** Use a very faint tint of the primary text color (at 10% opacity) for horizontal separators to define sections without breaking the flow of the page.
- **Overlays:** When modals or sheets are necessary, they should appear as flat blocks of the background color with a 1px border, rather than casting a shadow over the content below.

## Shapes

The shape language is **Sharp**. To maintain the "archival paper" and "literary" aesthetic, all corners are 90-degree angles. This applies to buttons, input fields, images, and cards.

The lack of rounding reinforces the serious, grounded nature of the journaling experience and contrasts with the softer, rounded aesthetics typically found in social media or casual apps.

## Components

- **Buttons:** Primary buttons are solid blocks of the Brand Accent color (`#993C1D`) with white text. Secondary buttons use a 1px stroke of the Brand Accent with no fill. Always rectangular with 0px radius.
- **Input Fields:** Minimalist design with only a bottom border (1px) in a medium-gray tint. No background fill. The label should use the `ui-label-sm` style.
- **Cards/List Items:** Defined by whitespace and simple 1px dividers. No containing boxes or background changes for list items to keep the page feeling like a continuous sheet of paper.
- **Calendar Dots:** Small, 6px circles using the Amber, Teal, and Gray accent colors. These are the only rounded elements allowed in the system to differentiate data points from text.
- **Navigation:** A simple, text-based bottom bar or top header. Avoid heavy icons; prefer high-quality, lightweight line icons or text labels in *Inter*.
- **Journal View:** The focus of the app. The date is formatted using the `meta-date` style, followed by a `display-title`, then the `body-reading` text.
