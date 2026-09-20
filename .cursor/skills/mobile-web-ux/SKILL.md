---
name: mobile-web-ux
description: >-
  iPhone Safari–first mobile web UX: viewport-fit cover, dvh, safe-area insets,
  44pt targets, tap not hover, sticky chrome clearance, drawers that lock body
  scroll, native momentum snap, and canvases that do not trap vertical paging.
  Use when building or fixing mobile layout, iOS Safari, touch vs hover, sheets,
  sticky bars, scroll-snap, WebGL/R3F viewers, or when the user mentions iPhone,
  Safari, UIKit, safe-area, or mobile usability.
---

# Mobile web UX (iPhone Safari first)

Craft distilled from **Hat** (Next.js landing + R3F) and **Grön Arcana** (Vite full-screen ritual). Brand look stays in the project. This skill owns **phone usability**.

Assume **Safari on iPhone** is the design target. Chrome DevTools is a preview, not proof.

## 1. Viewport and height

- `width=device-width, initial-scale=1, viewport-fit=cover`
- Next: `export const viewport = { viewportFit: "cover", themeColor }`
- Full screens: **`100dvh` / `min-h-dvh`**, never `100vh` for app chrome
- `-webkit-text-size-adjust: 100%`

```css
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left: env(safe-area-inset-left, 0px);
  --safe-right: env(safe-area-inset-right, 0px);
}
```

Pad with a floor so notched and non-notched both work:

```css
padding-top: max(1rem, var(--safe-top));
padding-bottom: max(1rem, var(--safe-bottom));
```

Fixed header / home-indicator bars must include the inset. Theme color should match the shell so Safari chrome does not flash a foreign color.

## 2. Hover is not a mobile input

There is **no hover** on a finger. Sticky `:hover` after tap is a bug.

```ts
window.matchMedia("(hover: hover) and (pointer: fine)").matches
```

| Desktop (`canHover`) | Phone |
|---|---|
| `:hover` reveals, idle spin, cursor glow | Always-visible meta, tap to toggle, `:active` press |
| Intro autoplay OK if cancellable | **No 3D/CSS autoplay** unless the user starts it |
| `hover:text-*` | `active:opacity-70` / `active:scale-[0.97]` |

Gate hover-only CSS with `md:` **and** a real hover MQ, or it will fire on touch.

Product flip / gallery: tap sets `data-active`; do not rely on `group-hover` on coarse pointers.

## 3. Touch targets and type

- Controls **≥ 44×44 CSS px** (`min-h-11 min-w-11`)
- Menu / Close / qty ± / bag icon included
- Inputs: comfortable padding + `font-size` ≥ 16px (or iOS zooms)
- `inputmode` + `autocomplete` for email / tel / otp
- Labels on icon nav in the **drawer**; icon-only is fine on a desktop rail

## 4. Sticky chrome vs content

If a bar is `position: fixed; bottom: 0`, every scroll section must clear it.

```css
--mobile-chrome-bottom: calc(<bar height> + var(--safe-bottom));
```

Use it on hero cues, form submit, 3D wear pads, gallery, footer. Footer `pb-28` guesses go stale; one token does not.

Opaque (or project-allowed paper) bars beat extra glass on already-busy stages.

## 5. Scroll

- Prefer **native momentum**. On iOS, `scroll-behavior: smooth` fights snap — use `auto` under `max-width: 767px`
- Section paging: `scroll-snap-type: y mandatory` + `scroll-snap-stop: normal` (fling can pass a section, still settles)
- Reduced motion: snap `proximity` or off; no decorative motion
- Nested sheets: `overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch`
- If the document is locked (`body { overflow: hidden }`), **opt in** scroll per screen so the last CTA is reachable (`padding-bottom` extra thumb room)

Full-viewport **canvas + `touch-none`** traps paging. Axis-lock instead:

1. `touch-action: pan-y` (reassert; OrbitControls will set `none`)
2. ~8px hysteresis, then `|dx| > |dy|` → gesture, else page scroll
3. After lock, `preventDefault` and drive the interaction 1:1

## 6. Drawers, sheets, dialogs

- Lock `document.body.style.overflow` while open; restore on close
- Escape closes; restore focus to the opener
- Scrim click dismisses; enter/exit the **same direction**
- Cap height with `dvh` (`min(82dvh, …)`) and pad all four safe-area sides
- Press feedback on **pointer down**, not after a CSS delay

## 7. Motion

Feel (not iOS chrome): response on down, 1:1 drag, interruptible, compositor `transform`/`opacity` only. Default springs critically damped (`bounce: 0`).

`prefers-reduced-motion: reduce`:

- Kill CSS animation / intro orbits / idle wobble
- Freeze WebGL time or swap to a still
- Cross-fade instead of elastic

Do not autoplay orbit/spin on phones. Always-on look-at is a different beat (Canopy): keep it if the product already chose that, and drop env/shadows via `webgl-product-runtime`. Rest pose can be a slight 3/4.

## 8. Contrast and density

- Dark stages need light type **or** a paper plate behind meta — never ink-on-fog
- One job per viewport; do not dump the desktop card stack onto a 390px screen
- Desktop hover chrome (meta, glow) is an invitation to move the cursor; on mobile show the facts

## Ship checklist

- [ ] Real iPhone Safari (or Playwright `iPhone 13` / WebKit), not only DevTools width
- [ ] Notch + home indicator: nothing under the status bar or the swipe-home strip
- [ ] Vertical swipe always pages (or the intended nested scroller); 3D/maps don’t steal it
- [ ] Next `Image` `sizes` matches the column (`calc(100vw - pad)` / `min(700px, 58vw)`), not `100vw`, unless the image is full-bleed
- [ ] A step pager’s bottom bar lists **every** step, including the first (Swarm). Do not mount the bar only inside a later view
- [ ] Phone copy is a short variant, not a 3-line clamp of the desktop paragraph
- [ ] No hover-only price, nav, or help
- [ ] 44pt targets; keyboard doesn’t zoom inputs
- [ ] Sticky bar doesn’t cover Scroll / primary CTA / segmented controls
- [ ] Drawer: body lock, Escape, focus return
- [ ] Reduced motion is actually still

## Don’t

- Don’t treat `100vh` as the iPhone viewport
- Don’t use `:hover` as the only affordance
- Don’t `touch-none` a full `svh`/`dvh` canvas on a scrolling page
- Don’t autoplay WebGL/CSS 3D on mobile
- Don’t invent icon SVGs (use the project’s icon set)
- Don’t copy Apple Settings/SF chrome or glass as the visual system
- Don’t ship mobile by shrinking desktop padding and calling it done
