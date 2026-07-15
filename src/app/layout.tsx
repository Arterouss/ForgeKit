import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/providers/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'DevForge — A focused workspace for developers',
    template: '%s | DevForge',
  },
  description:
    'A private developer workspace for formatting, inspecting, generating, and shipping.',
  keywords: [
    'developer tools',
    'json formatter',
    'developer workspace',
    'wasm tools',
    'developer workspace',
    'devforge os',
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
    title: 'DevForge — A focused workspace for developers',
    description:
      'A private developer workspace for your everyday tools.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevForge — A focused workspace for developers',
    description:
      'A private developer workspace for your everyday tools.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
        <div className="relative flex min-h-screen flex-col">
          <ThemeProvider>{children}</ThemeProvider>
        </div>
      </body>
    </html>
  );
}
