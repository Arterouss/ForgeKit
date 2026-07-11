'use client';

import { Github, Twitter, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Tools', href: '/dashboard' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', href: 'https://github.com/Arterouss/ForgeKit', external: true },
      { label: 'Discord', href: '#' },
      { label: 'Issues', href: 'https://github.com/Arterouss/ForgeKit/issues', external: true },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Roadmap', href: '#' },
      { label: 'Contributing', href: 'https://github.com/Arterouss/ForgeKit/blob/main/CONTRIBUTING.md', external: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'License', href: 'https://github.com/Arterouss/ForgeKit/blob/main/LICENSE', external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">⚒️</span>
              <span className="font-heading text-lg font-bold">
                <span className="text-primary">Dev</span>Forge
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-xs text-muted-foreground">
              The ultimate all-in-one toolbox for software developers.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com/Arterouss/ForgeKit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Discord">
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DevForge. MIT License.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ by{' '}
            <a
              href="https://github.com/Arterouss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary transition-colors hover:text-primary/80"
            >
              Arterouss
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
