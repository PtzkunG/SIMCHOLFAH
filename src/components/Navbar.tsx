import { ShoppingBasket } from 'lucide-react';

interface NavbarProps {
  totalCount: number;
  onOpenCart: () => void;
  onNavigateSection?: () => void;
}

export function Navbar({ totalCount, onOpenCart, onNavigateSection }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#F6F8F5]/90 dark:bg-[#0C110E]/90 backdrop-blur-md border-b border-[#E2E7DF] dark:border-[#212B24] transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          onClick={() => onNavigateSection?.()}
          className="text-lg font-bold tracking-tight text-[#141A15] dark:text-[#F1F5F2] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399] rounded-sm"
        >
          ฝากซื้อตลาดริมชล
        </a>

        {/* Zone 2: 4 Concise Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A554C] dark:text-[#A4B2A7]">
          <a
            href="#suggestions"
            onClick={() => onNavigateSection?.()}
            className="hover:text-[#141A15] dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            ระบบแนะนำ
          </a>
          <a
            href="#catalog"
            onClick={() => onNavigateSection?.()}
            className="hover:text-[#141A15] dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            แผงค้าตลาด
          </a>
          <a
            href="#custom-errand"
            onClick={() => onNavigateSection?.()}
            className="hover:text-[#141A15] dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            ฝากนอกรายการ
          </a>
          <a
            href="#order-tracking"
            onClick={() => onNavigateSection?.()}
            className="hover:text-[#141A15] dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            ติดตามสถานะ
          </a>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#14532D] hover:bg-[#166534] dark:bg-[#1E7E48] dark:hover:bg-[#196B3D] active:scale-[0.99] rounded-lg shadow-xs transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399] cursor-pointer"
          >
            <ShoppingBasket className="w-4 h-4 shrink-0" />
            <span>ตะกร้าฝากซื้อ</span>
            <span className="tabular-nums font-mono text-xs bg-white/20 px-1.5 py-0.5 rounded">
              {totalCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
