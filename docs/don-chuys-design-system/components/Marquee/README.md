Scrolling ticker band of words separated by an icon: full-bleed energy between hero and content.

**Consumer provides:** `items` (3–6 short words), `tone` (`rose` | `marigold` | `agave`), `icon` (separator, default `sparkle`), `speed` (seconds per loop), `outline` (stroked letters), `reverse` (scroll the other way; use when stacking two).

- Screen readers get the list once via `aria-label`; motion stops under `prefers-reduced-motion`.
- Use it once per page, right under the hero.
