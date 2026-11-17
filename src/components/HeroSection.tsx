import { ArrowRight, Plus, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MARKET_IMAGES } from '../data/rimcholMarket';
import { MarketItem } from '../types/market';
import { getSearchSuggestions } from '../utils/suggestionEngine';
import { MarketImage } from './MarketImage';

interface HeroSectionProps {
  allItems: MarketItem[];
  onAddItem: (item: MarketItem) => void;
  onPrefillCustomErrand: (itemName: string) => void;
}

export function HeroSection({
  allItems,
  onAddItem,
  onPrefillCustomErrand,
}: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(
    () => getSearchSuggestions(searchQuery, allItems),
    [searchQuery, allItems]
  );

  const hasQuery = searchQuery.trim().length > 0;

  return (
    <section
      id="top"
      className="border-b border-[#E2E7DF] dark:border-[#212B24] bg-[#F6F8F5] dark:bg-[#0C110E] transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-[#4A554C] dark:text-[#98A89B] mb-3">
                ตลาดริมชล ป่าพยอม · ม.ทักษิณ พัทลุง · ส่งรอบหอพักและชุมชนภายใน 45 นาที
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#141A15] dark:text-[#F4F7F4] leading-[1.18] max-w-xl">
                ฝากซื้อของตลาดริมชล พร้อมระบบแนะนำเมนูที่เข้าคู่กัน
              </h1>

              <p className="mt-4 text-base text-[#4A554C] dark:text-[#A4B2A7] leading-relaxed max-w-xl">
                คัดของสดริมน้ำ หมูปิ้งเจ้าดัง ผักสวนครัว และขนมไทยยายจันทร์
                ระบบช่วยจัดเซตตามงบ จับคู่เครื่องเคียงให้อัตโนมัติ และรวมโซนร้านเพื่อลดค่าหิ้ว
              </p>

              {/* Smart Type-Ahead Search Box */}
              <div className="mt-7 relative max-w-xl">
                <label htmlFor="market-quick-search" className="sr-only">
                  ค้นหาของฝากซื้อจากตลาดริมชล
                </label>
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-[#5D6B5F] dark:text-[#98A89B] absolute left-4 pointer-events-none" />
                  <input
                    id="market-quick-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="พิมพ์หาของที่อยากฝากซื้อ เช่น กุ้งแม่น้ำ, หมูปิ้ง, ต้มยำ, ทุเรียน..."
                    className="w-full h-12 pl-11 pr-10 bg-white dark:bg-[#141C17] border border-[#D4DAD0] dark:border-[#27342B] rounded-xl text-sm text-[#141A15] dark:text-[#F1F5F2] placeholder:text-[#7A877C] dark:placeholder:text-[#6E7F72] shadow-xs focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399] focus:ring-2 focus:ring-[#14532D]/15 dark:focus:ring-[#34D399]/20 transition-colors"
                  />
                  {hasQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="ล้างคำค้นหา"
                      className="absolute right-2.5 p-1.5 text-[#5D6B5F] dark:text-[#98A89B] hover:text-[#141A15] dark:hover:text-white rounded-md cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Live Search + Substitute Suggestion Dropdown */}
                {hasQuery && (
                  <div className="mt-2 bg-white dark:bg-[#151E18] border border-[#D4DAD0] dark:border-[#27342B] rounded-xl shadow-xl overflow-hidden z-20 relative">
                    {searchResults.matches.length > 0 && (
                      <div className="divide-y divide-[#EEF1EC] dark:divide-[#212B24]">
                        {searchResults.matches.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-[#F5F7F4] dark:hover:bg-[#1B261F] transition-colors"
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-[#141A15] dark:text-[#F1F5F2] truncate">
                                {item.name}
                              </div>
                              <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B] mt-0.5">
                                {item.stall} · {item.zone} ·{' '}
                                <span className="tabular-nums font-medium text-[#141A15] dark:text-[#F1F5F2]">
                                  ฿{item.price}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                onAddItem(item);
                                setSearchQuery('');
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7] bg-[#EAF2EC] dark:bg-[#1E3527] hover:bg-[#DCEADF] dark:hover:bg-[#264432] rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>ฝากซื้อ</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Smart Out-of-Stock Substitute Recommendations */}
                    {searchResults.substitutes.length > 0 && (
                      <div className="bg-[#FBF8F1] dark:bg-[#241E14] border-t border-[#EAE0C8] dark:border-[#3D311E] px-4 py-3">
                        {searchResults.substitutes.map((sub) => (
                          <div
                            key={sub.outOfStockItem.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-[#7C4A03] dark:text-[#FBBF24]">
                                {sub.outOfStockItem.name} วันนี้หมดแล้ว
                              </div>
                              <div className="text-xs text-[#5A4628] dark:text-[#E5D3B3] mt-0.5 leading-relaxed">
                                แนะนำทดแทน:{' '}
                                <strong className="font-semibold">
                                  {sub.substituteItem.name}
                                </strong>{' '}
                                — {sub.reason}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                onAddItem(sub.substituteItem);
                                setSearchQuery('');
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#14532D] dark:bg-[#1E7E48] hover:bg-[#166534] rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>เลือกตัวแทน ฿{sub.substituteItem.price}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Fallback to Custom Errand */}
                    <div className="bg-[#F5F7F4] dark:bg-[#111813] border-t border-[#E2E6DF] dark:border-[#212B24] px-4 py-2.5 flex items-center justify-between gap-3">
                      <span className="text-xs text-[#4A554C] dark:text-[#98A89B] truncate">
                        ไม่พบรายการที่ต้องการในลิสต์? ฝากคนเดินตลาดซื้อเฉพาะเจาะจงได้
                      </span>
                      <a
                        href="#custom-errand"
                        onClick={() => {
                          onPrefillCustomErrand(searchQuery.trim());
                          setSearchQuery('');
                        }}
                        className="text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7] hover:underline whitespace-nowrap shrink-0"
                      >
                        ฝากซื้อ “{searchQuery.trim()}”
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Clean Quantitative Market Highlights */}
              <div className="mt-7 pt-6 border-t border-[#E2E7DF] dark:border-[#212B24] grid grid-cols-3 gap-4 max-w-xl">
                <div>
                  <div className="text-lg font-bold font-mono tabular-nums text-[#141A15] dark:text-[#F1F5F2]">
                    4 โซน
                  </div>
                  <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">
                    ของสด สตรีทฟู้ด ผัก ขนม
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono tabular-nums text-[#141A15] dark:text-[#F1F5F2]">
                    45 นาที
                  </div>
                  <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">
                    เดินซื้อและส่งถึงหน้าบ้าน
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono tabular-nums text-[#14532D] dark:text-[#6EE7B7]">
                    ฿25
                  </div>
                  <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">
                    ค่าหิ้วเริ่มต้น (ฟรีครบ ฿450)
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action Links */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#suggestions"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#14532D] hover:bg-[#166534] dark:bg-[#1E7E48] dark:hover:bg-[#196B3D] rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
              >
                <span>ให้ระบบแนะนำรายการ</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#catalog"
                className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-[#141A15] dark:text-[#F1F5F2] bg-white dark:bg-[#151E18] border border-[#D4DAD0] dark:border-[#27342B] hover:bg-[#F1F3F0] dark:hover:bg-[#1C2720] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                ดูแผงค้าทั้งหมด
              </a>
            </div>
          </div>

          {/* Right Column: Full-height 16:9 Editorial Market Visual */}
          <div className="lg:col-span-6">
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-[#E2E7DF] dark:border-[#27342B] bg-[#E8ECE6] dark:bg-[#141C17] shadow-sm">
              <MarketImage
                src={MARKET_IMAGES.hero}
                alt="บรรยากาศตลาดริมชล อ.ป่าพยอม ใกล้มหาวิทยาลัยทักษิณ พัทลุง"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 sm:p-6">
                <p className="text-sm font-semibold text-white">
                  ตลาดริมชล ป่าพยอม · ม.ทักษิณ พัทลุง
                </p>
                <p className="text-xs text-white/85 mt-1">
                  ค่าหิ้วเริ่มต้น ฿25 (1–2 โซน) · ฟรีค่าหิ้วเมื่อยอดฝากซื้อครบ ฿450
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
