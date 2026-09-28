/* Don Chuy's web components — source. Built to components/bundle.js (IIFE, window.DonChuys). */
import ICONS from './icons.json';
const React = window.React;
const { useState, useId } = React;
const cx = (...a) => a.filter(Boolean).join(' ');

/* ---------- primitives ---------- */
export function Icon({ name, size = 24, title, className, strokeWidth }) {
  const body = ICONS.icons[name];
  if (!body) return null;
  return (
    <svg className={cx('dc-icon', className)} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round"
      role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}
      dangerouslySetInnerHTML={{ __html: body }} />
  );
}
Icon.names = Object.keys(ICONS.icons);

export function Button({ variant = 'primary', size = 'md', href, icon, iconLeft, className, children, ...rest }) {
  const cls = cx('dc-btn', 'dc-btn-' + variant, 'dc-btn-' + size, className);
  const inner = [
    iconLeft ? <Icon key="l" name={iconLeft} size={size === 'lg' ? 20 : 18} /> : null,
    <span key="t">{children}</span>,
    icon ? <Icon key="r" name={icon} size={size === 'lg' ? 20 : 18} className="dc-btn-icon" /> : null,
  ];
  return href ? <a href={href} className={cls} {...rest}>{inner}</a> : <button type="button" className={cls} {...rest}>{inner}</button>;
}

export function Pill({ tone = 'outline', size = 'md', icon, className, children }) {
  return (
    <span className={cx('dc-pill', 'dc-pill-' + tone, size === 'sm' && 'dc-pill-sm', className)}>
      {icon ? <Icon name={icon} size={size === 'sm' ? 14 : 16} /> : null}{children}
    </span>
  );
}

/** Headline helper: "Real-deal *de* León" → italic serif accent between stars; "!" swap left to the author. */
function renderAccent(text) {
  if (typeof text !== 'string') return text;
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? <em key={i} className="dc-accent">{part.slice(1, -1)}</em> : part);
}

export function SectionHeader({ eyebrow, title, lede, align = 'left', size = 'l', tone = 'default', className }) {
  return (
    <header className={cx('dc-sh', 'dc-sh-' + align, 'dc-sh-' + size, tone === 'inverse' && 'dc-sh-inverse', className)}>
      {eyebrow ? <p className="dc-sh-eyebrow"><Icon name="sparkle" size={14} />{eyebrow}</p> : null}
      <h2 className="dc-sh-title">{renderAccent(title)}</h2>
      {lede ? <p className="dc-sh-lede">{lede}</p> : null}
    </header>
  );
}

/* ---------- decoration ---------- */
export function TileBand({ tone = 'fiesta', height = 48, edge = 'both', className }) {
  return <div className={cx('dc-tileband', 'dc-tileband-' + tone, edge !== 'none' && 'dc-tileband-edge-' + edge, className)} style={{ height }} aria-hidden="true"><span /></div>;
}

export function Pattern({ name = 'talavera-tile', tone = 'sage-200', size, className, style }) {
  return <div aria-hidden="true" className={cx('dc-pattern', className)}
    style={Object.assign({ backgroundColor: 'var(--' + tone + ')', WebkitMaskImage: 'var(--dc-pattern-' + name + ')', maskImage: 'var(--dc-pattern-' + name + ')', WebkitMaskSize: size ? size + 'px' : undefined, maskSize: size ? size + 'px' : undefined }, style)} />;
}

export function Stamp({ text = "DESDE LEÓN · FRESH MEX & CANTINA · ", icon = 'chile', size = 132, tone = 'marigold', spin = true, className }) {
  const id = useId().replace(/:/g, '');
  return (
    <div className={cx('dc-stamp', 'dc-stamp-' + tone, spin && tone !== 'postmark' && 'dc-stamp-spin', className)} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="dc-stamp-ring">
        <defs><path id={'c' + id} d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" /></defs>
        <text><textPath href={'#c' + id} textLength="272">{text}</textPath></text>
      </svg>
      <span className="dc-stamp-core"><Icon name={icon} size={Math.round(size * 0.28)} /></span>
    </div>
  );
}

