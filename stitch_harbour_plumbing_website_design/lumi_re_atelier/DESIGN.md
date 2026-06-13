---
name: Lumière Atelier
colors:
  surface: '#fff8f2'
  surface-dim: '#e0d9d1'
  surface-bright: '#fff8f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2eb'
  surface-container: '#f4ede5'
  surface-container-high: '#eee7df'
  surface-container-highest: '#e8e1da'
  on-surface: '#1e1b17'
  on-surface-variant: '#4d463a'
  inverse-surface: '#33302b'
  inverse-on-surface: '#f7f0e8'
  outline: '#7e7668'
  outline-variant: '#d0c5b5'
  surface-tint: '#725b26'
  primary: '#725b26'
  on-primary: '#ffffff'
  primary-container: '#c6a96c'
  on-primary-container: '#523d0a'
  inverse-primary: '#e1c383'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#5f5e59'
  on-tertiary: '#ffffff'
  tertiary-container: '#aeaca6'
  on-tertiary-container: '#41403c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdf9d'
  primary-fixed-dim: '#e1c383'
  on-primary-fixed: '#251a00'
  on-primary-fixed-variant: '#594410'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e5e2db'
  tertiary-fixed-dim: '#c9c6c0'
  on-tertiary-fixed: '#1c1c18'
  on-tertiary-fixed-variant: '#474742'
  background: '#fff8f2'
  on-background: '#1e1b17'
  surface-variant: '#e8e1da'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: 0.05em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.03em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
    letterSpacing: 0.02em
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Literata
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Literata
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-caps:
    fontFamily: Literata
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.2em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 80px
  margin-mobile: 24px
  section-gap: 120px
---

## Brand & Style
The brand personality is rooted in "Quiet Luxury"—an aesthetic that prioritizes heritage, craftsmanship, and exclusivity over overt branding. The design system evokes the atmosphere of a private Parisian salon: intimate, hushed, and meticulously curated. 

The visual style is a blend of **Minimalism** and **High-Fashion Editorial**. It utilizes expansive white space (ivory) to allow product imagery to breathe, mimicking the physical experience of viewing jewelry under focused gallery lighting. Every interaction should feel deliberate and graceful, moving away from "app-like" density toward a digital concierge experience.

## Colors
The palette is a sophisticated study in neutrals, designed to complement the brilliance of gemstones and precious metals without competing with them.

- **Soft Ivory (#FAF9F6):** The primary canvas. It provides a warmer, more organic feel than pure white, suggesting high-quality stationery or silk wall coverings.
- **18k Gold (#C6A96C):** Used sparingly as an accent for call-to-actions, iconography, and decorative divider lines. It represents the "Lumière" (light) of the brand.
- **Deep Charcoal (#1A1A1A):** Used for typography and primary structural elements to ensure legibility and a sense of grounded authority.
- **Whisper Grey (#F4F1EA):** A secondary background color used for subtle section differentiation or "velvet" textured container backgrounds.

## Typography
The typography system relies on the contrast between the high-waisted, elegant serifs of Playfair Display and the exceptional readability of Literata (selected as a refined alternative to Lora for digital precision).

- **Headlines:** Must always feature generous letter-spacing (tracking) to convey an editorial, luxury feel.
- **Body Text:** Set with ample line-height to maintain a sense of "airiness" and facilitate long-form storytelling about gemstone provenance.
- **Labels:** Small-caps typography with wide tracking is used for navigation, categories, and utility text to create a distinct hierarchy from narrative content.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to maintain the integrity of editorial compositions, transitioning to a fluid model on mobile.

- **Airy Spacing:** The design system utilizes significant vertical rhythm. Section gaps are intentionally large (120px+) to ensure each product or story is viewed in isolation.
- **Asymmetry:** Occasional offset grid placements should be used for imagery to mimic the layout of a luxury lookbook.
- **Dividers:** Use 1px horizontal lines in Gold (#C6A96C) or Whisper Grey (#F4F1EA) to separate major thematic sections, replacing heavy containers with light, linear boundaries.

## Elevation & Depth
This design system rejects heavy shadows in favor of **Tonal Layers** and subtle depth.

- **Flat Depth:** Most elements sit directly on the Soft Ivory surface. Depth is communicated through the overlap of images and the use of the Whisper Grey (#F4F1EA) to indicate "inset" areas, like a velvet jewelry tray.
- **Micro-Shadows:** Only used for floating navigation or modals—very soft, diffused (#1A1A1A at 5% opacity) to suggest a light source from directly above.
- **Glassmorphism:** A very subtle backdrop blur (8px) is used for the header navigation on scroll to maintain a sense of the content passing underneath silk-screened glass.

## Shapes
The shape language is **Sharp (0)**. 

To reflect the precision of gemstone cutting and architectural jewelry design, all buttons, input fields, and image containers use 0px border radius. This architectural sharpness provides a disciplined counterpoint to the soft typography and ivory backgrounds, signaling "fine" craftsmanship.

## Components
- **Buttons:** Primary buttons are "ghost" style with a 1px Charcoal border or solid Charcoal with Ivory text. For "High-Luxury" actions (e.g., *Inquire about this piece*), use text-only links with a Gold underline that animates from center-out on hover.
- **Input Fields:** Minimalist design—only a 1px bottom border in Whisper Grey. Labels sit above in `label-caps`. 
- **Cards:** No borders or shadows. The image takes priority, followed by a centered headline and price. On hover, the image may subtly zoom or transition to a detail shot (macro of the setting).
- **Chips/Selectors:** For metal selection (18k Gold, Platinum), use small circular swatches with a 1px Gold ring indicating the active selection.
- **Lists:** Used in the "Details" accordion, separated by thin 1px Grey dividers. Icons are thin-stroke (1pt) Gold vectors.
- **Modals:** Full-screen overlays in Soft Ivory to maintain the private salon feel, rather than small pop-ups.