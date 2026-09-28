import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, CSSProperties } from 'react';

export type IconName = 'chile' | 'lime' | 'avocado' | 'taco' | 'corn' | 'agave' | 'margarita' | 'beer' | 'flame' | 'utensils' | 'sparkle'
  | 'pin' | 'clock' | 'phone' | 'calendar' | 'bag' | 'mail' | 'arrow-right' | 'arrow-up-right' | 'menu' | 'close' | 'plus';
/** A colour token name from tokens.json, e.g. 'sage-200'. */
export type ColorToken = string;
export interface Img { src: string; alt: string }

/** Original line icon; inherits currentColor. */
export declare function Icon(props: { name: IconName; size?: number; title?: string; strokeWidth?: number; className?: string }): JSX.Element;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'rose' | 'navy' | 'teal' | 'agave' | 'marigold' | 'ink' | 'cream';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  /** Trailing icon. */
  icon?: IconName;
  iconLeft?: IconName;
  children: ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;

export declare function Pill(props: { tone?: 'outline' | 'agave' | 'white' | 'marigold' | 'rose' | 'ink'; size?: 'md' | 'sm'; icon?: IconName; className?: string; children: ReactNode }): JSX.Element;

/** Title: wrap one word in *stars* for the Yellowtail script accent. */
export declare function SectionHeader(props: { eyebrow?: string; title: string; lede?: string; align?: 'left' | 'center'; size?: 'l' | 'm'; tone?: 'default' | 'inverse'; className?: string }): JSX.Element;

export declare function TileBand(props: { tone?: 'fiesta' | 'agave' | 'rose' | 'marigold' | 'sage'; height?: number; edge?: 'both' | 'top' | 'none'; className?: string }): JSX.Element;
export declare function Pattern(props: { name?: 'talavera-tile' | 'doodles' | 'diamond' | 'scallop'; tone?: ColorToken; size?: number; className?: string; style?: CSSProperties }): JSX.Element;
export declare function Stamp(props: { text?: string; icon?: IconName; size?: number; tone?: 'postmark' | 'marigold' | 'rose' | 'teal' | 'agave'; spin?: boolean; className?: string }): JSX.Element;
export declare function Marquee(props: { items?: string[]; tone?: 'rose' | 'marigold' | 'agave'; icon?: IconName; speed?: number; outline?: boolean; reverse?: boolean; className?: string }): JSX.Element;

export declare function PhotoFrame(props: { src?: string; alt?: string; shape?: 'arch' | 'circle' | 'rounded' | 'ticket' | 'polaroid'; ratio?: string; sticker?: string; stickerTone?: 'white' | 'marigold' | 'rose'; ground?: ColorToken; className?: string; style?: CSSProperties }): JSX.Element;

export declare function NavBar(props: { links?: string[]; active?: string; brand?: ReactNode; cta?: string | null; ctaHref?: string; variant?: 'cream' | 'rose'; className?: string }): JSX.Element;
export declare function CategoryTabs(props: { items?: string[]; value?: string; onChange?: (v: string) => void; className?: string }): JSX.Element;

export declare function Hero(props: { variant?: 'photo' | 'stack' | 'split' | 'poster'; eyebrow?: string; title: string; lede?: string; primary?: string | null; secondary?: string | null; image?: Img; plates?: Img[]; stamp?: boolean; className?: string }): JSX.Element;
export declare function DishCard(props: { name: string; description?: string; price?: string; image?: Img; tags?: string[]; variant?: 'plate' | 'photo'; href?: string; className?: string }): JSX.Element;

export interface MenuItemProps { name: string; price: string; description?: string; tags?: ('Spicy' | 'Veggie' | string)[]; featured?: boolean; className?: string }
export declare function MenuItem(props: MenuItemProps): JSX.Element;
export declare function MenuSection(props: { title: string; note?: string; items: MenuItemProps[]; className?: string }): JSX.Element;

