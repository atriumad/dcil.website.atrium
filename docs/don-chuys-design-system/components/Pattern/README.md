A repeating pattern fill (mask) coloured by a token: `talavera-tile`, `doodles`, `diamond`, `scallop`.

**Consumer provides:** `name`, `tone` (any colour token name, e.g. `sage-200`), optional `size` (tile px), `className`/`style` to position it (usually `position:absolute; inset:0` inside a relative parent).

- Patterns sit BEHIND content at low contrast: `sage-200` on `sage-100`, `paper-deep` on `cream`, `ornament` on `sage`. Text must never sit on a high-contrast pattern.
- One pattern per section.
