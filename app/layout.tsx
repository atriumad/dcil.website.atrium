import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Bebas_Neue, Figtree, Yellowtail } from "next/font/google";
import "./globals.css";
import { InViewObserver } from "@/components/dc/in-view-observer";
import { siteContent } from "@/data/site";

// Display: Eudora (brand face, lowercase set draws "i" as "!"; fallback Bebas Neue for punctuation/$/&/accents).
// Script: Yellowtail (one word only). Sans: Figtree (body, UI).
// Stacks are wired to these variables in globals.css (@theme static).
const eudora = localFont({
  src: "./fonts/eudora-regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-eudora",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

const yellowtail = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yellowtail",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-figtree",
});

// Pages set their own full titles ("About Us | Don Chuy's ..."), so no title template here.
export const metadata: Metadata = {
  title: siteContent.seoDefaults.homeTitle,
  description: siteContent.seoDefaults.homeDescription,
};

export const viewport: Viewport = {
  themeColor: "#194765",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${eudora.variable} ${bebasNeue.variable} ${yellowtail.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col">
        {children}
        <InViewObserver />
      </body>
    </html>
  );
}
