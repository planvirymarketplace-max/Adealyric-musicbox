import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MusicBox Fan Portal',
  description: 'Music, events, and merchandise for fans',
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
