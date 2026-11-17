import { Minus, Plus, Trash2, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { CartItem, CustomErrandItem, MarketItem, RunnerProfile } from '../types/market';
import {
  calculateRunnerFee,
  FREE_RUNNER_THRESHOLD,
  getCartPairingSuggestions,
} from '../utils/suggestionEngine';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  customItems: CustomErrandItem[];
  allItems: MarketItem[];
  runners: RunnerProfile[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onUpdateNote: (itemId: string, note: string) => void;
  onRemoveCustomItem: (customId: string) => void;
  onAddItem: (item: MarketItem) => void;
  onSubmitOrder: (customerInfo: {
    customerName: string;
    phone: string;
    deliveryPoint: string;
    deliverySlot: string;
    paymentMethod: 'cod' | 'promptpay';
    preferredRunnerId: string;
  }) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  customItems,
  allItems,
  runners,
  onUpdateQuantity,
  onUpdateNote,
  onRemoveCustomItem,
  onAddItem,
  onSubmitOrder,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryPoint, setDeliveryPoint] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('รอบถัดไปทันที (ภายใน 45 นาที)');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'promptpay'>('promptpay');
  const [preferredRunnerId, setPreferredRunnerId] = useState<string>('auto');

  const feeSummary = useMemo(
    () => calculateRunnerFee(cart, customItems),
    [cart, customItems]
  );

  const drawerPairings = useMemo(
    () => getCartPairingSuggestions(cart, allItems).slice(0, 2),
    [cart, allItems]
  );

  const isEmpty = cart.length === 0 && customItems.length === 0;
  const totalAmount = feeSummary.subtotal + feeSummary.runnerFee;

  const bestMatchedRunner = useMemo(() => {
    const available = runners.filter((r) => r.isAvailable);
    if (available.length === 0) return runners[0];
    const zoneMatched = available.find((r) => feeSummary.zones.includes(r.currentZone));
    return zoneMatched ?? available[0];
  }, [runners, feeSummary.zones]);

  if (!isOpen) return null;

  const handleCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (isEmpty) return;
    if (!customerName.trim() || !phone.trim() || !deliveryPoint.trim()) return;

    const resolvedRunnerId =
      preferredRunnerId === 'auto' ? bestMatchedRunner.id : preferredRunnerId;

    onSubmitOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      deliveryPoint: deliveryPoint.trim(),
      deliverySlot,
      paymentMethod,
      preferredRunnerId: resolvedRunnerId,
    });
    setCustomerName('');
    setPhone('');
    setDeliveryPoint('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="ตะกร้าฝากซื้อตลาดริมชล"
        className="relative z-10 w-full max-w-lg bg-white dark:bg-[#131A15] h-full flex flex-col shadow-2xl border-l border-[#E2E7DF] dark:border-[#253128] transition-colors"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E7DF] dark:border-[#212B24] flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#141A15] dark:text-[#F1F5F2]">
              ตะกร้าฝากซื้อตลาดริมชล
            </h2>
            <p className="text-xs text-[#5D6B5F] dark:text-[#98A89B] mt-0.5">
              {isEmpty
                ? 'ยังไม่มีรายการฝากซื้อ'
                : `${feeSummary.zones.length} โซนตลาด · ยอดรวม ฿${totalAmount}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดตะกร้า"
            className="p-2 text-[#4A554C] dark:text-[#A4B2A7] hover:text-[#141A15] dark:hover:text-white hover:bg-[#F1F3F0] dark:hover:bg-[#1B251E] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {isEmpty ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm font-medium text-[#141A15] dark:text-[#F1F5F2]">
                ตะกร้าฝากซื้อของคุณยังว่างอยู่
              </p>
              <p className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">
                ลองใช้ระบบแนะนำเมนูตามงบ หรือเลือกของสดจากแผงค้าในตลาดริมชล
              </p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#166534] dark:bg-[#1E7E48] dark:hover:bg-[#196B3D] rounded-lg cursor-pointer"
              >
                กลับไปเลือกของฝากซื้อ
              </button>
            </div>
          ) : (
            <>
              {/* Free Runner Threshold Progress Notice */}
              <div className="bg-[#F6F8F5] dark:bg-[#18211B] border border-[#E2E7DF] dark:border-[#253128] rounded-xl p-3.5">
                {feeSummary.amountToFree === 0 ? (
                  <p className="text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                    ยอดฝากซื้อครบ ฿{FREE_RUNNER_THRESHOLD} แล้ว — ได้รับสิทธิ์ฟรีค่าหิ้ว ฿0
                  </p>
                ) : (
                  <p className="text-xs text-[#333D35] dark:text-[#D1DDD3]">
                    เพิ่มอีก{' '}
                    <span className="font-mono font-bold text-[#14532D] dark:text-[#6EE7B7]">
                      ฿{feeSummary.amountToFree}
                    </span>{' '}
                    เพื่อรับสิทธิ์ฟรีค่าหิ้ว (ครบ ฿{FREE_RUNNER_THRESHOLD})
                  </p>
                )}
                <div className="mt-2 h-1.5 w-full bg-[#DCE2D8] dark:bg-[#253128] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#14532D] dark:bg-[#34D399] transition-all duration-200"
                    style={{
                      width: `${Math.min(100, (feeSummary.subtotal / FREE_RUNNER_THRESHOLD) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-[#EEF1EC] dark:divide-[#212B24]">
                {cart.map((entry) => (
                  <div key={entry.item.id} className="py-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                          {entry.item.name}
                        </div>
                        <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B] mt-0.5">
                          {entry.item.stall} · {entry.item.zone}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#141A15] dark:text-[#F1F5F2] tabular-nums font-mono shrink-0">
                        ฿{entry.item.price * entry.quantity}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={entry.note}
                        onChange={(e) => onUpdateNote(entry.item.id, e.target.value)}
                        placeholder="เพิ่มโน้ต เช่น หวานน้อย / เลือกตัวใหญ่"
                        className="flex-1 h-8 px-2.5 bg-[#F6F8F5] dark:bg-[#101612] border border-[#E2E7DF] dark:border-[#27342B] rounded-md text-xs text-[#141A15] dark:text-[#F1F5F2] placeholder:text-[#7A877C] dark:placeholder:text-[#6E7F72] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399]"
                      />

                      <div className="flex items-center border border-[#D4DAD0] dark:border-[#27342B] rounded-md bg-white dark:bg-[#18211B] shrink-0">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(entry.item.id, -1)}
                          aria-label={`ลดจำนวน ${entry.item.name}`}
                          className="p-1.5 text-[#4A554C] dark:text-[#A4B2A7] hover:text-[#141A15] dark:hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-semibold tabular-nums text-[#141A15] dark:text-[#F1F5F2]">
                          {entry.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(entry.item.id, 1)}
                          aria-label={`เพิ่มจำนวน ${entry.item.name}`}
                          className="p-1.5 text-[#4A554C] dark:text-[#A4B2A7] hover:text-[#141A15] dark:hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Custom Errand Items */}
                {customItems.map((custom) => (
                  <div key={custom.id} className="py-4 space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                          [นอกรายการ] {custom.name} ×{custom.quantity}
                        </div>
                        <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B] mt-0.5">
                          {custom.stallHint} · {custom.zone}
                        </div>
                        {custom.note && (
                          <div className="text-xs text-[#4A554C] dark:text-[#A4B2A7] mt-0.5">
                            โน้ต: {custom.note}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-bold text-[#141A15] dark:text-[#F1F5F2] tabular-nums font-mono">
                          ~฿{custom.estimatedPrice * custom.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveCustomItem(custom.id)}
                          aria-label={`ลบ ${custom.name}`}
                          className="p-1 text-[#7A877C] hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* In-Drawer Smart Pairing Suggestion */}
              {drawerPairings.length > 0 && (
                <div className="pt-4 border-t border-[#E2E7DF] dark:border-[#212B24]">
                  <div className="text-xs font-semibold text-[#141A15] dark:text-[#F1F5F2] mb-2.5">
                    แนะนำฝากเพิ่มก่อนส่ง (เข้าคู่กับของในตะกร้า)
                  </div>
                  <div className="space-y-2">
                    {drawerPairings.map((sug) => (
                      <div
                        key={sug.item.id}
                        className="flex items-center justify-between gap-3 p-3 bg-[#F6F8F5] dark:bg-[#18211B] border border-[#E2E7DF] dark:border-[#253128] rounded-xl"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[#141A15] dark:text-[#F1F5F2] truncate">
                            {sug.item.name} ·{' '}
                            <span className="font-mono">฿{sug.item.price}</span>
                          </div>
                          <div className="text-[11px] text-[#5D6B5F] dark:text-[#98A89B] truncate mt-0.5">
                            {sug.reason}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onAddItem(sug.item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7] bg-white dark:bg-[#1E2B22] border border-[#D4DAD0] dark:border-[#2A392E] hover:bg-[#EAF2EC] dark:hover:bg-[#24362A] rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>เพิ่ม</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fee Summary */}
              <div className="pt-4 border-t border-[#E2E7DF] dark:border-[#212B24] space-y-2 text-sm">
                <div className="flex items-center justify-between text-[#4A554C] dark:text-[#A4B2A7]">
                  <span>ค่าสินค้าโดยประมาณ</span>
                  <span className="font-mono tabular-nums">฿{feeSummary.subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-[#4A554C] dark:text-[#A4B2A7]">
                  <span>ค่าหิ้ว ({feeSummary.zones.length} โซนตลาด)</span>
                  <span className="font-mono tabular-nums">
                    {feeSummary.runnerFee === 0 ? 'ฟรี (฿0)' : `฿${feeSummary.runnerFee}`}
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold text-base text-[#141A15] dark:text-[#F1F5F2] pt-2 border-t border-[#EEF1EC] dark:border-[#212B24]">
                  <span>ยอดรวมทั้งหมด</span>
                  <span className="font-mono tabular-nums">฿{totalAmount}</span>
                </div>
              </div>

              {/* Delivery & Payment Form */}
              <form
                id="checkout-form"
                onSubmit={handleCheckout}
                className="pt-4 border-t border-[#E2E7DF] dark:border-[#212B24] space-y-3.5"
              >
                <div className="text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3]">
                  ข้อมูลผู้รับและจุดนัดส่ง
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="ชื่อผู้รับ *"
                    className="h-10 px-3 bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-xs text-[#141A15] dark:text-[#F1F5F2] placeholder:text-[#7A877C] dark:placeholder:text-[#6E7F72] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399]"
                  />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="เบอร์โทรติดต่อ *"
                    className="h-10 px-3 bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-xs text-[#141A15] dark:text-[#F1F5F2] placeholder:text-[#7A877C] dark:placeholder:text-[#6E7F72] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399]"
                  />
                </div>

                <input
                  type="text"
                  required
                  value={deliveryPoint}
                  onChange={(e) => setDeliveryPoint(e.target.value)}
                  placeholder="ที่อยู่จัดส่ง / หมู่บ้าน / จุดนัดรับ *"
                  className="w-full h-10 px-3 bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-xs text-[#141A15] dark:text-[#F1F5F2] placeholder:text-[#7A877C] dark:placeholder:text-[#6E7F72] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399]"
                />

                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-xs text-[#141A15] dark:text-[#F1F5F2] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399]"
                >
                  <option value="รอบถัดไปทันที (ภายใน 45 นาที)">
                    รอบถัดไปทันที (ภายใน 45 นาที)
                  </option>
                  <option value="รอบเที่ยง (11:30 – 12:30 น.)">
                    รอบเที่ยง (11:30 – 12:30 น.)
                  </option>
                  <option value="รอบเย็น (16:30 – 17:30 น.)">
                    รอบเย็น (16:30 – 17:30 น.)
                  </option>
                </select>

                <div>
                  <label
                    htmlFor="preferred-runner-select"
                    className="block text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-1"
                  >
                    เลือกผู้รับฝากเดินตลาด
                  </label>
                  <select
                    id="preferred-runner-select"
                    value={preferredRunnerId}
                    onChange={(e) => setPreferredRunnerId(e.target.value)}
                    className="w-full h-10 px-3 bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-xs text-[#141A15] dark:text-[#F1F5F2] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399]"
                  >
                    <option value="auto">
                      แนะนำอัตโนมัติ: {bestMatchedRunner.name} (อยู่{bestMatchedRunner.currentZone})
                    </option>
                    {runners.map((runner) => (
                      <option
                        key={runner.id}
                        value={runner.id}
                        disabled={!runner.isAvailable}
                      >
                        {runner.name} · {runner.currentZone}
                        {!runner.isAvailable ? ' (พักรับงาน)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('promptpay')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      paymentMethod === 'promptpay'
                        ? 'bg-[#EAF2EC] dark:bg-[#1E3527] border-[#14532D] dark:border-[#34D399] text-[#14532D] dark:text-[#6EE7B7] font-semibold'
                        : 'bg-white dark:bg-[#18211B] border-[#D4DAD0] dark:border-[#27342B] text-[#4A554C] dark:text-[#A4B2A7]'
                    }`}
                  >
                    โอน PromptPay (ตอนส่งรูปของ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-[#EAF2EC] dark:bg-[#1E3527] border-[#14532D] dark:border-[#34D399] text-[#14532D] dark:text-[#6EE7B7] font-semibold'
                        : 'bg-white dark:bg-[#18211B] border-[#D4DAD0] dark:border-[#27342B] text-[#4A554C] dark:text-[#A4B2A7]'
                    }`}
                  >
                    เก็บเงินปลายทาง (COD)
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Sticky Checkout Footer */}
        {!isEmpty && (
          <div className="px-6 py-4 border-t border-[#E2E7DF] dark:border-[#212B24] bg-[#F6F8F5] dark:bg-[#111713]">
            <button
              type="submit"
              form="checkout-form"
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#14532D] hover:bg-[#166534] dark:bg-[#1E7E48] dark:hover:bg-[#196B3D] rounded-lg transition-colors cursor-pointer"
            >
              ยืนยันฝากซื้อ (฿{totalAmount})
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
