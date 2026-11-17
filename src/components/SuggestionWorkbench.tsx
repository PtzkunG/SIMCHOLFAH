import { Check, Plus, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  CartItem,
  CravingStyle,
  MarketItem,
  MealTime,
  SuggestionPreferences,
} from '../types/market';
import {
  generateContextualBundle,
  getCartPairingSuggestions,
} from '../utils/suggestionEngine';
import { MarketImage } from './MarketImage';

interface SuggestionWorkbenchProps {
  allItems: MarketItem[];
  cart: CartItem[];
  onAddItem: (item: MarketItem, quantity?: number) => void;
  onAddBundle: (entries: { item: MarketItem; quantity: number }[]) => void;
}

const MEAL_OPTIONS: { value: MealTime; label: string }[] = [
  { value: 'morning', label: 'มื้อเช้า' },
  { value: 'lunch', label: 'มื้อกลางวัน' },
  { value: 'dinner', label: 'มื้อเย็น' },
  { value: 'snack', label: 'ของว่างบ่าย' },
];

const PEOPLE_OPTIONS: { value: 1 | 2 | 4; label: string }[] = [
  { value: 1, label: '1 คน' },
  { value: 2, label: '2–3 คน' },
  { value: 4, label: '4+ คน' },
];

const BUDGET_OPTIONS: { value: 150 | 350 | 700; label: string }[] = [
  { value: 150, label: 'งบ ≤ ฿150' },
  { value: 350, label: 'งบ ≤ ฿350' },
  { value: 700, label: 'งบ ≤ ฿700' },
];

const CRAVING_OPTIONS: { value: CravingStyle; label: string }[] = [
  { value: 'all', label: 'จัดรวมครบ' },
  { value: 'seafood', label: 'ซีฟู้ดริมน้ำ' },
  { value: 'streetfood', label: 'สตรีทฟู้ด & กับข้าว' },
  { value: 'fresh', label: 'ผัก & ผลไม้สด' },
  { value: 'dessert', label: 'ขนม & น้ำชง' },
];