export function Marquee({ items = ['Fresh Mex', 'Cantina', 'Happy Hour', 'Daily Specials', 'Family recipes'], tone = 'rose', icon = 'sparkle', speed = 40, outline, reverse, className }) {
  const row = items.map((t, i) => <React.Fragment key={i}><span className="dc-mq-item">{t}</span><Icon name={icon} size={22} className="dc-mq-sep" /></React.Fragment>);
  return (
    <div className={cx('dc-mq', 'dc-mq-' + tone, outline && 'dc-mq-outline', reverse && 'dc-mq-reverse', className)} role="marquee" aria-label={items.join(', ')}>
      <div className="dc-mq-track" style={{ animationDuration: speed + 's' }} aria-hidden="true">{row}{row}{row}{row}</div>
    </div>
  );
}

/* ---------- media ---------- */
export function PhotoFrame({ src, alt = '', shape = 'arch', ratio, sticker, stickerTone = 'white', ground, className, style }) {
  return (
    <figure className={cx('dc-photo', 'dc-photo-' + shape, ground && 'dc-photo-ground', className)}
      style={Object.assign({ aspectRatio: ratio || (shape === 'circle' ? '1' : shape === 'arch' ? '4 / 5' : shape === 'polaroid' ? '4 / 5' : '4 / 3') }, ground ? { '--dc-ground': 'var(--' + ground + ')' } : null, style)}>
      {shape === 'polaroid' ? <span className="dc-photo-tape" aria-hidden="true" /> : null}
      {src ? <img src={src} alt={alt} loading="lazy" /> : <span className="dc-photo-empty"><Icon name="utensils" size={32} /></span>}
      {sticker ? <Pill tone={stickerTone} className="dc-photo-sticker">{sticker}</Pill> : null}
    </figure>
  );
}

/* ---------- navigation ---------- */
export function NavBar({ links = ['Menu', 'Specials', 'Happy Hour', 'Locations', 'About'], active, brand, cta = 'Order Online', ctaHref = '#', variant = 'cream', className }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cx('dc-navwrap', className)}><nav className={cx('dc-nav', 'dc-nav-' + variant, open && 'is-open')} aria-label="Main">
      <a href="#" className="dc-nav-brand">{brand || <span className="dc-nav-wordmark">Don Chuy's</span>}</a>
      <ul className="dc-nav-links">
        {links.map((l) => <li key={l}><a href="#" className={cx('dc-nav-link', l === active && 'is-active')} aria-current={l === active ? 'page' : undefined}>{l}</a></li>)}
      </ul>
      <div className="dc-nav-end">
        {cta ? <Button href={ctaHref} variant={variant === 'rose' ? 'marigold' : 'primary'} size="sm" icon="arrow-up-right">{cta}</Button> : null}
        <button type="button" className="dc-nav-toggle" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button>
      </div>
    </nav></div>
  );
}

export function CategoryTabs({ items = ['Tacos', 'Fajitas', 'Mariscos', 'Burritos', 'Bowls', 'Drinks'], value, onChange, className }) {
  const [cur, setCur] = useState(value || items[0]);
  const sel = value || cur;
  return (
    <div className={cx('dc-tabs', className)} role="tablist" aria-label="Menu categories">
      {items.map((t) => (
        <button key={t} type="button" role="tab" aria-selected={t === sel} className={cx('dc-tab', t === sel && 'is-active')}
          onClick={() => { setCur(t); onChange && onChange(t); }}>{t}</button>
      ))}
    </div>
  );
}

