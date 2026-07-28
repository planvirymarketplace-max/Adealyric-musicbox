import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MusicBox Admin Portal',
  description: 'Platform administration and oversight',
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
