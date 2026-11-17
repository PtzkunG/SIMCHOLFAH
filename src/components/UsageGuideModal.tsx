import { ArrowRight, CheckCircle2, HelpCircle, QrCode, ShoppingBag, UserCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UserRole } from '../types/market';

interface UsageGuideModalProps {
  isOpen: boolean;
  initialTab: UserRole;
  onClose: () => void;
  onJumpToRequesterSection: (sectionId: string) => void;
  onOpenCart: () => void;
  onSwitchToRunner: () => void;
}

export function UsageGuideModal({
  isOpen,
  initialTab,
  onClose,
  onJumpToRequesterSection,
  onOpenCart,
  onSwitchToRunner,
}: UsageGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'requester' | 'runner' | 'fees'>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="คู่มือแนะนำการใช้งานแอปฝากซื้อตลาดริมชล"
        className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#131A15] border border-[#E2E7DF] dark:border-[#253128] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-colors"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E7DF] dark:border-[#212B24] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#14532D] dark:text-[#6EE7B7] shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-[#141A15] dark:text-[#F1F5F2]">
                แนะนำการใช้งาน ฝากซื้อตลาดริมชล
              </h2>
              <p className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">
                คู่มือทีละขั้นตอนสำหรับทั้งผู้ฝากซื้อและผู้รับฝาก พร้อมทางลัดไปยังแต่ละเมนู
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดคู่มือการใช้งาน"
            className="p-2 text-[#4A554C] dark:text-[#A4B2A7] hover:text-[#141A15] dark:hover:text-white hover:bg-[#F1F3F0] dark:hover:bg-[#1B251E] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Segmented Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#EFF2ED] dark:bg-[#18211B] rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('requester')}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'requester'
                  ? 'bg-white dark:bg-[#233128] text-[#141A15] dark:text-white shadow-xs font-semibold'
                  : 'text-[#4A554C] dark:text-[#98A89B] hover:text-[#141A15] dark:hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>สำหรับผู้ฝากซื้อ</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('runner')}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'runner'
                  ? 'bg-white dark:bg-[#233128] text-[#141A15] dark:text-white shadow-xs font-semibold'
                  : 'text-[#4A554C] dark:text-[#98A89B] hover:text-[#141A15] dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>สำหรับผู้รับฝาก</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fees')}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'fees'
                  ? 'bg-white dark:bg-[#233128] text-[#141A15] dark:text-white shadow-xs font-semibold'
                  : 'text-[#4A554C] dark:text-[#98A89B] hover:text-[#141A15] dark:hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>ค่าหิ้ว & ระบบแนะนำ</span>
            </button>
          </div>

          {activeTab === 'requester' && (
            <div className="space-y-4">
              <div className="divide-y divide-[#EEF1EC] dark:divide-[#212B24] border border-[#E2E7DF] dark:border-[#253128] rounded-xl bg-[#F6F8F5] dark:bg-[#161E18]">
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                      01. ค้นหาหรือให้ระบบช่วยคิดรายการ
                    </div>
                    <p className="text-xs text-[#4A554C] dark:text-[#A4B2A7] mt-1 leading-relaxed">
                      พิมพ์ค้นหาเมนูที่ต้องการในช่องค้นหา หรือใช้ “ช่วยคิดรายการตามงบและช่วงเวลา” เพื่อจัดเซตอาหารที่อยู่โซนร้านใกล้กัน
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onJumpToRequesterSection('suggestions');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7] bg-white dark:bg-[#1E2A22] border border-[#D4DAD0] dark:border-[#2C3B31] hover:bg-[#EAF2EC] dark:hover:bg-[#25352A] rounded-lg whitespace-nowrap shrink-0 self-start sm:self-center cursor-pointer"
                  >
                    <span>ไปที่ระบบแนะนำ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                      02. เลือกของจากแผงค้า หรือฝากนอกรายการ
                    </div>
                    <p className="text-xs text-[#4A554C] dark:text-[#A4B2A7] mt-1 leading-relaxed">
                      เลือกอาหารสด สตรีทฟู้ด ผักผลไม้ หรือขนมไทย หากร้านที่อยากได้ไม่อยู่ในลิสต์ กดกรอกที่ส่วน “ฝากซื้อนอกรายการ” ได้ทันที
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onJumpToRequesterSection('custom-errand');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7] bg-white dark:bg-[#1E2A22] border border-[#D4DAD0] dark:border-[#2C3B31] hover:bg-[#EAF2EC] dark:hover:bg-[#25352A] rounded-lg whitespace-nowrap shrink-0 self-start sm:self-center cursor-pointer"
                  >
                    <span>ไปที่ฝากนอกรายการ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                      03. เปิดตะกร้า ใส่โน้ต และเลือกผู้รับฝาก
                    </div>
                    <p className="text-xs text-[#4A554C] dark:text-[#A4B2A7] mt-1 leading-relaxed">
                      ระบุหมายเหตุเฉพาะร้าน (เช่น หวานน้อย, แยกน้ำ) เลือกผู้รับฝากที่อยู่โซนเดียวกับของในตะกร้า แล้วกดยืนยันฝากซื้อ
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCart();
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7] bg-white dark:bg-[#1E2A22] border border-[#D4DAD0] dark:border-[#2C3B31] hover:bg-[#EAF2EC] dark:hover:bg-[#25352A] rounded-lg whitespace-nowrap shrink-0 self-start sm:self-center cursor-pointer"
                  >
                    <span>เปิดตะกร้าฝากซื้อ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                      04. ส่ง QR Code หาคนรับฝาก และติดตามสถานะ
                    </div>
                    <p className="text-xs text-[#4A554C] dark:text-[#A4B2A7] mt-1 leading-relaxed">
                      หลังสั่งซื้อ กดส่ง QR รายการฝากซื้อ (Pick-list) หรือ QR ยอดโอน PromptPay หาคนรับฝาก พร้อมติดตามสถานะแบบเรียลไทม์
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onJumpToRequesterSection('order-tracking');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7] bg-white dark:bg-[#1E2A22] border border-[#D4DAD0] dark:border-[#2C3B31] hover:bg-[#EAF2EC] dark:hover:bg-[#25352A] rounded-lg whitespace-nowrap shrink-0 self-start sm:self-center cursor-pointer"
                  >
                    <span>ดูสถานะออเดอร์</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'runner' && (
            <div className="space-y-4">
              <div className="divide-y divide-[#EEF1EC] dark:divide-[#212B24] border border-[#E2E7DF] dark:border-[#253128] rounded-xl bg-[#F6F8F5] dark:bg-[#161E18]">
                <div className="p-4">
                  <div className="text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                    01. สลับเข้าสู่โหมด “ผู้รับฝาก (คนเดินตลาด)” และเลือกโซน
                  </div>
                  <p className="text-xs text-[#4A554C] dark:text-[#A4B2A7] mt-1 leading-relaxed">
                    เลือกโปรไฟล์ผู้รับฝากของคุณ (เช่น พี่ต้น, พี่เอก, น้องเมย์) ตั้งโซนตลาดที่กำลังเดินอยู่ และเปิดสถานะ “เปิดรับฝาก” เพื่อให้ผู้ฝากจับคู่ได้ตรงโซน
                  </p>
                </div>

                <div className="p-4">
                  <div className="text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                    02. กดรับงานและดูข้อมูล QR จากผู้ฝาก
                  </div>
                  <p className="text-xs text-[#4A554C] dark:text-[#A4B2A7] mt-1 leading-relaxed">
                    ตรวจดูชื่อผู้ฝาก จุดนัดส่ง รอบเวลา และกด “รับฝากรายการนี้” เพื่อเปลี่ยนสถานะเป็นกำลังเดินซื้อ พร้อมเปิดดู QR รายการหรือสลิปที่ผู้ฝากส่งมา
                  </p>
                </div>

                <div className="p-4">
                  <div className="text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                    03. ติ๊กเช็กลิสต์ซื้อของทีละแผงและส่งอัปเดต
                  </div>
                  <p className="text-xs text-[#4A554C] dark:text-[#A4B2A7] mt-1 leading-relaxed">
                    กดติ๊กถูกทีละรายการเมื่อซื้อเสร็จแล้วเพื่อป้องกันตกหล่น และพิมพ์ข้อความแจ้งผู้ฝากได้ทันทีหากหน้าร้านมีรายละเอียดเพิ่มเติม
                  </p>
                </div>

                <div className="p-4">
                  <div className="text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                    04. เปิด QR PromptPay รับเงินและปิดงาน
                  </div>
                  <p className="text-xs text-[#4A554C] dark:text-[#A4B2A7] mt-1 leading-relaxed">
                    กด “ซื้อครบแล้ว · ออกไปส่ง” และแสดง QR PromptPay ประจำตัวเมื่อส่งถึงมือผู้ฝาก จากนั้นกด “ยืนยันส่งถึงผู้ฝากแล้ว”
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToRunner();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#166534] dark:bg-[#1E7E48] dark:hover:bg-[#196B3D] rounded-lg cursor-pointer"
                >
                  <span>ลองสลับไปโหมดผู้รับฝากตอนนี้</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-4">
              <div className="bg-[#F6F8F5] dark:bg-[#161E18] border border-[#E2E7DF] dark:border-[#253128] rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-[#141A15] dark:text-[#F1F5F2]">
                  วิธีคิดค่าหิ้วและเคล็ดลับประหยัดค่าเดินตลาด
                </h3>
                <ul className="space-y-2 text-xs text-[#4A554C] dark:text-[#A4B2A7] leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#14532D] dark:text-[#6EE7B7] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#141A15] dark:text-[#F1F5F2]">
                        ค่าหิ้วเริ่มต้น ฿25
                      </strong>{' '}
                      ครอบคลุมการเดินซื้อ 1–2 โซนตลาด (เพิ่มโซนละ ฿10 หากสั่งข้ามหลายโซน)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#14532D] dark:text-[#6EE7B7] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#141A15] dark:text-[#F1F5F2]">
                        ฟรีค่าหิ้ว ฿0 ทันที
                      </strong>{' '}
                      เมื่อยอดรวมค่าสินค้าในตะกร้าครบ ฿450 ขึ้นไป
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#14532D] dark:text-[#6EE7B7] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#141A15] dark:text-[#F1F5F2]">
                        ระบบ Suggestion จับคู่โซนเดียวกัน:
                      </strong>{' '}
                      รายการแนะนำจะเน้นของที่อยู่โซนเดียวกับสินค้าในตะกร้าเพื่อไม่ให้เสียค่าเดินเพิ่ม
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#14532D] dark:text-[#6EE7B7] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#141A15] dark:text-[#F1F5F2]">
                        ระบบแนะนำของทดแทนอัตโนมัติ:
                      </strong>{' '}
                      หากสินค้าบางอย่างหมดรอบเช้า ระบบจะแนะนำของสดจากแผงใกล้เคียงที่มีพร้อมส่งทันที
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E7DF] dark:border-[#212B24] bg-[#F6F8F5] dark:bg-[#111713] flex items-center justify-between gap-4">
          <span className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">
            เปิดดูคู่มือนี้ได้ทุกเมื่อจากแถบ “คู่มือแนะนำการใช้งาน” ด้านบน
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#166534] dark:bg-[#1E7E48] dark:hover:bg-[#196B3D] rounded-lg cursor-pointer"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
}