export function SuggestionWorkbench({
  allItems,
  cart,
  onAddItem,
  onAddBundle,
}: SuggestionWorkbenchProps) {
  const [prefs, setPrefs] = useState<SuggestionPreferences>({
    mealTime: 'lunch',
    peopleCount: 2,
    budget: 350,
    craving: 'all',
  });

  const [bundleAddedNotice, setBundleAddedNotice] = useState(false);

  const bundle = useMemo(
    () => generateContextualBundle(prefs, allItems),
    [prefs, allItems]
  );

  const pairingSuggestions = useMemo(
    () => getCartPairingSuggestions(cart, allItems),
    [cart, allItems]
  );

  const handleAddEntireBundle = () => {
    onAddBundle(bundle.items.map((entry) => ({ item: entry.item, quantity: entry.quantity })));
    setBundleAddedNotice(true);
    window.setTimeout(() => setBundleAddedNotice(false), 1800);
  };

  const resetDefaults = () => {
    setPrefs({
      mealTime: 'lunch',
      peopleCount: 2,
      budget: 350,
      craving: 'all',
    });
  };

  return (
    <section
      id="suggestions"
      className="py-12 lg:py-16 border-b border-[#E2E7DF] dark:border-[#212B24] bg-white dark:bg-[#111713] transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E2E7DF] dark:border-[#212B24]">
          <div>
            <p className="text-xs font-medium text-[#14532D] dark:text-[#6EE7B7] mb-1.5">
              ระบบแนะนำรายการฝากซื้อ
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141A15] dark:text-[#F1F5F2]">
              ช่วยคิดรายการตามงบและช่วงเวลา
            </h2>
            <p className="mt-2 text-sm text-[#4A554C] dark:text-[#A4B2A7] max-w-2xl">
              เลือกมื้ออาหาร จำนวนคน และงบประมาณ ระบบจะจัดชุดอาหารที่อยู่โซนร้านใกล้กันเพื่อช่วยประหยัดค่าหิ้ว
            </p>
          </div>
          <button
            type="button"
            onClick={resetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#4A554C] dark:text-[#C5D1C7] hover:text-[#141A15] dark:hover:text-white border border-[#D4DAD0] dark:border-[#27342B] rounded-lg hover:bg-[#F5F7F4] dark:hover:bg-[#1A241D] transition-colors whitespace-nowrap shrink-0 self-start md:self-auto cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>รีเซ็ตตัวเลือก</span>
          </button>
        </div>

        {/* Interactive Preference Controls + Live Bundle Result */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Meal Time */}
            <div>
              <div className="text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-2">
                1. ช่วงเวลาที่ต้องการรับของ
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-1.5 p-1 bg-[#EFF2ED] dark:bg-[#18211B] rounded-xl">
                {MEAL_OPTIONS.map((opt) => {
                  const active = prefs.mealTime === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPrefs((p) => ({ ...p, mealTime: opt.value }))}
                      className={`px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-white dark:bg-[#233128] text-[#141A15] dark:text-white shadow-xs font-semibold'
                          : 'text-[#4A554C] dark:text-[#98A89B] hover:text-[#141A15] dark:hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* People & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-2">
                  2. จำนวนคนทาน
                </div>
                <div className="flex items-center gap-1 p-1 bg-[#EFF2ED] dark:bg-[#18211B] rounded-xl">
                  {PEOPLE_OPTIONS.map((opt) => {
                    const active = prefs.peopleCount === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPrefs((p) => ({ ...p, peopleCount: opt.value }))}
                        className={`flex-1 px-2.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-white dark:bg-[#233128] text-[#141A15] dark:text-white shadow-xs font-semibold'
                            : 'text-[#4A554C] dark:text-[#98A89B] hover:text-[#141A15] dark:hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-2">
                  3. งบประมาณค่าของ
                </div>
                <div className="flex items-center gap-1 p-1 bg-[#EFF2ED] dark:bg-[#18211B] rounded-xl">
                  {BUDGET_OPTIONS.map((opt) => {
                    const active = prefs.budget === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPrefs((p) => ({ ...p, budget: opt.value }))}
                        className={`flex-1 px-2 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 tabular-nums cursor-pointer ${
                          active
                            ? 'bg-white dark:bg-[#233128] text-[#141A15] dark:text-white shadow-xs font-semibold'
                            : 'text-[#4A554C] dark:text-[#98A89B] hover:text-[#141A15] dark:hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Craving Style */}
            <div>
              <div className="text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-2">
                4. แนวอาหารหรือโซนที่อยากเน้น
              </div>
              <div className="flex flex-wrap gap-1.5 p-1 bg-[#EFF2ED] dark:bg-[#18211B] rounded-xl">
                {CRAVING_OPTIONS.map((opt) => {
                  const active = prefs.craving === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPrefs((p) => ({ ...p, craving: opt.value }))}
                      className={`px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-white dark:bg-[#233128] text-[#141A15] dark:text-white shadow-xs font-semibold'
                          : 'text-[#4A554C] dark:text-[#98A89B] hover:text-[#141A15] dark:hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Suggested Bundle Output Column (7 cols) */}
          <div className="lg:col-span-7 bg-[#F6F8F5] dark:bg-[#151D17] border border-[#E2E7DF] dark:border-[#253128] rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#E2E7DF] dark:border-[#253128]">
              <div>
                <h3 className="text-lg font-bold text-[#141A15] dark:text-[#F1F5F2]">
                  {bundle.title}
                </h3>
                <p className="text-xs text-[#4A554C] dark:text-[#A4B2A7] mt-1">
                  {bundle.subtitle}
                </p>
                <p className="text-xs font-medium text-[#14532D] dark:text-[#6EE7B7] mt-2">
                  {bundle.savingsNote}
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">
                  รวมค่าของในชุด
                </div>
                <div className="text-2xl font-bold text-[#141A15] dark:text-[#F1F5F2] tabular-nums font-mono">
                  ฿{bundle.totalPrice}
                </div>
                <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B] tabular-nums">
                  ค่าหิ้วโดยประมาณ ฿{bundle.estimatedRunnerFee}
                </div>
              </div>
            </div>

            {/* Bundle Item Rows */}
            <div className="divide-y divide-[#E2E7DF] dark:divide-[#222D25]">
              {bundle.items.map((entry) => (
                <div
                  key={entry.item.id}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-[#E2E7DF] dark:border-[#27342B] shrink-0 bg-white dark:bg-[#1D2720]">
                      <MarketImage
                        src={entry.item.image}
                        alt={entry.item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#141A15] dark:text-[#F1F5F2] truncate">
                        {entry.item.name}{' '}
                        {entry.quantity > 1 && (
                          <span className="font-mono text-xs text-[#14532D] dark:text-[#6EE7B7]">
                            ×{entry.quantity}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B] mt-0.5 truncate">
                        {entry.role} · {entry.item.stall} · {entry.item.zone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-[#141A15] dark:text-[#F1F5F2] tabular-nums font-mono">
                      ฿{entry.item.price * entry.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAddItem(entry.item, entry.quantity)}
                      aria-label={`เพิ่ม ${entry.item.name}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#14532D] dark:text-[#6EE7B7] bg-white dark:bg-[#1B261E] border border-[#D4DAD0] dark:border-[#2A392E] hover:bg-[#EAF2EC] dark:hover:bg-[#24362A] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>เพิ่ม</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-5 border-t border-[#E2E7DF] dark:border-[#253128] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">
                โซนที่เดินซื้อ: {bundle.zonesUsed.join(' / ')}
              </div>
              <button
                type="button"
                onClick={handleAddEntireBundle}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#14532D] hover:bg-[#166534] dark:bg-[#1E7E48] dark:hover:bg-[#196B3D] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {bundleAddedNotice ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>เพิ่มทั้งชุดลงตะกร้าแล้ว</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>เพิ่มทั้งชุดนี้ลงตะกร้า (฿{bundle.totalPrice})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Cart-Aware Pairing Suggestions */}
        <div className="mt-12 pt-8 border-t border-[#E2E7DF] dark:border-[#212B24]">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-5">
            <div>
              <h3 className="text-lg font-bold text-[#141A15] dark:text-[#F1F5F2]">
                {cart.length > 0
                  ? 'แนะนำรายการที่เข้าคู่กับตะกร้าของคุณตอนนี้'
                  : 'จับคู่ยอดฮิตประจำตลาดริมชล (อัปเดตตามของในตะกร้า)'}
              </h3>
              <p className="text-xs text-[#4A554C] dark:text-[#A4B2A7] mt-1">
                {cart.length > 0
                  ? 'วิเคราะห์จากของที่เลือกไว้เพื่อแนะนำเครื่องเคียง น้ำจิ้ม หรือร้านในโซนเดียวกันที่ไม่เสียค่าหิ้วเพิ่ม'
                  : 'ลองเพิ่มของลงตะกร้าสัก 1 อย่าง ระบบจะเปลี่ยนคำแนะนำด้านล่างให้เข้าคู่กันทันที'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pairingSuggestions.map((suggestion) => (
              <div
                key={suggestion.item.id}
                className="flex flex-col justify-between bg-[#F6F8F5] dark:bg-[#151D17] border border-[#E2E7DF] dark:border-[#253128] rounded-xl p-4 hover:-translate-y-0.5 hover:border-[#BFC9BB] dark:hover:border-[#364A3B] transition-all"
              >
                <div>
                  <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B] truncate">
                    {suggestion.item.stall} · {suggestion.item.zone}
                  </div>
                  <h4 className="text-sm font-semibold text-[#141A15] dark:text-[#F1F5F2] mt-1 line-clamp-2">
                    {suggestion.item.name}
                  </h4>
                  <p className="text-xs text-[#4A554C] dark:text-[#A4B2A7] mt-2 leading-relaxed">
                    {suggestion.reason}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E2E7DF] dark:border-[#222D25] flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-[#141A15] dark:text-[#F1F5F2] tabular-nums font-mono">
                      ฿{suggestion.item.price}
                    </div>
                    {suggestion.sameZoneFree && (
                      <div className="text-[11px] font-medium text-[#14532D] dark:text-[#6EE7B7]">
                        โซนเดียวกัน +฿0 ค่าหิ้ว
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddItem(suggestion.item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7] bg-white dark:bg-[#1B261E] border border-[#D4DAD0] dark:border-[#2A392E] hover:bg-[#EAF2EC] dark:hover:bg-[#24362A] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ฝากเพิ่ม</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
