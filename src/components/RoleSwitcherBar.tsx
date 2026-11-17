import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Moon,
  ShoppingBag,
  Sun,
  UserCheck,
} from 'lucide-react';
import { useState } from 'react';
import { RunnerProfile, UserRole } from '../types/market';

interface RoleSwitcherBarProps {
  role: UserRole;
  onChangeRole: (role: UserRole) => void;
  activeRunner: RunnerProfile;
  pendingJobsCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenUsageGuide: () => void;
  onJumpToSection: (sectionId: string) => void;
  onOpenCart: () => void;
}

export function RoleSwitcherBar({
  role,
  onChangeRole,
  activeRunner,
  pendingJobsCount,
  theme,
  onToggleTheme,
  onOpenUsageGuide,
  onJumpToSection,
  onOpenCart,
}: RoleSwitcherBarProps) {
  const [showQuickStrip, setShowQuickStrip] = useState(true);

  return (
    <div className="bg-[#ECF0EA] dark:bg-[#111813] border-b border-[#DCE2D8] dark:border-[#1F2922] transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col gap-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Role Segmented Switch */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#18211B] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg self-start lg:self-auto shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <button
              type="button"
              onClick={() => onChangeRole('requester')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                role === 'requester'
                  ? 'bg-[#14532D] dark:bg-[#1E7E48] text-white'
                  : 'text-[#4A554C] dark:text-[#A4B2A7] hover:text-[#141A15] dark:hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>ผู้ฝากซื้อ</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeRole('runner')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                role === 'runner'
                  ? 'bg-[#14532D] dark:bg-[#1E7E48] text-white'
                  : 'text-[#4A554C] dark:text-[#A4B2A7] hover:text-[#141A15] dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>ผู้รับฝาก (คนเดินตลาด)</span>
              {pendingJobsCount > 0 && (
                <span
                  className={`font-mono text-[11px] tabular-nums px-1.5 rounded ${
                    role === 'runner'
                      ? 'bg-white/20 text-white'
                      : 'bg-[#EAF2EC] dark:bg-[#1F3527] text-[#14532D] dark:text-[#6EE7B7]'
                  }`}
                >
                  {pendingJobsCount}
                </span>
              )}
            </button>
          </div>

          {/* Right Workspace Controls: Status + Quick Guide + Theme Toggle */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5 text-xs text-[#4A554C] dark:text-[#A4B2A7]">
            <span className="mr-1">
              {role === 'requester' ? (
                <>
                  บทบาทปัจจุบัน:{' '}
                  <strong className="font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                    ผู้ฝากซื้อ
                  </strong>
                </>
              ) : (
                <>
                  ผู้รับฝากออนไลน์:{' '}
                  <strong className="font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                    {activeRunner.name}
                  </strong>{' '}
                  · {activeRunner.currentZone}
                </>
              )}
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowQuickStrip((v) => !v)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#333D35] dark:text-[#D1DDD3] bg-white dark:bg-[#18211B] border border-[#D4DAD0] dark:border-[#27342B] hover:bg-[#F8F9F7] dark:hover:bg-[#1F2B23] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>ขั้นตอนใช้งาน</span>
                {showQuickStrip ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={onOpenUsageGuide}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7] bg-white dark:bg-[#18211B] border border-[#BFD7C4] dark:border-[#294A35] hover:bg-[#EAF2EC] dark:hover:bg-[#1E3325] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>คู่มือแนะนำการใช้งาน</span>
              </button>

              {/* Light / Dark Mode Switcher */}
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={
                  theme === 'dark' ? 'สลับเป็นโหมดสว่าง (Light Mode)' : 'สลับเป็นโหมดมืด (Dark Mode)'
                }
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#141A15] dark:text-[#F1F5F2] bg-white dark:bg-[#18211B] border border-[#D4DAD0] dark:border-[#27342B] hover:bg-[#F8F9F7] dark:hover:bg-[#1F2B23] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#FBBF24]" />
                    <span>โหมดสว่าง</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#334155]" />
                    <span>โหมดมืด</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Inline Role-Aware Quick-Start Strip */}
        {showQuickStrip && (
          <div className="pt-2.5 border-t border-[#DCE2D8] dark:border-[#1F2922]">
            {role === 'requester' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => onJumpToSection('suggestions')}
                  className="text-left px-3.5 py-2.5 bg-white/85 dark:bg-[#18211B]/90 hover:bg-white dark:hover:bg-[#1E2922] border border-[#DCE2D8] dark:border-[#27342B] rounded-lg transition-colors cursor-pointer"
                >
                  <span className="font-mono font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                    01.
                  </span>{' '}
                  <span className="font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                    ให้ระบบแนะนำเมนู
                  </span>
                  <div className="text-[11px] text-[#5D6B5F] dark:text-[#98A89B] mt-0.5 truncate">
                    เลือกมื้อและงบ หรือค้นหาของที่ต้องการ
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onJumpToSection('catalog')}
                  className="text-left px-3.5 py-2.5 bg-white/85 dark:bg-[#18211B]/90 hover:bg-white dark:hover:bg-[#1E2922] border border-[#DCE2D8] dark:border-[#27342B] rounded-lg transition-colors cursor-pointer"
                >
                  <span className="font-mono font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                    02.
                  </span>{' '}
                  <span className="font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                    เลือกแผงค้า / ฝากนอกรายการ
                  </span>
                  <div className="text-[11px] text-[#5D6B5F] dark:text-[#98A89B] mt-0.5 truncate">
                    กด + ฝากซื้อ หรือพิมพ์ฝากร้านที่ไม่มีในลิสต์
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onOpenCart}
                  className="text-left px-3.5 py-2.5 bg-white/85 dark:bg-[#18211B]/90 hover:bg-white dark:hover:bg-[#1E2922] border border-[#DCE2D8] dark:border-[#27342B] rounded-lg transition-colors cursor-pointer"
                >
                  <span className="font-mono font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                    03.
                  </span>{' '}
                  <span className="font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                    เลือกผู้รับฝากในตะกร้า
                  </span>
                  <div className="text-[11px] text-[#5D6B5F] dark:text-[#98A89B] mt-0.5 truncate">
                    ใส่โน้ตเฉพาะร้าน จุดส่ง แล้วยืนยันออเดอร์
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onJumpToSection('order-tracking')}
                  className="text-left px-3.5 py-2.5 bg-white/85 dark:bg-[#18211B]/90 hover:bg-white dark:hover:bg-[#1E2922] border border-[#DCE2D8] dark:border-[#27342B] rounded-lg transition-colors cursor-pointer"
                >
                  <span className="font-mono font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                    04.
                  </span>{' '}
                  <span className="font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                    ส่ง QR หาคนรับฝาก & รอรับของ
                  </span>
                  <div className="text-[11px] text-[#5D6B5F] dark:text-[#98A89B] mt-0.5 truncate">
                    ส่ง QR รายการหรือ PromptPay และดูสถานะสด
                  </div>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                <div className="px-3.5 py-2.5 bg-white/85 dark:bg-[#18211B]/90 border border-[#DCE2D8] dark:border-[#27342B] rounded-lg">
                  <span className="font-mono font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                    01.
                  </span>{' '}
                  <span className="font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                    ตั้งโซนและเปิดรับฝาก
                  </span>
                  <div className="text-[11px] text-[#5D6B5F] dark:text-[#98A89B] mt-0.5 truncate">
                    เลือกโปรไฟล์และโซนที่กำลังเดินอยู่
                  </div>
                </div>
                <div className="px-3.5 py-2.5 bg-white/85 dark:bg-[#18211B]/90 border border-[#DCE2D8] dark:border-[#27342B] rounded-lg">
                  <span className="font-mono font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                    02.
                  </span>{' '}
                  <span className="font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                    กดรับฝากรายการใหม่
                  </span>
                  <div className="text-[11px] text-[#5D6B5F] dark:text-[#98A89B] mt-0.5 truncate">
                    ตรวจดูจุดส่ง รอบเวลา และกดรับงาน
                  </div>
                </div>
                <div className="px-3.5 py-2.5 bg-white/85 dark:bg-[#18211B]/90 border border-[#DCE2D8] dark:border-[#27342B] rounded-lg">
                  <span className="font-mono font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                    03.
                  </span>{' '}
                  <span className="font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                    ติ๊กเช็กลิสต์ขณะเดินซื้อ
                  </span>
                  <div className="text-[11px] text-[#5D6B5F] dark:text-[#98A89B] mt-0.5 truncate">
                    กดติ๊กทีละร้านเพื่อไม่ให้ตกหล่นและแจ้งผู้ฝาก
                  </div>
                </div>
                <div className="px-3.5 py-2.5 bg-white/85 dark:bg-[#18211B]/90 border border-[#DCE2D8] dark:border-[#27342B] rounded-lg">
                  <span className="font-mono font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                    04.
                  </span>{' '}
                  <span className="font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                    เปิด QR รับเงิน & ปิดงาน
                  </span>
                  <div className="text-[11px] text-[#5D6B5F] dark:text-[#98A89B] mt-0.5 truncate">
                    ส่งถึงมือแล้วกดยืนยันส่งมอบเรียบร้อย
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
