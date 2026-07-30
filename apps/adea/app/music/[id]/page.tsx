import { ReleaseDetailPage as ReleaseDetailComponent } from "@/components/adea/MusicDiscography";

interface Props {
  params: Promise<{ id: string }> | { id: string };
}

export default async function MusicDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <div className="bg-white text-black">
      <ReleaseDetailComponent slug={id} />
    </div>
  );
}
