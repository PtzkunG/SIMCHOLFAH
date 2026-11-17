import { Plus } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { MARKET_ZONES } from '../data/rimcholMarket';
import { CustomErrandItem, MarketZone } from '../types/market';

interface CustomErrandSectionProps {
  prefillName: string;
  onAddCustomErrand: (item: Omit<CustomErrandItem, 'id'>) => void;
}

const QUICK_ERRAND_IDEAS: {
  name: string;
  stallHint: string;
  zone: MarketZone;
  estimatedPrice: number;
  note: string;
}[] = [
  {
    name: 'ปลาทูแม่กลองนึ่งหน้างอคอหัก',
    stallHint: 'แผงปลาทูท้ายตลาดริมน้ำ',
    zone: 'โซนของสดริมน้ำ',
    estimatedPrice: 90,
    note: 'ขอ 2 เข่ง ขนาดกลาง',
  },
  {
    name: 'ขนมครกกะทิสดหน้าต้นหอม-ข้าวโพด',
    stallHint: 'เตาขนมครกป้าติ๋ม หน้าศาลเจ้า',
    zone: 'โซนขนม & เครื่องดื่ม',
    estimatedPrice: 40,
    note: 'ขอแบบกรอบขอบ',
  },
  {
    name: 'พวงมาลัยดอกมะลิสด & ธูปเทียน',
    stallHint: 'แผงดอกไม้ปากซอย 2',
    zone: 'โซนผักผลไม้',
    estimatedPrice: 50,
    note: 'เลือกดอกตูมสด',
  },
  {
    name: 'ส้มตำปูปลาร้า + ไก่ย่างครึ่งตัว',
    stallHint: 'ร้านส้มตำแม่ลำดวน',
    zone: 'โซนสตรีทฟู้ด & กับข้าว',
    estimatedPrice: 135,
    note: 'พริก 3 เม็ด ไม่ใส่ถั่ว',
  },
];

