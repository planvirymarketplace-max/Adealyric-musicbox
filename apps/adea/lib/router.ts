"use client";

import { useRouter as useNextRouter, usePathname } from 'next/navigation';

export function useRouter() {
  const router = useNextRouter();
  const pathname = usePathname();

  return {
    path: pathname,
    navigate: (to: string) => router.push(to),
  };
}
