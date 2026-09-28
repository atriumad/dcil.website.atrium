# Responsive & accessibility

## Breakpoints (mobile first)
- Under `bp-sm` (640px): one column, `gutter-mobile` 20px, display sizes drop to their mobile values (see the brand book), hero photo stacks under the copy, `Marquee` items 26px.
- `bp-sm`–`bp-md`: dish and location grids go 2-up.
- `bp-md` (768px): full `NavBar` links replace the menu button.
- `bp-lg` (1024px): split heroes, 3-up dishes, 4-up locations, 2-column menu.
- `bp-xl` (1280px): container reaches `container-max`.

## Touch & interaction
- Minimum target 44×44px (buttons `md`/`lg`, tabs, nav toggle).
- Phone numbers are `tel:` links; addresses link to maps.
- Hover effects are enhancements only; nothing is hidden behind hover.

## Accessibility rules
- Focus: 3px solid `focus` ring, 2px offset, on every interactive element.
- Text pairs follow the brand book's colour pairs (4.5:1 body, 3:1 for 24px+). Never place body text over a pattern at full contrast or over a photo without `overlay`.
- Every dish photo gets alt text that names the dish ("Chicken fajitas in a cast-iron skillet").
- Spicy / Veggie markers always have a text label (`title` on the icon, or a Pill with the word).
- Decorative elements (`Pattern`, `TileBand`, `Stamp`) are `aria-hidden`; `Marquee` exposes its words once.
- Motion stops under `prefers-reduced-motion`.
- Menus are real HTML text, never images or PDFs only.
