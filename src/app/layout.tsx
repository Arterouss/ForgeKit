import type { Metadata, Viewport } from 'next';
import { Geist, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DevForge — The Ultimate Developer Toolbox',
    template: '%s | DevForge',
  },
  description:
    'Everything developers need, in one beautiful workspace. Format, encode, generate, and build with 100+ utilities.',
  keywords: [
    'developer tools',
    'json formatter',
    'base64',
    'uuid generator',
    'regex tester',
    'developer utilities',
    'devforge',
  ],
  authors: [{ name: 'Arterouss' }],
  creator: 'Arterouss',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://devforge.dev'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'DevForge',
    title: 'DevForge — The Ultimate Developer Toolbox',
    description:
      'Everything developers need, in one beautiful workspace. Format, encode, generate, and build with 100+ utilities.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevForge — The Ultimate Developer Toolbox',
    description:
      'Everything developers need, in one beautiful workspace.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#00e5ff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
