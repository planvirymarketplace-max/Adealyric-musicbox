'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Upload } from 'lucide-react';

export default function CsvImportPage() {
  return (
    <div>
      <PageHeader title="CSV Import" description="Import contacts from a CSV file" />
      <Card className="p-6">
        <div className="text-center py-12">
          <Upload size={48} className="text-neutral-300 mx-auto mb-4" />
          <p className="text-sm text-neutral-500">Drag and drop a CSV file here, or click to browse</p>
          <Button variant="primary" className="mt-4">Choose File</Button>
        </div>
      </Card>
    </div>
  );
}