export function CustomErrandSection({
  prefillName,
  onAddCustomErrand,
}: CustomErrandSectionProps) {
  const [name, setName] = useState('');
  const [stallHint, setStallHint] = useState('');
  const [zone, setZone] = useState<MarketZone>('โซนสตรีทฟู้ด & กับข้าว');
  const [estimatedPrice, setEstimatedPrice] = useState('80');
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (prefillName) {
      setName(prefillName);
    }
  }, [prefillName]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = Math.max(10, Number(estimatedPrice) || 50);
    const parsedQty = Math.max(1, Number(quantity) || 1);

    onAddCustomErrand({
      name: name.trim(),
      stallHint: stallHint.trim() || 'ร้านในตลาดริมชล',
      zone,
      estimatedPrice: parsedPrice,
      quantity: parsedQty,
      note: note.trim(),
    });

    setName('');
    setStallHint('');
    setNote('');
    setQuantity('1');
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <section
      id="custom-errand"
      className="py-12 lg:py-16 border-b border-[#E2E7DF] dark:border-[#212B24] bg-white dark:bg-[#111713] transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Explanation & Quick Suggested Ideas */}
          <div className="lg:col-span-5">
            <p className="text-xs font-medium text-[#14532D] dark:text-[#6EE7B7] mb-1.5">
              ฝากซื้อนอกรายการ
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141A15] dark:text-[#F1F5F2]">
              อยากได้ของร้านไหนในริมชล พิมพ์ฝากให้เราเดินซื้อให้ได้เลย
            </h2>
            <p className="mt-3 text-sm text-[#4A554C] dark:text-[#A4B2A7] leading-relaxed">
              ระบุชื่อร้านหรือจุดสังเกตคร่าวๆ พร้อมเพดานราคาโดยประมาณ
              ทีมงานจะถ่ายรูปยืนยันราคาหน้าแผงก่อนจ่ายจริงเสมอ
            </p>

            <div className="mt-7 pt-6 border-t border-[#E2E7DF] dark:border-[#212B24]">
              <div className="text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-3">
                รายการนอกลิสต์ที่คนฝากซื้อบ่อย (กดเพื่อเติมลงฟอร์ม)
              </div>
              <div className="space-y-2.5">
                {QUICK_ERRAND_IDEAS.map((idea) => (
                  <button
                    key={idea.name}
                    type="button"
                    onClick={() => {
                      setName(idea.name);
                      setStallHint(idea.stallHint);
                      setZone(idea.zone);
                      setEstimatedPrice(String(idea.estimatedPrice));
                      setNote(idea.note);
                    }}
                    className="w-full text-left px-4 py-3 bg-[#F6F8F5] dark:bg-[#151D17] hover:bg-[#EEF2EC] dark:hover:bg-[#1B261E] border border-[#E2E7DF] dark:border-[#253128] rounded-xl transition-colors flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#141A15] dark:text-[#F1F5F2] truncate">
                        {idea.name}
                      </div>
                      <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B] truncate mt-0.5">
                        {idea.stallHint} · งบ ~฿{idea.estimatedPrice}
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-[#14532D] dark:text-[#6EE7B7] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-[#F6F8F5] dark:bg-[#151D17] border border-[#E2E7DF] dark:border-[#253128] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="custom-item-name"
                  className="block text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-1.5"
                >
                  ชื่อสินค้าหรือเมนูที่ต้องการฝากซื้อ *
                </label>
                <input
                  id="custom-item-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น ขนมครกป้าติ๋ม 2 กล่อง, พริกแกงเผ็ดครึ่งโล"
                  className="w-full h-11 px-3.5 bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-sm text-[#141A15] dark:text-[#F1F5F2] placeholder:text-[#7A877C] dark:placeholder:text-[#6E7F72] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399]"
                />
              </div>

              <div>
                <label
                  htmlFor="custom-stall-hint"
                  className="block text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-1.5"
                >
                  ชื่อร้าน / จุดสังเกต (ถ้าทราบ)
                </label>
                <input
                  id="custom-stall-hint"
                  type="text"
                  value={stallHint}
                  onChange={(e) => setStallHint(e.target.value)}
                  placeholder="เช่น แผงข้างศาลเจ้า, ริมท่าน้ำ"
                  className="w-full h-11 px-3.5 bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-sm text-[#141A15] dark:text-[#F1F5F2] placeholder:text-[#7A877C] dark:placeholder:text-[#6E7F72] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399]"
                />
              </div>

              <div>
                <label
                  htmlFor="custom-zone"
                  className="block text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-1.5"
                >
                  โซนตลาดโดยประมาณ
                </label>
                <select
                  id="custom-zone"
                  value={zone}
                  onChange={(e) => setZone(e.target.value as MarketZone)}
                  className="w-full h-11 px-3 bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-sm text-[#141A15] dark:text-[#F1F5F2] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399]"
                >
                  {MARKET_ZONES.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="custom-price"
                  className="block text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-1.5"
                >
                  งบประมาณต่อชิ้น (บาท)
                </label>
                <input
                  id="custom-price"
                  type="number"
                  min={10}
                  step={5}
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-sm text-[#141A15] dark:text-[#F1F5F2] tabular-nums font-mono focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399]"
                />
              </div>

              <div>
                <label
                  htmlFor="custom-qty"
                  className="block text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-1.5"
                >
                  จำนวนที่ฝากซื้อ
                </label>
                <input
                  id="custom-qty"
                  type="number"
                  min={1}
                  max={20}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-sm text-[#141A15] dark:text-[#F1F5F2] tabular-nums font-mono focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399]"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="custom-note"
                  className="block text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-1.5"
                >
                  หมายเหตุให้คนเดินตลาด (เช่น สุกมาก/น้อย, แยกน้ำ, เผ็ดน้อย)
                </label>
                <input
                  id="custom-note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="ระบุรายละเอียดเพิ่มเติม หรือของทดแทนถ้าร้านปิด"
                  className="w-full h-11 px-3.5 bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-sm text-[#141A15] dark:text-[#F1F5F2] placeholder:text-[#7A877C] dark:placeholder:text-[#6E7F72] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399]"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">
                คิดเงินตามใบเสร็จ/ราคาจริงหน้าร้าน ไม่บวกราคาสินค้าเพิ่ม
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#14532D] hover:bg-[#166534] dark:bg-[#1E7E48] dark:hover:bg-[#196B3D] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {addedFeedback ? 'เพิ่มลงตะกร้าแล้ว' : 'เพิ่มรายการฝากซื้อ'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
