import { useEffect, useMemo, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { CustomErrandSection } from './components/CustomErrandSection';
import { HeroSection } from './components/HeroSection';
import { MarketCatalog } from './components/MarketCatalog';
import { Navbar } from './components/Navbar';
import { OrderTrackingSection } from './components/OrderTrackingSection';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { RunnerDashboard } from './components/RunnerDashboard';
import { RunnerQrModal } from './components/RunnerQrModal';
import { SuggestionWorkbench } from './components/SuggestionWorkbench';
import { UsageGuideModal } from './components/UsageGuideModal';
import { INITIAL_SAMPLE_ORDER, RIMCHOL_ITEMS } from './data/rimcholMarket';
import { INITIAL_RUNNERS } from './data/runners';
import {
  CartItem,
  CustomErrandItem,
  ErrandOrder,
  MarketItem,
  OrderStatus,
  RunnerProfile,
  UserRole,
} from './types/market';
import { calculateRunnerFee } from './utils/suggestionEngine';

const STORAGE_KEYS = {
  CART: 'rimchol_errand_cart_v1',
  CUSTOM: 'rimchol_errand_custom_v1',
  ORDERS: 'rimchol_errand_orders_v1',
  RUNNERS: 'rimchol_errand_runners_v1',
  THEME: 'rimchol_theme_v1',
};

const NEXT_STATUS_MAP: Record<OrderStatus, { next: OrderStatus; note: string }> = {
  received: {
    next: 'shopping',
    note: 'ทีมเดินตลาดถึงตลาดริมชลแล้ว กำลังแวะรับของตามโซนร้านที่สั่งครับ',
  },
  shopping: {
    next: 'delivering',
    note: 'ซื้อครบทุกรายการแล้ว กำลังเดินทางนำส่งถึงจุดนัดรับของคุณ',
  },
  delivering: {
    next: 'completed',
    note: 'ส่งมอบสินค้าถึงมือเรียบร้อย ขอบคุณที่ใช้บริการฝากซื้อตลาดริมชลครับ',
  },
  completed: {
    next: 'completed',
    note: 'ส่งมอบสินค้าถึงมือเรียบร้อยแล้ว',
  },
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customItems, setCustomItems] = useState<CustomErrandItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<ErrandOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [INITIAL_SAMPLE_ORDER];
    } catch {
      return [INITIAL_SAMPLE_ORDER];
    }
  });

  const [role, setRole] = useState<UserRole>('requester');
  const [runners, setRunners] = useState<RunnerProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RUNNERS);
      return saved ? JSON.parse(saved) : INITIAL_RUNNERS;
    } catch {
      return INITIAL_RUNNERS;
    }
  });
  const [activeRunnerId, setActiveRunnerId] = useState<string>(INITIAL_RUNNERS[0].id);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
      return 'dark';
    }
    return 'light';
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUsageGuideOpen, setIsUsageGuideOpen] = useState(false);
  const [selectedQrOrderId, setSelectedQrOrderId] = useState<string | null>(null);
  const [prefillCustomName, setPrefillCustomName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // Ignore storage quota errors
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RUNNERS, JSON.stringify(runners));
    } catch {
      // Ignore storage quota errors
    }
  }, [runners]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM, JSON.stringify(customItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [customItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [orders]);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2400);
  };

  const handleAddItem = (item: MarketItem, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.item.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.item.id === item.id
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      return [...prev, { item, quantity, note: '' }];
    });
    showToast(`เพิ่ม “${item.name}” ลงตะกร้าฝากซื้อแล้ว`);
  };

  const handleAddBundle = (entries: { item: MarketItem; quantity: number }[]) => {
    setCart((prev) => {
      const next = [...prev];
      for (const entry of entries) {
        const idx = next.findIndex((c) => c.item.id === entry.item.id);
        if (idx >= 0) {
          next[idx] = {
            ...next[idx],
            quantity: next[idx].quantity + entry.quantity,
          };
        } else {
          next.push({ item: entry.item, quantity: entry.quantity, note: '' });
        }
      }
      return next;
    });
    showToast(`เพิ่มชุดแนะนำ ${entries.length} รายการลงตะกร้าแล้ว`);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.item.id === itemId
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const handleUpdateNote = (itemId: string, note: string) => {
    setCart((prev) =>
      prev.map((entry) => (entry.item.id === itemId ? { ...entry, note } : entry))
    );
  };

  const handleAddCustomErrand = (newCustom: Omit<CustomErrandItem, 'id'>) => {
    const id = `custom-${Date.now()}`;
    setCustomItems((prev) => [...prev, { ...newCustom, id }]);
    showToast(`เพิ่มรายการนอกลิสต์ “${newCustom.name}” ลงตะกร้าแล้ว`);
  };

  const handleRemoveCustomItem = (customId: string) => {
    setCustomItems((prev) => prev.filter((item) => item.id !== customId));
  };

  const handleSubmitOrder = (customerInfo: {
    customerName: string;
    phone: string;
    deliveryPoint: string;
    deliverySlot: string;
    paymentMethod: 'cod' | 'promptpay';
    preferredRunnerId: string;
  }) => {
    const feeSummary = calculateRunnerFee(cart, customItems);
    const total = feeSummary.subtotal + feeSummary.runnerFee;
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const chosenRunner =
      runners.find((r) => r.id === customerInfo.preferredRunnerId) ?? runners[0];

    const newOrder: ErrandOrder = {
      id: `RC-${String(now.getHours()).padStart(2, '0')}${String(
        now.getMinutes()
      ).padStart(2, '0')}-${Math.floor(100 + Math.random() * 899)}`,
      createdAt: `วันนี้ · ${timeFormatted} น.`,
      customerName: customerInfo.customerName,
      phone: customerInfo.phone,
      deliveryPoint: customerInfo.deliveryPoint,
      deliverySlot: customerInfo.deliverySlot,
      paymentMethod: customerInfo.paymentMethod,
      items: cart.map((entry) => ({
        id: entry.item.id,
        name: entry.item.name,
        stall: entry.item.stall,
        zone: entry.item.zone,
        price: entry.item.price,
        quantity: entry.quantity,
        note: entry.note || undefined,
        checked: false,
      })),
      customItems: customItems.map((c) => ({ ...c, checked: false })),
      subtotal: feeSummary.subtotal,
      runnerFee: feeSummary.runnerFee,
      total,
      status: 'received',
      runnerId: chosenRunner.id,
      runnerName: chosenRunner.name,
      runnerPhone: chosenRunner.phone,
      statusNote: `ส่งรายการถึง ${chosenRunner.name} เรียบร้อยแล้ว รอผู้รับฝากกดรับงานและเดินซื้อ`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setCustomItems([]);
    setIsCartOpen(false);
    setSelectedQrOrderId(newOrder.id);
    showToast(`ยืนยันออเดอร์ ${newOrder.id} แล้ว — พร้อมส่ง QR ให้คนรับฝาก`);

    const trackingEl = document.getElementById('order-tracking');
    if (trackingEl) {
      trackingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdateRunner = (runnerId: string, patch: Partial<RunnerProfile>) => {
    setRunners((prev) =>
      prev.map((r) => (r.id === runnerId ? { ...r, ...patch } : r))
    );
  };

  const handleAcceptOrder = (orderId: string, runner: RunnerProfile) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status: 'shopping',
          runnerId: runner.id,
          runnerName: runner.name,
          runnerPhone: runner.phone,
          statusNote: `${runner.name} กดรับงานแล้ว กำลังเดินเข้า${runner.currentZone}`,
        };
      })
    );
    showToast(`รับฝากรายการ ${orderId} แล้ว`);
  };

  const handleToggleOrderItem = (orderId: string, itemId: string, isCustom: boolean) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        if (isCustom) {
          return {
            ...order,
            customItems: order.customItems.map((c) =>
              c.id === itemId ? { ...c, checked: !c.checked } : c
            ),
          };
        }
        return {
          ...order,
          items: order.items.map((i) =>
            i.id === itemId ? { ...i, checked: !i.checked } : i
          ),
        };
      })
    );
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    nextStatus: OrderStatus,
    note: string
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: nextStatus, statusNote: note }
          : order
      )
    );
    showToast(`อัปเดตสถานะออเดอร์ ${orderId} เรียบร้อยแล้ว`);
  };

  const handleDispatchQr = (
    orderId: string,
    mode: 'picklist' | 'promptpay',
    note: string,
    slipAttachedName?: string
  ) => {
    const sentAt = new Date().toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const modeText = mode === 'promptpay' ? 'QR พร้อมเพย์/ยอดโอน' : 'QR รายการฝากซื้อ';
        return {
          ...order,
          qrDispatch: {
            sentAt: `${sentAt} น.`,
            mode,
            note: note || undefined,
            slipAttachedName,
          },
          statusNote: `ลูกค้าส่ง ${modeText} ให้ ${order.runnerName} แล้ว (${sentAt} น.)${
            note ? ` · ข้อความ: "${note}"` : ''
          }`,
        };
      })
    );

    showToast(`ส่ง QR Code หาคนรับฝากเรียบร้อยแล้ว`);
  };

  const handleAdvanceStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const transition = NEXT_STATUS_MAP[order.status];
        return {
          ...order,
          status: transition.next,
          statusNote: transition.note,
        };
      })
    );
  };

  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    cart.forEach((entry) => {
      map[entry.item.id] = entry.quantity;
    });
    return map;
  }, [cart]);

  const totalCount = useMemo(
    () =>
      cart.reduce((sum, entry) => sum + entry.quantity, 0) +
      customItems.reduce((sum, entry) => sum + entry.quantity, 0),
    [cart, customItems]
  );

  const activeRunner = useMemo(
    () => runners.find((r) => r.id === activeRunnerId) ?? runners[0],
    [runners, activeRunnerId]
  );

  const pendingJobsCount = useMemo(
    () => orders.filter((o) => o.status !== 'completed').length,
    [orders]
  );

  const jumpToRequesterSection = (sectionId: string) => {
    setRole('requester');
    window.setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8F5] dark:bg-[#0C110E] text-[#141A15] dark:text-[#ECF1ED] transition-colors">
      <Navbar
        totalCount={totalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateSection={() => setRole('requester')}
      />

      <RoleSwitcherBar
        role={role}
        onChangeRole={setRole}
        activeRunner={activeRunner}
        pendingJobsCount={pendingJobsCount}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onOpenUsageGuide={() => setIsUsageGuideOpen(true)}
        onJumpToSection={jumpToRequesterSection}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {role === 'requester' ? (
          <>
            <HeroSection
              allItems={RIMCHOL_ITEMS}
              onAddItem={(item) => handleAddItem(item, 1)}
              onPrefillCustomErrand={(query) => setPrefillCustomName(query)}
            />

            <SuggestionWorkbench
              allItems={RIMCHOL_ITEMS}
              cart={cart}
              onAddItem={handleAddItem}
              onAddBundle={handleAddBundle}
            />

            <MarketCatalog
              allItems={RIMCHOL_ITEMS}
              cartQuantities={cartQuantities}
              onAddItem={(item) => handleAddItem(item, 1)}
            />

            <CustomErrandSection
              prefillName={prefillCustomName}
              onAddCustomErrand={handleAddCustomErrand}
            />

            <OrderTrackingSection
              orders={orders}
              onAdvanceStatus={handleAdvanceStatus}
              onOpenQrModal={(order) => setSelectedQrOrderId(order.id)}
            />
          </>
        ) : (
          <RunnerDashboard
            runners={runners}
            activeRunnerId={activeRunnerId}
            onSelectRunner={setActiveRunnerId}
            onUpdateRunner={handleUpdateRunner}
            orders={orders}
            onAcceptOrder={handleAcceptOrder}
            onToggleOrderItem={handleToggleOrderItem}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onOpenQrModal={(order) => setSelectedQrOrderId(order.id)}
          />
        )}
      </main>

      <footer className="border-t border-[#E2E7DF] dark:border-[#212B24] bg-white dark:bg-[#111713] py-8 transition-colors">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#5D6B5F] dark:text-[#98A89B]">
          <div>
            ฝากซื้อตลาดริมชล · บริการเดินตลาดและแนะนำรายการอาหารสดในชุมชน
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setIsUsageGuideOpen(true)}
              className="hover:text-[#141A15] dark:hover:text-white cursor-pointer"
            >
              แนะนำการใช้งาน
            </button>
            <a
              href="#suggestions"
              onClick={() => setRole('requester')}
              className="hover:text-[#141A15] dark:hover:text-white"
            >
              ระบบแนะนำ
            </a>
            <a
              href="#catalog"
              onClick={() => setRole('requester')}
              className="hover:text-[#141A15] dark:hover:text-white"
            >
              แผงค้าตลาด
            </a>
            <a
              href="#custom-errand"
              onClick={() => setRole('requester')}
              className="hover:text-[#141A15] dark:hover:text-white"
            >
              ฝากนอกรายการ
            </a>
            <a
              href="#order-tracking"
              onClick={() => setRole('requester')}
              className="hover:text-[#141A15] dark:hover:text-white"
            >
              ติดตามสถานะ
            </a>
          </div>
        </div>
      </footer>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        customItems={customItems}
        allItems={RIMCHOL_ITEMS}
        runners={runners}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateNote={handleUpdateNote}
        onRemoveCustomItem={handleRemoveCustomItem}
        onAddItem={(item) => handleAddItem(item, 1)}
        onSubmitOrder={handleSubmitOrder}
      />

      <RunnerQrModal
        order={orders.find((o) => o.id === selectedQrOrderId) ?? null}
        onClose={() => setSelectedQrOrderId(null)}
        onDispatchQr={handleDispatchQr}
      />

      <UsageGuideModal
        isOpen={isUsageGuideOpen}
        initialTab={role}
        onClose={() => setIsUsageGuideOpen(false)}
        onJumpToRequesterSection={jumpToRequesterSection}
        onOpenCart={() => setIsCartOpen(true)}
        onSwitchToRunner={() => setRole('runner')}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 max-w-sm px-4 py-3 bg-[#141A15] dark:bg-[#1E2A22] border border-transparent dark:border-[#2E4234] text-white text-xs font-medium rounded-xl shadow-xl flex items-center justify-between gap-4"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="text-[#86EFAC] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            ดูตะกร้า
          </button>
        </div>
      )}
    </div>
  );
}
