Page-opening section in four variants. `photo` (v4 default for Home): centred headline + two CTAs, a wide photo on a `chuy-rose` band, flowers, postmark stamp and a fiesta tile band. `stack` (v3 default for Home): a full `WordStack` — giant repeated food word, plate, script and stickers — with a dark bar holding the lede and CTAs. `split`: cream ground with doodles, huge Anton headline with an italic accent, CTAs, arch photo, floating plate and stamp. `poster`: the sage poster look for campaigns (LUNCH T!ME) with talavera side borders and three floating plates.

**Consumer provides:** `variant` (`photo` | `stack` | `split` | `poster`), `title` (split: use `*word*` for the accent; poster: use the `!` swap), `eyebrow`, `lede`, `primary`/`secondary` labels, `image` `{src, alt}` (split), `plates` `[{src, alt}]` (3 for poster, 1 for split), `stamp`.

- One hero per page. Home uses `photo`; specials/campaign pages `stack` or `poster`; inner pages `split`.
- Titles: 2–4 words.
