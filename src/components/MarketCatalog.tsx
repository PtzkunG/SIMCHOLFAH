import { ArrowRight, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ItemCategory, MarketItem } from '../types/market';
import { MarketImage } from './MarketImage';

interface MarketCatalogProps {
  allItems: MarketItem[];
  cartQuantities: Record<string, number>;
  onAddItem: (item: MarketItem) => void;
}

const CATEGORY_TABS: { value: 'all' | ItemCategory; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'seafood', label: 'ของสดริมน้ำ' },
  { value: 'streetfood', label: 'สตรีทฟู้ด & กับข้าว' },
  { value: 'produce', label: 'ผัก & ผลไม้' },
  { value: 'dessert', label: 'ขนม & น้ำชง' },
];

export function MarketCatalog({
  allItems,
  cartQuantities,
  onAddItem,
}: MarketCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ItemCategory>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc'>('popular');

  const visibleItems = useMemo(() => {
    const filtered =
      selectedCategory === 'all'
        ? allItems
        : allItems.filter((item) => item.category === selectedCategory);

    return [...filtered].sort((a, b) => {
      if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
      if (sortBy === 'price_asc') return a.price - b.price;
      return b.popularityScore - a.popularityScore;
    });
  }, [allItems, selectedCategory, sortBy]);

  return (
    <section
      id="catalog"
      className="py-12 lg:py-16 border-b border-[#E2E7DF] dark:border-[#212B24] bg-[#F6F8F5] dark:bg-[#0C110E] transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-8">
          <div>
            <p className="text-xs font-medium text-[#14532D] dark:text-[#6EE7B7] mb-1.5">
              แผงค้าตลาดริมชล
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141A15] dark:text-[#F1F5F2]">
              เลือกรายการจากร้านประจำในตลาด
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Category Filter Segmented Bar */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#E9EDE6] dark:bg-[#17201A] rounded-xl">
              {CATEGORY_TABS.map((tab) => {
                const active = selectedCategory === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setSelectedCategory(tab.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-white dark:bg-[#233128] text-[#141A15] dark:text-white shadow-xs font-semibold'
                        : 'text-[#4A554C] dark:text-[#98A89B] hover:text-[#141A15] dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Sort Select */}
            <label className="sr-only" htmlFor="catalog-sort">
              เรียงลำดับรายการ
            </label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'price_asc')}
              className="h-9 px-3 bg-white dark:bg-[#151D17] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-xs font-medium text-[#141A15] dark:text-[#F1F5F2] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399] cursor-pointer"
            >
              <option value="popular">เรียงตามยอดฝากสูงสุด</option>
              <option value="price_asc">เรียงตามราคา (ต่ำ–สูง)</option>
            </select>
          </div>
        </div>

        {/* 3-Column Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {visibleItems.map((item) => {
            const qtyInCart = cartQuantities[item.id] || 0;
            const substitute = item.substituteId
              ? allItems.find((i) => i.id === item.substituteId)
              : undefined;

            return (
              <article
                key={item.id}
                className="group flex flex-col bg-white dark:bg-[#131A15] border border-[#E2E7DF] dark:border-[#232E26] rounded-2xl overflow-hidden hover:-translate-y-0.5 hover:shadow-md dark:hover:border-[#334438] transition-all duration-150"
              >
                {/* 4:3 Image Slot */}
                <div className="aspect-[4/3] w-full bg-[#EEF2EC] dark:bg-[#1A231D] overflow-hidden relative border-b border-[#EEF1EC] dark:border-[#1E2821]">
                  <MarketImage
                    src={item.image}
                    alt={item.name}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
                      !item.inStock ? 'opacity-55 grayscale-[40%]' : ''
                    }`}
                  />
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B] truncate">
                      {item.stall} · {item.zone}
                    </div>
                    <h3 className="mt-1 text-base font-semibold text-[#141A15] dark:text-[#F1F5F2] leading-snug">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-xs text-[#4A554C] dark:text-[#A4B2A7] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Price + Action Row */}
                  <div className="mt-5 pt-4 border-t border-[#EEF1EC] dark:border-[#212B24]">
                    {item.inStock ? (
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-base font-bold text-[#141A15] dark:text-[#F1F5F2] tabular-nums font-mono">
                            ฿{item.price}
                          </div>
                          <div className="text-[11px] text-[#5D6B5F] dark:text-[#98A89B]">
                            {item.unit} · เตรียม ~{item.prepMinutes} นาที
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onAddItem(item)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            qtyInCart > 0
                              ? 'bg-[#EAF2EC] dark:bg-[#1E3527] text-[#14532D] dark:text-[#6EE7B7] border border-[#BFD7C4] dark:border-[#2E523B] hover:bg-[#DCEADF] dark:hover:bg-[#264432]'
                              : 'bg-[#14532D] dark:bg-[#1E7E48] text-white hover:bg-[#166534] dark:hover:bg-[#196B3D]'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>
                            {qtyInCart > 0 ? `ในตะกร้า (${qtyInCart})` : 'ฝากซื้อ'}
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="text-xs font-medium text-[#7C4A03] dark:text-[#FBBF24]">
                          หมดรอบเช้าวันนี้ — {item.substituteReason}
                        </div>
                        {substitute && (
                          <button
                            type="button"
                            onClick={() => onAddItem(substitute)}
                            className="w-full inline-flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7] bg-[#EAF2EC] dark:bg-[#1E3527] hover:bg-[#DCEADF] dark:hover:bg-[#264432] rounded-lg transition-colors cursor-pointer"
                          >
                            <span className="truncate">
                              เลือกตัวแทน: {substitute.name} (฿{substitute.price})
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