/* ---------- content blocks ---------- */
export function Hero({ variant = 'split', eyebrow, title, lede, primary = 'View Menu', secondary = 'Find a Location', image, plates = [], stamp = true, className }) {
  if (variant === 'photo') {
    return (
      <section className={cx('dc-hero', 'dc-hero-photo', className)}>
        <Flower className="dc-hero-flower dc-hero-flower-l" size={110} />
        <Flower className="dc-hero-flower dc-hero-flower-r" size={84} />
        <div className="dc-hero-photo-copy">
          {eyebrow ? <p className="dc-hero-photo-eyebrow">{eyebrow}</p> : null}
          <h1 className="dc-hero-photo-title">{renderAccent(title)}</h1>
          {lede ? <p className="dc-hero-lede">{lede}</p> : null}
          <div className="dc-hero-ctas">
            {primary ? <Button>{primary}</Button> : null}
            {secondary ? <Button variant="outline">{secondary}</Button> : null}
          </div>
        </div>
        <div className="dc-hero-photo-media">
          <span className="dc-hero-photo-band" aria-hidden="true" />
          <div className="dc-hero-photo-img">{image ? <img src={image.src} alt={image.alt} /> : null}</div>
          {stamp ? <Stamp tone="postmark" className="dc-hero-photo-stamp" size={120} text="DESDE LEÓN · FRESH MEX · " /> : null}
        </div>
        <TileBand height={44} edge="none" />
      </section>
    );
  }
  if (variant === 'stack') {
    return (
      <section className={cx('dc-hero', 'dc-hero-stack', className)}>
        <WordStack word={title} image={plates[0]} tone="teal" script={eyebrow} stickers={[{ kind: 'label', text: "LET'S TACO\n'BOUT IT", pos: 'br' }, { kind: 'burst', text: 'FROM $7', pos: 'tr' }]} />
        <div className="dc-hero-stack-bar">
          {lede ? <p className="dc-hero-lede">{lede}</p> : null}
          <div className="dc-hero-ctas">
            {primary ? <Button size="lg" icon="arrow-right">{primary}</Button> : null}
            {secondary ? <Button size="lg" variant="cream" iconLeft="pin">{secondary}</Button> : null}
          </div>
        </div>
      </section>
    );
  }
  if (variant === 'poster') {
    return (
      <section className={cx('dc-hero', 'dc-hero-poster', className)}>
        <Pattern name="talavera-tile" tone="ornament" className="dc-hero-edge dc-hero-edge-l" size={64} />
        <Pattern name="talavera-tile" tone="ornament" className="dc-hero-edge dc-hero-edge-r" size={64} />
        <div className="dc-hero-poster-inner">
          {eyebrow ? <Pill tone="outline">{eyebrow}</Pill> : null}
          <h1 className="dc-hero-hand">{title}</h1>
          {lede ? <p className="dc-hero-lede">{lede}</p> : null}
          <div className="dc-hero-plates">
            {plates.slice(0, 3).map((p, i) => <PhotoFrame key={i} src={p.src} alt={p.alt} shape="circle" className={'dc-hero-plate dc-hero-plate-' + i} />)}
          </div>
          <div className="dc-hero-ctas">
            {primary ? <Button size="lg" icon="arrow-right">{primary}</Button> : null}
            {secondary ? <Button size="lg" variant="cream">{secondary}</Button> : null}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className={cx('dc-hero', 'dc-hero-split', className)}>
      <Flower className="dc-hero-flower dc-hero-flower-l" size={96} /><Flower className="dc-hero-flower dc-hero-flower-r" size={72} />
      <div className="dc-hero-copy">
        {eyebrow ? <Pill tone="rose" icon="flame">{eyebrow}</Pill> : null}
        <h1 className="dc-hero-title">{renderAccent(title)}</h1>
        {lede ? <p className="dc-hero-lede">{lede}</p> : null}
        <div className="dc-hero-ctas">
          {primary ? <Button size="lg" icon="arrow-right">{primary}</Button> : null}
          {secondary ? <Button size="lg" variant="outline" iconLeft="pin">{secondary}</Button> : null}
        </div>
      </div>
      <div className="dc-hero-media">
        <PhotoFrame src={image && image.src} alt={image && image.alt} shape="arch" className="dc-hero-arch" />
        {plates[0] ? <PhotoFrame src={plates[0].src} alt={plates[0].alt} shape="circle" className="dc-hero-float" /> : null}
        {stamp ? <Stamp className="dc-hero-stamp" /> : null}
      </div>
    </section>
  );
}

export function DishCard({ name, description, price, image, tags = [], variant = 'plate', href, className }) {
  return (
    <article className={cx('dc-dish', 'dc-dish-' + variant, className)}>
      <div className="dc-dish-media">
        {variant === 'plate' ? <Pattern name="talavera-tile" tone="surface" className="dc-dish-pattern" size={56} /> : null}
        <PhotoFrame src={image && image.src} alt={image && image.alt} shape={variant === 'plate' ? 'circle' : 'rounded'} />
        {price ? <span className="dc-dish-price">{price}</span> : null}
      </div>
      <div className="dc-dish-body">
        {tags.length ? <div className="dc-dish-tags">{tags.map((t) => <Pill key={t} size="sm" tone={t === 'Spicy' ? 'rose' : 'navy'} icon={t === 'Spicy' ? 'chile' : undefined}>{t}</Pill>)}</div> : null}
        <h3 className="dc-dish-name">{href ? <a href={href}>{name}</a> : name}</h3>
        {description ? <p className="dc-dish-desc">{description}</p> : null}
      </div>
    </article>
  );
}

export function MenuItem({ name, description, price, tags = [], featured, className }) {
  return (
    <div className={cx('dc-mi', featured && 'dc-mi-featured', className)}>
      <div className="dc-mi-head">
        <span className="dc-mi-name">{name}{tags.map((t) => <Icon key={t} name={t === 'Spicy' ? 'chile' : t === 'Veggie' ? 'avocado' : 'sparkle'} size={16} title={t} className="dc-mi-tag" />)}</span>
        <span className="dc-mi-dots" aria-hidden="true" />
        <span className="dc-mi-price">{price}</span>
      </div>
      {description ? <p className="dc-mi-desc">{description}</p> : null}
    </div>
  );
}

export function MenuSection({ title, note, items = [], className }) {
  return (
    <section className={cx('dc-ms', className)}>
      <header className="dc-ms-head"><h3 className="dc-ms-title">{title}</h3>{note ? <span className="dc-ms-note">{note}</span> : null}</header>
      <div className="dc-ms-list">{items.map((it, i) => <MenuItem key={i} {...it} />)}</div>
    </section>
  );
}

export function SpecialRow({ day, item, price, note, onDark, className }) {
  return (
    <div className={cx('dc-special', onDark && 'dc-special-dark', className)}>
      <span className="dc-pill dc-pill-navy dc-special-day">{day}</span>
      <span className="dc-special-body">
        <span className="dc-special-item">{item}{price ? ' ' : null}{price ? <b className="dc-special-price">{price}</b> : null}</span>
        {note ? <span className="dc-special-note">{note}</span> : null}
      </span>
    </div>
  );
}

export function SpecialsBoard({ title = 'Daily Specials', subtitle = 'Every day a special — all day', specials = [], drinks = [], className }) {
  return (
    <section className={cx('dc-board', className)}>
      <TileBand className="dc-board-edge dc-board-edge-t" height={36} edge="none" />
      <div className="dc-board-inner">
        <h2 className="dc-board-title">{title}</h2>
        {subtitle ? <p className="dc-board-sub">{subtitle}</p> : null}
        <div className="dc-board-rows">{specials.map((s, i) => <SpecialRow key={i} {...s} />)}</div>
        {drinks.length ? (
          <div className="dc-board-drinks">
            <Pill tone="outline">Everyday drinks</Pill>
            <div className="dc-board-drinklist">{drinks.map((d, i) => <span key={i}><Icon name={d.icon || 'margarita'} size={22} />{d.name} <b>{d.price}</b></span>)}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function FeatureSplit({ eyebrow, title, body, cta, ctaHref = '#', image, reverse, ground = 'sage-100', className }) {
  return (
    <section className={cx('dc-feat', reverse && 'dc-feat-reverse', className)} style={{ '--dc-ground': 'var(--' + ground + ')' }}>
      <div className="dc-feat-media"><PhotoFrame src={image && image.src} alt={image && image.alt} shape="rounded" ratio="5 / 4" /></div>
      <div className="dc-feat-copy">
        <SectionHeader eyebrow={eyebrow} title={title} size="m" />
        {(Array.isArray(body) ? body : [body]).filter(Boolean).map((p, i) => <p key={i} className="dc-feat-body">{p}</p>)}
        {cta ? <Button href={ctaHref} variant="agave" icon="arrow-right">{cta}</Button> : null}
      </div>
    </section>
  );
}

export function PromoBanner({ kicker, title = 'HAPPY *hour*', lede, deals = [], cta = 'See Happy Hour', ctaHref = '#', tone = 'marigold', className }) {
  return (
    <section className={cx('dc-promo', 'dc-promo-' + tone, className)}>
      <Pattern name="doodles" tone={tone === 'marigold' ? 'marigold-700' : 'rose-100'} className="dc-promo-doodles" size={220} />
      <div className="dc-promo-copy">
        {kicker ? <Pill tone={tone === 'marigold' ? 'ink' : 'marigold'} icon="clock">{kicker}</Pill> : null}
        <h2 className="dc-promo-title">{renderAccent(title)}</h2>
        {lede ? <p className="dc-promo-lede">{lede}</p> : null}
      </div>
      {deals.length ? <ul className="dc-promo-deals">{deals.map((d, i) => <li key={i}><Icon name={d.icon || 'margarita'} size={28} /><span>{d.name}</span><b>{d.price}</b></li>)}</ul> : null}
      {cta ? <Button href={ctaHref} size="lg" variant={tone === 'marigold' ? 'ink' : 'cream'} icon="arrow-right" className="dc-promo-cta">{cta}</Button> : null}
    </section>
  );
}

export function LocationCard({ city, address, phone, hours = [], comingSoon, href = '#', cta = 'Get Directions', className }) {
  return (
    <article className={cx('dc-loc', comingSoon && 'dc-loc-soon', className)}>
      <header className="dc-loc-head">
        <h3 className="dc-loc-city">{city}</h3>
        {comingSoon ? <Pill tone="marigold" size="sm">Coming soon</Pill> : <Icon name="pin" size={22} className="dc-loc-pin" />}
      </header>
      {address ? <p className="dc-loc-line"><Icon name="pin" size={16} />{address}</p> : null}
      {phone ? <p className="dc-loc-line"><Icon name="phone" size={16} /><a href={'tel:' + phone.replace(/[^+\d]/g, '')}>{phone}</a></p> : null}
      {hours.length ? <ul className="dc-loc-hours">{hours.map((h) => { const [d, t] = h.split('|'); return <li key={h}><span>{d}</span><span>{t}</span></li>; })}</ul> : null}
      {cta && !comingSoon ? <Button href={href} variant="outline" size="sm" icon="arrow-up-right">{cta}</Button> : null}
    </article>
  );
}

export function Input({ label, hint, error, id, className, ...rest }) {
  const auto = useId();
  const fid = id || 'in' + auto.replace(/:/g, '');
  return (
    <div className={cx('dc-field', error && 'is-error', className)}>
      {label ? <label htmlFor={fid} className="dc-field-label">{label}</label> : null}
      <input id={fid} className="dc-input" aria-invalid={error ? true : undefined} aria-describedby={hint || error ? fid + '-h' : undefined} {...rest} />
      {hint || error ? <p id={fid + '-h'} className="dc-field-hint">{error || hint}</p> : null}
    </div>
  );
}

export function Newsletter({ title = 'Stay in the *loop*', lede = 'New specials, events and Happy Hour news, straight to your inbox. No spam, just flavor.', cta = 'Sign Up', className }) {
  return (
    <section className={cx('dc-news', className)}>
      
      <div className="dc-news-copy">
        <h2 className="dc-news-title">{renderAccent(title)}</h2>
        <p className="dc-news-lede">{lede}</p>
      </div>
      <form className="dc-news-form" onSubmit={(e) => e.preventDefault()}>
        <Input label="Email" type="email" placeholder="you@email.com" className="dc-news-input" />
        <Button type="submit" variant="marigold" icon="arrow-right">{cta}</Button>
      </form>
    </section>
  );
}

export function Footer({ brand, tagline = 'Fresh Mex & Cantina', locations = [], links = ['Menu', 'Specials', 'Happy Hour', 'Catering', 'Careers', 'Contact'], social = ['Instagram', 'Facebook'], legal = "© Don Chuy's Fresh Mex & Cantina", className }) {
  return (
    <footer className={cx('dc-foot', className)}>
      <TileBand height={40} edge="none" className="dc-foot-band" />
      <div className="dc-foot-grid">
        <div className="dc-foot-brand">
          {brand || <span className="dc-foot-wordmark">Don Chuy's</span>}
          <p className="dc-foot-tag">{tagline}</p>
          <div className="dc-foot-social">{social.map((s) => <a key={s} href="#">{s}<Icon name="arrow-up-right" size={14} /></a>)}</div>
        </div>
        <div className="dc-foot-col"><h4>Visit us</h4><ul>{locations.map((l) => <li key={l.city}><b>{l.city}</b><span>{l.address || 'Coming soon'}</span></li>)}</ul></div>
        <div className="dc-foot-col"><h4>Explore</h4><ul>{links.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul></div>
      </div>
      <p className="dc-foot-legal">{legal}</p>
    </footer>
  );
}

/* ---------- v3 creative elements ---------- */
const CRUMBS = [
  [6, 12, 'leaf', 20], [14, 78, 'dot', 0], [22, 30, 'chip', 35], [30, 88, 'leaf', -40], [42, 6, 'dot', 0], [55, 94, 'chip', 10],
  [66, 18, 'leaf', 70], [74, 70, 'dot', 0], [84, 40, 'chip', -25], [90, 90, 'leaf', 15], [8, 55, 'chip', 50], [48, 60, 'dot', 0],
  [60, 36, 'leaf', -60], [94, 12, 'dot', 0], [36, 48, 'chip', -10], [78, 8, 'leaf', 30],
];
const CRUMB_SHAPES = {
  leaf: 'M2 10C2 5 6 1 12 1c1 6-3 11-10 9z',
  chip: 'M1 3l8-2 4 7-6 5-6-4z',
};
export function Crumbs({ count = 12, tones = ['teal', 'chuy-red', 'marigold', 'navy'], scale = 1, className }) {
  return (
    <div className={cx('dc-crumbs', className)} aria-hidden="true">
      {CRUMBS.slice(0, count).map(([t, l, k, r], i) => (
        <svg key={i} viewBox="0 0 14 14" style={{ top: t + '%', left: l + '%', width: (k === 'dot' ? 9 : 16) * scale, transform: 'rotate(' + r + 'deg)', color: 'var(--' + tones[i % tones.length] + ')' }}>
          {k === 'dot' ? <circle cx="7" cy="7" r="6" fill="currentColor" /> : <path d={CRUMB_SHAPES[k]} fill="currentColor" />}
        </svg>
      ))}
    </div>
  );
}

export function Sticker({ kind = 'label', tone, rotate, children, className, style }) {
  const txt = typeof children === 'string' ? children.split('\n').map((l, i, a) => <React.Fragment key={i}>{l}{i < a.length - 1 ? <br /> : null}</React.Fragment>) : children;
  const st = Object.assign({ '--dc-rot': (rotate != null ? rotate : { label: -8, script: -10, burst: 8, seal: 0, tape: -4 }[kind]) + 'deg' }, style);
  if (kind === 'burst') {
    return (
      <span className={cx('dc-stk', 'dc-stk-burst', 'dc-stk-' + (tone || 'marigold'), className)} style={st}>
        <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2l8 14 15-7 2 16 16 1-6 15 13 10-13 9 6 15-16 1-2 16-15-7-8 14-8-14-15 7-2-16-16-1 6-15L3 55l13-9-6-15 16-1 2-16 15 7z" /></svg>
        <b>{txt}</b>
      </span>
    );
  }
  if (kind === 'seal') {
    return <span className={cx('dc-stk', 'dc-stk-seal', className)} style={st}><Stamp size={style && style.width || 108} spin={false} tone={tone || 'marigold'} icon="agave" text={typeof children === 'string' ? children : 'FROM OUR CASA · TO YOURS · '} /></span>;
  }
  return <span className={cx('dc-stk', 'dc-stk-' + kind, tone && 'dc-stk-' + tone, className)} style={st}>{txt}</span>;
}

export function WordStack({ word = 'FAJITAS', lines = 3, image, tone = 'teal', outline = true, script, stickers = [], crumbs = true, height, className }) {
  const w = String(word).replace(/\*/g, '').toUpperCase();
  const rows = Array.from({ length: lines }, (_, i) => i);
  const pos = { tl: { top: '7%', left: '5%' }, tr: { top: '8%', right: '5%' }, bl: { bottom: '8%', left: '5%' }, br: { bottom: '8%', right: '5%' } };
  return (
    <div className={cx('dc-ws', 'dc-ws-' + tone, className)} style={Object.assign({ '--dc-chars': Math.max(w.length, 4) }, height ? { height } : null)}>
      <div className="dc-ws-words" aria-hidden={image ? undefined : true}>
        {rows.map((i) => <span key={i} className={cx('dc-ws-row', outline && i % 2 === 1 && 'dc-ws-row-outline')}>{w}</span>)}
      </div>
      {crumbs ? <Crumbs count={12} /> : null}
      {image ? <PhotoFrame src={image.src} alt={image.alt} shape="circle" className="dc-ws-plate" /> : null}
      {script ? <span className="dc-ws-script">{script}</span> : null}
      {stickers.map((k, i) => <Sticker key={i} kind={k.kind} tone={k.tone} className="dc-ws-sticker" style={pos[k.pos || 'br']}>{k.text}</Sticker>)}
    </div>
  );
}

const PAPER_BITS = [
  ['script', 'sassy salsa'], ['bold', "LET'S TACO\n'BOUT IT"], ['icon', 'chile'], ['caps', "DON CHUY'S"], ['script', 'hola, amigo'],
  ['icon', 'lime'], ['bold', 'FRESH\nMEX'], ['caps', 'CANTINA'], ['script', 'from our casa'], ['icon', 'taco'], ['bold', 'SPICY\nSOUL'],
  ['caps', 'LEÓN · MX'], ['icon', 'agave'], ['script', 'muy rico'], ['bold', 'ALL DAY\nSPECIALS'], ['icon', 'margarita'],
];
const PAPER_INKS = ['chuy-rose', 'navy', 'marigold-700', 'teal-700'];
export function BrandPaper({ tone = 'paper', density = 16, children, className, style }) {
  return (
    <div className={cx('dc-paper', 'dc-paper-' + tone, className)} style={style}>
      <div className="dc-paper-print" aria-hidden="true">
        {Array.from({ length: density }, (_, i) => {
          const [k, t] = PAPER_BITS[i % PAPER_BITS.length];
          const r = [-12, 8, -4, 14, -8, 4, -16, 10][i % 8];
          const ink = 'var(--' + PAPER_INKS[i % PAPER_INKS.length] + ')';
          return <span key={i} className={'dc-paper-bit dc-paper-' + k} style={{ color: ink, transform: 'rotate(' + r + 'deg)' }}>
            {k === 'icon' ? <Icon name={t} size={34} /> : t.split('\n').map((l, j) => <span key={j}>{l}</span>)}
          </span>;
        })}
      </div>
      {children ? <div className="dc-paper-content">{children}</div> : null}
    </div>
  );
}

export function PosterCard({ word, image, tone = 'teal', script, sticker, title, meta, href = '#', className }) {
  return (
    <a href={href} className={cx('dc-poster', className)}>
      <WordStack word={word} image={image} tone={tone} script={script} lines={3} stickers={sticker ? [{ kind: 'label', text: sticker, pos: 'br' }] : []} className="dc-poster-art" />
      <span className="dc-poster-foot"><span><b className="dc-poster-title">{title}</b>{meta ? <span className="dc-poster-meta">{meta}</span> : null}</span><span className="dc-poster-go"><Icon name="arrow-up-right" size={20} /></span></span>
    </a>
  );
}

export function CategoryGrid({ items = [], className }) {
  return (
    <div className={cx('dc-cats', className)}>
      {items.map((it, i) => (
        <a key={it.name} href={it.href || '#'} className={cx('dc-cat', 'dc-cat-' + (it.tone || ['rose', 'teal', 'marigold', 'navy'][i % 4]))}>
          <span className="dc-cat-name">{it.name}</span>
          {it.note ? <span className="dc-cat-note">{it.note}</span> : null}
          {it.image ? <PhotoFrame src={it.image.src} alt={it.image.alt} shape="circle" className="dc-cat-plate" /> : <span className="dc-cat-icon"><Icon name={it.icon || 'utensils'} size={72} strokeWidth={1.6} /></span>}
          <span className="dc-cat-go"><Icon name="arrow-right" size={22} /></span>
        </a>
      ))}
    </div>
  );
}

export function ValueProps({ items = [], className }) {
  return (
    <div className={cx('dc-vp', className)}>
      {items.map((it, i) => (
        <div key={i} className="dc-vp-item">
          <span className={'dc-vp-icon dc-vp-icon-' + (i % 4)}><Icon name={it.icon} size={34} /></span>
          <h3 className="dc-vp-title">{it.title}</h3>
          {it.script ? <span className="dc-vp-script">{it.script}</span> : null}
          <p className="dc-vp-text">{it.text}</p>
        </div>
      ))}
    </div>
  );
}

export function SocialGrid({ handle = '@donchuysmo', href = 'https://www.instagram.com/donchuysmo/', script = 'follow the flavor', images = [], className }) {
  return (
    <section className={cx('dc-social', className)}>
      <header className="dc-social-head">
        <span className="dc-social-script">{script}</span>
        <h2 className="dc-social-handle">{handle}</h2>
        <Button href={href} variant="outline" icon="arrow-up-right">Follow on Instagram</Button>
      </header>
      <div className="dc-social-grid">
        {images.slice(0, 6).map((im, i) => (
          <a key={i} href={href} className={cx('dc-social-tile', 'dc-social-tile-' + i)}>
            <img src={im.src} alt={im.alt} loading="lazy" />
            <span className="dc-social-hover"><Icon name="arrow-up-right" size={28} /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---------- v4 editorial elements (site palette) ---------- */
export function Flower({ size = 88, spin, className, style }) {
  const petals = Array.from({ length: 8 }, (_, i) => i);
  return (
    <svg className={cx('dc-flower', spin && 'dc-flower-spin', className)} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={style}>
      {petals.map((i) => <ellipse key={i} cx="50" cy="24" rx="11" ry="22" transform={'rotate(' + i * 45 + ' 50 50)'} className={i % 2 ? 'dc-flower-b' : 'dc-flower-a'} />)}
      <circle cx="50" cy="50" r="12" className="dc-flower-c" />
      <circle cx="50" cy="50" r="5" className="dc-flower-d" />
    </svg>
  );
}

export function Sunburst({ tone = 'marigold', rays = 24, children, className, style }) {
  return (
    <div className={cx('dc-sun', 'dc-sun-' + tone, className)} style={Object.assign({ '--dc-rays': 360 / rays + 'deg' }, style)}>
      <span className="dc-sun-rays" aria-hidden="true" />
      <div className="dc-sun-content">{children}</div>
    </div>
  );
}

export function ColorSplit({ tone = 'marigold', eyebrow, title, body, cta, ctaHref = '#', image, caption, stamp = "DESDE LEÓN · TO YOUR TABLE · ", reverse, className }) {
  return (
    <section className={cx('dc-split', 'dc-split-' + tone, reverse && 'dc-split-reverse', className)}>
      <div className="dc-split-copy">
        {eyebrow ? <span className="dc-split-eyebrow">{eyebrow}</span> : null}
        <h2 className="dc-split-title">{renderAccent(title)}</h2>
        {(Array.isArray(body) ? body : [body]).filter(Boolean).map((p, i) => <p key={i} className="dc-split-body">{p}</p>)}
        {cta ? <Button href={ctaHref} variant={tone === 'marigold' ? 'navy' : 'marigold'} size="sm">{cta}</Button> : null}
      </div>
      <div className="dc-split-art">
        <div className="dc-split-tiles" aria-hidden="true" />
        {image ? <PhotoFrame src={image.src} alt={image.alt} shape="polaroid" className="dc-split-photo" /> : null}
        {caption ? <Sticker kind="label" tone="rose" className="dc-split-caption">{caption}</Sticker> : null}
        {stamp ? <Stamp tone="postmark" size={112} text={stamp} className="dc-split-stamp" icon="chile" /> : null}
        <Flower size={70} className="dc-split-flower" />
      </div>
    </section>
  );
}