export interface SpecialRowProps { day: string; item: string; price?: string; note?: string; onDark?: boolean; className?: string }
export declare function SpecialRow(props: SpecialRowProps): JSX.Element;
export declare function SpecialsBoard(props: { title?: string; subtitle?: string; specials: SpecialRowProps[]; drinks?: { name: string; price: string; icon?: IconName }[]; className?: string }): JSX.Element;

export declare function FeatureSplit(props: { eyebrow?: string; title: string; body?: string | string[]; cta?: string; ctaHref?: string; image?: Img; reverse?: boolean; ground?: ColorToken; className?: string }): JSX.Element;
export declare function PromoBanner(props: { kicker?: string; title?: string; lede?: string; deals?: { name: string; price: string; icon?: IconName }[]; cta?: string; ctaHref?: string; tone?: 'marigold' | 'rose'; className?: string }): JSX.Element;

/** hours: "Days|Times" strings, e.g. "Mon–Thu|11am–10pm". */
export declare function LocationCard(props: { city: string; address?: string; phone?: string; hours?: string[]; comingSoon?: boolean; href?: string; cta?: string | null; className?: string }): JSX.Element;

export declare function Input(props: InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string }): JSX.Element;
export declare function Newsletter(props: { title?: string; lede?: string; cta?: string; className?: string }): JSX.Element;
export declare function Footer(props: { brand?: ReactNode; tagline?: string; locations?: { city: string; address?: string }[]; links?: string[]; social?: string[]; legal?: string; className?: string }): JSX.Element;

/* ---------- v3 creative elements ---------- */
export type StickerKind = 'label' | 'script' | 'burst' | 'seal' | 'tape';
export interface StickerSpec { kind: StickerKind; text: string; tone?: 'rose' | 'agave' | 'marigold'; pos?: 'tl' | 'tr' | 'bl' | 'br' }
export declare function Crumbs(props: { count?: number; tones?: ColorToken[]; scale?: number; className?: string }): JSX.Element;
/** children: text with \n line breaks for label/burst. */
export declare function Sticker(props: { kind?: StickerKind; tone?: 'rose' | 'agave' | 'marigold'; rotate?: number; children?: ReactNode; className?: string; style?: CSSProperties }): JSX.Element;
export declare function WordStack(props: { word?: string; lines?: number; image?: Img; tone?: 'teal' | 'navy' | 'rose' | 'marigold' | 'sage' | 'cream'; outline?: boolean; script?: string; stickers?: StickerSpec[]; crumbs?: boolean; height?: number | string; className?: string }): JSX.Element;
export declare function BrandPaper(props: { tone?: 'paper' | 'cream' | 'white'; density?: number; children?: ReactNode; className?: string; style?: CSSProperties }): JSX.Element;
export declare function PosterCard(props: { word: string; image?: Img; tone?: 'agave' | 'rose' | 'marigold' | 'sage'; script?: string; sticker?: string; title: string; meta?: string; href?: string; className?: string }): JSX.Element;
export declare function CategoryGrid(props: { items: { name: string; note?: string; image?: Img; icon?: IconName; tone?: 'rose' | 'agave' | 'marigold' | 'sage'; href?: string }[]; className?: string }): JSX.Element;
export declare function ValueProps(props: { items: { icon: IconName; title: string; script?: string; text: string }[]; className?: string }): JSX.Element;
export declare function SocialGrid(props: { handle?: string; href?: string; script?: string; images: Img[]; className?: string }): JSX.Element;

/* ---------- v4 editorial elements ---------- */
export declare function Flower(props: { size?: number; spin?: boolean; className?: string; style?: CSSProperties }): JSX.Element;
export declare function Sunburst(props: { tone?: 'marigold' | 'rose' | 'teal'; rays?: number; children?: ReactNode; className?: string; style?: CSSProperties }): JSX.Element;
export declare function ColorSplit(props: { tone?: 'marigold' | 'rose' | 'teal' | 'navy'; eyebrow?: string; title: string; body?: string | string[]; cta?: string; ctaHref?: string; image?: Img; caption?: string; stamp?: string | null; reverse?: boolean; className?: string }): JSX.Element;
