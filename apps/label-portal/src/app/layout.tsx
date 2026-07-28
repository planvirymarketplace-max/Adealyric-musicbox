import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MusicBox Label Portal',
  description: 'Catalog, distribution, and sync licensing for labels',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
