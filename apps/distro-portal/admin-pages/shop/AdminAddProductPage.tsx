'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react';
import { FAMILY_LABELS, CATEGORY_MAP } from '@/lib/product-catalog';
import type { ProductFamily } from '@/lib/commerce-store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Field, Input, Textarea } from '@/components/ui/Form';
import { Link } from '@/lib/router';
import { toast } from '@/components/ui/Toast';

const FAMILY_KEYS: ProductFamily[] = ['BlankApparel', 'PrintOnDemand', 'Beauty', 'Bags'];
const ALL_BADGES = ['NEW', 'BESTSELLER', 'TRENDING', 'LIMITED'];
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '30ml', '50ml', '100ml', '8oz', '16oz', 'Standard', 'Set', 'Kit'];

export default function AdminAddProductPage() {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [productFamily, setProductFamily] = useState<ProductFamily>('BlankApparel');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [fabric, setFabric] = useState('');
  const [material, setMaterial] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [concernTags, setConcernTags] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [inventoryCount, setInventoryCount] = useState('0');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [sizeGuideData, setSizeGuideData] = useState<Record<string, Record<string, string>>>({});

  const categoriesForFamily = CATEGORY_MAP[productFamily]?.categories ?? [];

  const handleSave = () => {
    if (!name) { toast('error', 'Product name is required'); return; }
    if (!sku) { toast('error', 'SKU is required'); return; }
    if (!retailPrice) { toast('error', 'Retail price is required'); return; }
    toast('success', `Product "${name}" created! (Mock — not persisted to DB)`);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
  };

  const toggleBadge = (badge: string) => {
    setSelectedBadges((prev) => prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]);
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (idx: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <Link to="/admin/shop/catalog" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 mb-4">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <PageHeader
        title="Add New Product"
        description="Create a new product in the catalog"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsPublished(!isPublished)}>
              <Eye size={14} /> {isPublished ? 'Unpublish' : 'Publish'}
            </Button>
            <Button variant="primary" className="flex items-center gap-2 bg-neutral-900 text-white hover:bg-neutral-700" onClick={handleSave}>
              <Save size={14} /> Create Product
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Product Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Product Name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Unisex Heavy Cotton Tee" /></Field>
              <Field label="SKU"><Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. WT0216" /></Field>
              <div className="sm:col-span-2">
                <Field label="Description"><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description…" rows={3} /></Field>
              </div>
              <Field label="Product Family">
                <select value={productFamily} onChange={(e) => { setProductFamily(e.target.value as ProductFamily); setCategory(''); }} className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg">
                  {FAMILY_KEYS.map((f) => <option key={f} value={f}>{FAMILY_LABELS[f]}</option>)}
                </select>
              </Field>
              <Field label="Category">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg">
                  <option value="">Select category</option>
                  {categoriesForFamily.map((cat) => <option key={cat.name} value={cat.name}>{cat.name.replace('POD_', '').replace('_', ' ')}</option>)}
                </select>
              </Field>
              <Field label="Subcategory"><Input value={subcategory} onChange={(e) => setSubcategory(e.target.value)} placeholder="e.g. Crop, Sports Bra" /></Field>
              <Field label="Fabric"><Input value={fabric} onChange={(e) => setFabric(e.target.value)} placeholder="e.g. 130gsm/3.8oz" /></Field>
              <Field label="Material"><Input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="e.g. PU Leather" /></Field>
              <Field label="Dimensions"><Input value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="e.g. 28×20×8 cm" /></Field>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Pricing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Wholesale Price (USD)"><Input type="number" value={wholesalePrice} onChange={(e) => setWholesalePrice(e.target.value)} placeholder="4.50" /></Field>
              <Field label="Retail Price (USD)"><Input type="number" value={retailPrice} onChange={(e) => setRetailPrice(e.target.value)} placeholder="24.99" /></Field>
              <Field label="Inventory Count"><Input type="number" value={inventoryCount} onChange={(e) => setInventoryCount(e.target.value)} placeholder="100" /></Field>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Images</h3>
            <div className="space-y-3">
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden bg-neutral-100 aspect-square group">
                      <img src={url} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(idx)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="Paste image URL…" className="flex-1" />
                <Button variant="outline" className="flex items-center gap-2" onClick={addImage}><Upload size={14} /> Add</Button>
              </div>
              <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center hover:border-neutral-300 cursor-pointer">
                <Upload size={24} className="text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">Drag & drop images here</p>
              </div>
            </div>
          </Card>

          {/* Size guide */}
          {productFamily !== 'Beauty' && productFamily !== 'Bags' && selectedSizes.length > 0 && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Size Guide</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-neutral-900">Size</th>
                      <th className="px-3 py-2 text-left font-semibold text-neutral-900">Chest (in)</th>
                      <th className="px-3 py-2 text-left font-semibold text-neutral-900">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {selectedSizes.map((size) => (
                      <tr key={size}>
                        <td className="px-3 py-2 font-medium text-neutral-900">{size}</td>
                        <td className="px-3 py-2">
                          <Input
                            value={sizeGuideData[size]?.chest ?? ''}
                            onChange={(e) => setSizeGuideData((prev) => ({ ...prev, [size]: { ...prev[size] ?? {}, chest: e.target.value } }))}
                            placeholder="40" className="text-xs"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={sizeGuideData[size]?.length ?? ''}
                            onChange={(e) => setSizeGuideData((prev) => ({ ...prev, [size]: { ...prev[size] ?? {}, length: e.target.value } }))}
                            placeholder="28" className="text-xs"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Available Sizes</h3>
            <div className="flex flex-wrap gap-1.5">
              {ALL_SIZES.map((size) => (
                <button key={size} onClick={() => toggleSize(size)} className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${selectedSizes.includes(size) ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                  {size}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Badges</h3>
            <div className="flex flex-wrap gap-1.5">
              {ALL_BADGES.map((badge) => (
                <button key={badge} onClick={() => toggleBadge(badge)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedBadges.includes(badge) ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                  {badge}
                </button>
              ))}
            </div>
          </Card>

          {productFamily === 'Beauty' && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Concern Tags</h3>
              <Textarea value={concernTags} onChange={(e) => setConcernTags(e.target.value)} placeholder="Anti-age, Niacinamide (B3), Fine lines" rows={3} />
            </Card>
          )}

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Publish Status</h3>
            <Badge color={isPublished ? 'green' : 'gray'} className="mb-2">{isPublished ? 'Published' : 'Draft'}</Badge>
            <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-2" onClick={() => setIsPublished(!isPublished)}>
              <Eye size={14} /> {isPublished ? 'Unpublish' : 'Publish'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
