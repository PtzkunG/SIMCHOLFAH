import {
  Check,
  CheckSquare,
  MapPin,
  Phone,
  QrCode,
  Square,
  Truck,
  UserCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { MARKET_ZONES } from '../data/rimcholMarket';
import { ErrandOrder, MarketZone, OrderStatus, RunnerProfile } from '../types/market';

interface RunnerDashboardProps {
  runners: RunnerProfile[];
  activeRunnerId: string;
  onSelectRunner: (runnerId: string) => void;
  onUpdateRunner: (runnerId: string, patch: Partial<RunnerProfile>) => void;
  orders: ErrandOrder[];
  onAcceptOrder: (orderId: string, runner: RunnerProfile) => void;
  onToggleOrderItem: (orderId: string, itemId: string, isCustom: boolean) => void;
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus, note: string) => void;
  onOpenQrModal: (order: ErrandOrder) => void;
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  received: 'งานใหม่ · รอผู้รับฝากกดรับ',
  shopping: 'กำลังเดินซื้อที่ตลาดริมชล',
  delivering: 'กำลังนำส่งถึงผู้ฝาก',
  completed: 'ส่งมอบเสร็จสิ้น',
};

export function RunnerDashboard({
  runners,
  activeRunnerId,
  onSelectRunner,
  onUpdateRunner,
  orders,
  onAcceptOrder,
  onToggleOrderItem,
  onUpdateOrderStatus,
  onOpenQrModal,
}: RunnerDashboardProps) {
  const [filterTab, setFilterTab] = useState<'active' | 'received' | 'completed'>('active');
  const [runnerNoteDrafts, setRunnerNoteDrafts] = useState<Record<string, string>>({});

  const activeRunner = runners.find((r) => r.id === activeRunnerId) ?? runners[0];

  const metrics = useMemo(() => {
    const waiting = orders.filter((o) => o.status === 'received').length;
    const inProgress = orders.filter(
      (o) => o.status === 'shopping' || o.status === 'delivering'
    ).length;
    const completed = orders.filter((o) => o.status === 'completed').length;
    const totalRunnerEarnings = orders
      .filter((o) => o.status !== 'received')
      .reduce((sum, o) => sum + o.runnerFee, 0);

    return { waiting, inProgress, completed, totalRunnerEarnings };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (filterTab === 'received') {
      return orders.filter((o) => o.status === 'received');
    }
    if (filterTab === 'completed') {
      return orders.filter((o) => o.status === 'completed');
    }
    return orders.filter((o) => o.status !== 'completed');
  }, [orders, filterTab]);

  return (
    <div className="bg-[#F6F8F5] dark:bg-[#0C110E] min-h-[75vh] transition-colors">
      {/* Runner Identity & Zone Controls */}
      <section className="bg-white dark:bg-[#111713] border-b border-[#E2E7DF] dark:border-[#212B24] py-8 transition-colors">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <p className="text-xs font-medium text-[#14532D] dark:text-[#6EE7B7] mb-1">
                กระดานงานผู้รับฝากตลาดริมชล
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141A15] dark:text-[#F1F5F2]">
                จัดการรอบเดินตลาด เช็กลิสต์ของฝาก และ QR รับเงิน
              </h1>
              <p className="text-sm text-[#4A554C] dark:text-[#A4B2A7] mt-1.5">
                เลือกโปรไฟล์ผู้รับฝากที่กำลังเดินตลาด กดรับรายการจากผู้ฝาก ติ๊กของที่ซื้อครบแล้ว และอัปเดตสถานะส่งถึงมือ
              </p>
            </div>

            {/* Active Runner Selector + Availability Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#F6F8F5] dark:bg-[#151D17] border border-[#E2E7DF] dark:border-[#253128] rounded-2xl p-3.5 shrink-0">
              <div>
                <label
                  htmlFor="runner-profile-select"
                  className="block text-[11px] font-medium text-[#5D6B5F] dark:text-[#98A89B] mb-1"
                >
                  โปรไฟล์ผู้รับฝากที่ใช้งาน
                </label>
                <select
                  id="runner-profile-select"
                  value={activeRunner.id}
                  onChange={(e) => onSelectRunner(e.target.value)}
                  className="h-9 px-3 bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-xs font-semibold text-[#141A15] dark:text-[#F1F5F2] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399] cursor-pointer"
                >
                  {runners.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="runner-zone-select"
                  className="block text-[11px] font-medium text-[#5D6B5F] dark:text-[#98A89B] mb-1"
                >
                  โซนที่กำลังเดินอยู่ตอนนี้
                </label>
                <select
                  id="runner-zone-select"
                  value={activeRunner.currentZone}
                  onChange={(e) =>
                    onUpdateRunner(activeRunner.id, {
                      currentZone: e.target.value as MarketZone,
                    })
                  }
                  className="h-9 px-3 bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-xs font-medium text-[#141A15] dark:text-[#F1F5F2] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399] cursor-pointer"
                >
                  {MARKET_ZONES.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:pt-4">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateRunner(activeRunner.id, {
                      isAvailable: !activeRunner.isAvailable,
                    })
                  }
                  className={`h-9 px-3.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeRunner.isAvailable
                      ? 'bg-[#14532D] dark:bg-[#1E7E48] border-[#14532D] dark:border-[#1E7E48] text-white hover:bg-[#166534]'
                      : 'bg-white dark:bg-[#18211B] border-[#D4DAD0] dark:border-[#27342B] text-[#4A554C] dark:text-[#A4B2A7] hover:bg-[#F1F3F0] dark:hover:bg-[#1F2B23]'
                  }`}
                >
                  {activeRunner.isAvailable ? 'สถานะ: เปิดรับฝาก' : 'สถานะ: พักรับงาน'}
                </button>
              </div>
            </div>
          </div>

          {/* 4-Column KPI Summary Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="bg-[#F6F8F5] dark:bg-[#151D17] border border-[#E2E7DF] dark:border-[#253128] rounded-xl p-4">
              <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">งานใหม่รอผู้รับฝาก</div>
              <div className="text-2xl font-bold text-[#141A15] dark:text-[#F1F5F2] tabular-nums font-mono mt-1">
                {metrics.waiting}
              </div>
            </div>
            <div className="bg-[#F6F8F5] dark:bg-[#151D17] border border-[#E2E7DF] dark:border-[#253128] rounded-xl p-4">
              <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">กำลังเดินซื้อ / นำส่ง</div>
              <div className="text-2xl font-bold text-[#14532D] dark:text-[#6EE7B7] tabular-nums font-mono mt-1">
                {metrics.inProgress}
              </div>
            </div>
            <div className="bg-[#F6F8F5] dark:bg-[#151D17] border border-[#E2E7DF] dark:border-[#253128] rounded-xl p-4">
              <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">ส่งสำเร็จแล้ว</div>
              <div className="text-2xl font-bold text-[#141A15] dark:text-[#F1F5F2] tabular-nums font-mono mt-1">
                {metrics.completed}
              </div>
            </div>
            <div className="bg-[#F6F8F5] dark:bg-[#151D17] border border-[#E2E7DF] dark:border-[#253128] rounded-xl p-4">
              <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">รายได้ค่าหิ้วรอบนี้</div>
              <div className="text-2xl font-bold text-[#141A15] dark:text-[#F1F5F2] tabular-nums font-mono mt-1">
                ฿{metrics.totalRunnerEarnings}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orders Workbench */}
      <section className="py-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-[#141A15] dark:text-[#F1F5F2]">
              รายการจากผู้ฝากซื้อ ({filteredOrders.length})
            </h2>

            <div className="flex items-center gap-1 p-1 bg-[#E9EDE6] dark:bg-[#17201A] rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilterTab('active')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  filterTab === 'active'
                    ? 'bg-white dark:bg-[#233128] text-[#141A15] dark:text-white shadow-xs font-semibold'
                    : 'text-[#4A554C] dark:text-[#98A89B] hover:text-[#141A15] dark:hover:text-white'
                }`}
              >
                งานที่ต้องดำเนินการ
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('received')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  filterTab === 'received'
                    ? 'bg-white dark:bg-[#233128] text-[#141A15] dark:text-white shadow-xs font-semibold'
                    : 'text-[#4A554C] dark:text-[#98A89B] hover:text-[#141A15] dark:hover:text-white'
                }`}
              >
                งานใหม่รอรับ ({metrics.waiting})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('completed')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  filterTab === 'completed'
                    ? 'bg-white dark:bg-[#233128] text-[#141A15] dark:text-white shadow-xs font-semibold'
                    : 'text-[#4A554C] dark:text-[#98A89B] hover:text-[#141A15] dark:hover:text-white'
                }`}
              >
                ปิดงานแล้ว ({metrics.completed})
              </button>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-[#131A15] border border-[#E2E7DF] dark:border-[#232E26] rounded-2xl p-10 text-center">
              <p className="text-sm font-medium text-[#141A15] dark:text-[#F1F5F2]">
                ยังไม่มีรายการในหมวดนี้
              </p>
              <p className="text-xs text-[#5D6B5F] dark:text-[#98A89B] mt-1">
                สามารถสลับกลับไปที่โหมด “ผู้ฝากซื้อ” เพื่อทดลองส่งออเดอร์ใหม่เข้ามาในคิวได้ทันที
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const totalItemsCount = order.items.length + order.customItems.length;
                const checkedCount =
                  order.items.filter((i) => i.checked).length +
                  order.customItems.filter((c) => c.checked).length;
                const noteDraft = runnerNoteDrafts[order.id] ?? '';

                return (
                  <article
                    key={order.id}
                    className="bg-white dark:bg-[#131A15] border border-[#E2E7DF] dark:border-[#232E26] rounded-2xl p-6 space-y-5 shadow-xs"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5 border-b border-[#EEF1EC] dark:border-[#212B24]">
                      <div className="space-y-1.5">
                        <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">
                          รหัส{' '}
                          <span className="font-mono font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                            {order.id}
                          </span>{' '}
                          · {order.createdAt} · {STATUS_LABEL[order.status]}
                        </div>
                        <h3 className="text-lg font-bold text-[#141A15] dark:text-[#F1F5F2]">
                          ผู้ฝาก: {order.customerName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#4A554C] dark:text-[#A4B2A7]">
                          <span className="inline-flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {order.phone}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {order.deliveryPoint}
                          </span>
                          <span>รอบส่ง: {order.deliverySlot}</span>
                        </div>
                        {order.qrDispatch && (
                          <div className="text-xs font-medium text-[#14532D] dark:text-[#6EE7B7] pt-1">
                            ผู้ฝากส่ง{' '}
                            {order.qrDispatch.mode === 'promptpay'
                              ? 'QR พร้อมเพย์/สลิป'
                              : 'QR รายการฝากซื้อ'}{' '}
                            มาแล้ว ({order.qrDispatch.sentAt})
                            {order.qrDispatch.note ? ` · "${order.qrDispatch.note}"` : ''}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        <div className="text-left sm:text-right">
                          <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">
                            ค่าของ ฿{order.subtotal} · ค่าหิ้ว ฿{order.runnerFee}
                          </div>
                          <div className="text-xl font-bold text-[#141A15] dark:text-[#F1F5F2] tabular-nums font-mono">
                            รวมเก็บ ฿{order.total}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenQrModal(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#141A15] dark:text-[#F1F5F2] bg-[#F6F8F5] dark:bg-[#1B251E] border border-[#D4DAD0] dark:border-[#2A392E] hover:bg-[#EEF2EC] dark:hover:bg-[#233128] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>เปิด QR รับเงิน / รายการ</span>
                          </button>

                          {order.status === 'received' && (
                            <button
                              type="button"
                              onClick={() => onAcceptOrder(order.id, activeRunner)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#166534] dark:bg-[#1E7E48] dark:hover:bg-[#196B3D] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>รับฝากรายการนี้</span>
                            </button>
                          )}

                          {order.status === 'shopping' && (
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateOrderStatus(
                                  order.id,
                                  'delivering',
                                  noteDraft.trim() ||
                                    `${activeRunner.name} ซื้อของครบ ${checkedCount}/${totalItemsCount} รายการแล้ว กำลังนำไปส่งครับ`
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#166534] dark:bg-[#1E7E48] dark:hover:bg-[#196B3D] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>ซื้อครบแล้ว · ออกไปส่ง</span>
                            </button>
                          )}

                          {order.status === 'delivering' && (
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateOrderStatus(
                                  order.id,
                                  'completed',
                                  noteDraft.trim() ||
                                    `${activeRunner.name} ส่งมอบถึงมือผู้ฝากเรียบร้อยแล้ว`
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#166534] dark:bg-[#1E7E48] dark:hover:bg-[#196B3D] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>ยืนยันส่งถึงผู้ฝากแล้ว</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Shopping Checklist for Runner */}
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3]">
                          เช็กลิสต์เดินซื้อตามแผงค้า (กดติ๊กเมื่อซื้อแล้ว)
                        </div>
                        <div className="text-xs font-mono tabular-nums text-[#14532D] dark:text-[#6EE7B7] font-semibold">
                          ซื้อแล้ว {checkedCount}/{totalItemsCount} รายการ
                        </div>
                      </div>

                      <div className="divide-y divide-[#EEF1EC] dark:divide-[#212B24] border border-[#E2E7DF] dark:border-[#253128] rounded-xl overflow-hidden">
                        {order.items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => onToggleOrderItem(order.id, item.id, false)}
                            className="w-full text-left px-4 py-3 flex items-center justify-between gap-4 hover:bg-[#F8F9F7] dark:hover:bg-[#18211B] transition-colors cursor-pointer"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              {item.checked ? (
                                <CheckSquare className="w-4 h-4 text-[#14532D] dark:text-[#6EE7B7] shrink-0 mt-0.5" />
                              ) : (
                                <Square className="w-4 h-4 text-[#7A877C] dark:text-[#6E7F72] shrink-0 mt-0.5" />
                              )}
                              <div className="min-w-0">
                                <div
                                  className={`text-sm font-medium ${
                                    item.checked
                                      ? 'line-through text-[#7A877C] dark:text-[#6E7F72]'
                                      : 'text-[#141A15] dark:text-[#F1F5F2]'
                                  }`}
                                >
                                  {item.name}{' '}
                                  <span className="font-mono text-xs">×{item.quantity}</span>
                                </div>
                                <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B] mt-0.5">
                                  {item.stall} · {item.zone}
                                  {item.note ? ` · โน้ตผู้ฝาก: ${item.note}` : ''}
                                </div>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-semibold text-[#141A15] dark:text-[#F1F5F2] tabular-nums shrink-0">
                              ฿{item.price * item.quantity}
                            </span>
                          </button>
                        ))}

                        {order.customItems.map((custom) => (
                          <button
                            key={custom.id}
                            type="button"
                            onClick={() => onToggleOrderItem(order.id, custom.id, true)}
                            className="w-full text-left px-4 py-3 flex items-center justify-between gap-4 hover:bg-[#F8F9F7] dark:hover:bg-[#18211B] transition-colors cursor-pointer"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              {custom.checked ? (
                                <CheckSquare className="w-4 h-4 text-[#14532D] dark:text-[#6EE7B7] shrink-0 mt-0.5" />
                              ) : (
                                <Square className="w-4 h-4 text-[#7A877C] dark:text-[#6E7F72] shrink-0 mt-0.5" />
                              )}
                              <div className="min-w-0">
                                <div
                                  className={`text-sm font-medium ${
                                    custom.checked
                                      ? 'line-through text-[#7A877C] dark:text-[#6E7F72]'
                                      : 'text-[#141A15] dark:text-[#F1F5F2]'
                                  }`}
                                >
                                  [นอกรายการ] {custom.name}{' '}
                                  <span className="font-mono text-xs">×{custom.quantity}</span>
                                </div>
                                <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B] mt-0.5">
                                  {custom.stallHint} · {custom.zone}
                                  {custom.note ? ` · โน้ตผู้ฝาก: ${custom.note}` : ''}
                                </div>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-semibold text-[#141A15] dark:text-[#F1F5F2] tabular-nums shrink-0">
                              ~฿{custom.estimatedPrice * custom.quantity}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Runner Update Message Input */}
                    {order.status !== 'completed' && (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                        <input
                          type="text"
                          value={noteDraft}
                          onChange={(e) =>
                            setRunnerNoteDrafts((prev) => ({
                              ...prev,
                              [order.id]: e.target.value,
                            }))
                          }
                          placeholder="พิมพ์อัปเดตส่งให้ผู้ฝาก (เช่น ป้าแดงแถมมะนาวให้ 2 ลูก กำลังเดินออกหน้าตลาด)"
                          className="flex-1 h-9 px-3 bg-[#F6F8F5] dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-xs text-[#141A15] dark:text-[#F1F5F2] placeholder:text-[#7A877C] dark:placeholder:text-[#6E7F72] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!noteDraft.trim()) return;
                            onUpdateOrderStatus(order.id, order.status, noteDraft.trim());
                            setRunnerNoteDrafts((prev) => ({ ...prev, [order.id]: '' }));
                          }}
                          className="px-3.5 h-9 text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7] bg-[#EAF2EC] dark:bg-[#1E3527] hover:bg-[#DCEADF] dark:hover:bg-[#264432] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          ส่งข้อความอัปเดตให้ผู้ฝาก
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
