import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MusicBox Sync Portal',
  description: 'Sync licensing marketplace for music supervisors',
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
