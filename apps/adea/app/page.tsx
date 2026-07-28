import { Landing } from '@/components/adea/Landing';
import { SiteHeader, SiteFooter } from '@/components/adea/SiteChrome';
import { EntryGate } from '@/components/adea/EntryGate';
import { useAppStore } from '@/lib/store';

export default function Home() {
  const { entered, setEntered } = useAppStore();

  return (
    <div className="relative w-full bg-ink text-bone">
      {!entered && <EntryGate onEnter={() => setEntered(true)} />}
      {entered && (
        <>
          <SiteHeader />
          <main><Landing /></main>
          <SiteFooter />
        </>
      )}
    </div>
  );
}
