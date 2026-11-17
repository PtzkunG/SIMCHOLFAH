import { CheckCircle2, Clock, PackageCheck, Phone, QrCode, ShoppingBag, Truck } from 'lucide-react';
import { ErrandOrder, OrderStatus } from '../types/market';

interface OrderTrackingSectionProps {
  orders: ErrandOrder[];
  onAdvanceStatus: (orderId: string) => void;
  onOpenQrModal: (order: ErrandOrder) => void;
}

const STEPS: { key: OrderStatus; label: string; icon: typeof Clock }[] = [
  { key: 'received', label: 'รับออเดอร์แล้ว', icon: Clock },
  { key: 'shopping', label: 'กำลังเดินซื้อที่ริมชล', icon: ShoppingBag },
  { key: 'delivering', label: 'กำลังนำส่งถึงคุณ', icon: Truck },
  { key: 'completed', label: 'ส่งถึงมือเรียบร้อย', icon: PackageCheck },
];

export function OrderTrackingSection({
  orders,
  onAdvanceStatus,
  onOpenQrModal,
}: OrderTrackingSectionProps) {
  const latestOrder = orders[0];

  return (
    <section
      id="order-tracking"
      className="py-12 lg:py-16 bg-[#F6F8F5] dark:bg-[#0C110E] transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#E2E7DF] dark:border-[#212B24]">
          <div>
            <p className="text-xs font-medium text-[#14532D] dark:text-[#6EE7B7] mb-1.5">
              ติดตามรายการฝากซื้อ
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141A15] dark:text-[#F1F5F2]">
              สถานะคนเดินตลาดและการจัดส่ง
            </h2>
          </div>
          {orders.length > 1 && (
            <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B] tabular-nums">
              รายการทั้งหมดในเครื่องนี้: {orders.length} ออเดอร์
            </div>
          )}
        </div>

        {!latestOrder ? (
          <div className="mt-8 bg-white dark:bg-[#131A15] border border-[#E2E7DF] dark:border-[#232E26] rounded-2xl p-8 text-center">
            <p className="text-sm font-medium text-[#141A15] dark:text-[#F1F5F2]">
              ยังไม่มีรายการฝากซื้อในขณะนี้
            </p>
            <p className="text-xs text-[#5D6B5F] dark:text-[#98A89B] mt-1">
              เลือกรายการจากระบบแนะนำหรือแผงค้าตลาดริมชล แล้วกดยืนยันฝากซื้อเพื่อติดตามสถานะที่นี่
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order, idx) => {
              const currentStepIndex = STEPS.findIndex((s) => s.key === order.status);
              const isCompleted = order.status === 'completed';

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-[#131A15] border border-[#E2E7DF] dark:border-[#232E26] rounded-2xl p-6 sm:p-8 shadow-xs"
                >
                  {/* Top Order Summary */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EEF1EC] dark:border-[#212B24]">
                    <div>
                      <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">
                        รหัสออเดอร์{' '}
                        <span className="font-mono font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                          {order.id}
                        </span>{' '}
                        · {order.createdAt} {idx === 0 ? '· รายการล่าสุด' : ''}
                      </div>
                      <h3 className="text-lg font-bold text-[#141A15] dark:text-[#F1F5F2] mt-1">
                        {order.customerName} — {order.deliverySlot}
                      </h3>
                      <p className="text-xs text-[#4A554C] dark:text-[#A4B2A7] mt-1">
                        จุดส่ง: {order.deliveryPoint} · ชำระเงิน:{' '}
                        {order.paymentMethod === 'cod' ? 'เก็บเงินปลายทาง (COD)' : 'PromptPay QR'}
                      </p>
                      {order.qrDispatch && (
                        <p className="text-xs font-medium text-[#14532D] dark:text-[#6EE7B7] mt-1.5">
                          ส่ง QR {order.qrDispatch.mode === 'promptpay' ? 'พร้อมเพย์' : 'รายการฝากซื้อ'} ให้คนรับฝากแล้ว · {order.qrDispatch.sentAt}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <div className="text-xl font-bold text-[#141A15] dark:text-[#F1F5F2] tabular-nums font-mono">
                        ยอดรวม ฿{order.total}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenQrModal(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#166534] dark:bg-[#1E7E48] dark:hover:bg-[#196B3D] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>{order.qrDispatch ? 'ดู / ส่ง QR อีกครั้ง' : 'ส่ง QR หาคนรับฝาก'}</span>
                        </button>

                        {!isCompleted ? (
                          <button
                            type="button"
                            onClick={() => onAdvanceStatus(order.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7] bg-[#EAF2EC] dark:bg-[#1E3527] hover:bg-[#DCEADF] dark:hover:bg-[#264432] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <span>อัปเดตสถานะถัดไป (จำลอง)</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>จัดส่งเรียบร้อยแล้ว</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4-Step Progress Track */}
                  <div className="py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-[#EEF1EC] dark:border-[#212B24]">
                    {STEPS.map((step, sIdx) => {
                      const Icon = step.icon;
                      const reached = sIdx <= currentStepIndex;
                      const active = sIdx === currentStepIndex;

                      return (
                        <div key={step.key} className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                              reached
                                ? 'bg-[#14532D] dark:bg-[#1E7E48] border-[#14532D] dark:border-[#1E7E48] text-white'
                                : 'bg-[#F8F9F7] dark:bg-[#1A231D] border-[#D4DAD0] dark:border-[#2A372E] text-[#7A877C] dark:text-[#6E7F72]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div
                              className={`text-xs font-semibold ${
                                active
                                  ? 'text-[#14532D] dark:text-[#6EE7B7]'
                                  : reached
                                    ? 'text-[#141A15] dark:text-[#F1F5F2]'
                                    : 'text-[#7A877C] dark:text-[#6E7F72]'
                              }`}
                            >
                              {step.label}
                            </div>
                            <div className="text-[11px] text-[#5D6B5F] dark:text-[#98A89B] mt-0.5">
                              {active ? 'สถานะปัจจุบัน' : reached ? 'เสร็จสิ้น' : 'รอดำเนินการ'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Runner Note & Itemized List */}
                  <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 bg-[#F6F8F5] dark:bg-[#18211B] border border-[#E2E7DF] dark:border-[#253128] rounded-xl p-4">
                      <div className="text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3]">
                        ผู้เดินตลาดที่ดูแลออเดอร์นี้
                      </div>
                      <div className="mt-1.5 flex items-center justify-between gap-3">
                        <div className="text-sm font-bold text-[#141A15] dark:text-[#F1F5F2]">
                          {order.runnerName}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-[#14532D] dark:text-[#6EE7B7]">
                          <Phone className="w-3.5 h-3.5" />
                          {order.runnerPhone}
                        </span>
                      </div>
                      <p className="mt-2.5 text-xs text-[#4A554C] dark:text-[#A4B2A7] leading-relaxed">
                        อัปเดตล่าสุด: {order.statusNote}
                      </p>
                    </div>

                    <div className="lg:col-span-7">
                      <div className="text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-2.5">
                        สรุปรายการในออเดอร์ ({order.items.length + order.customItems.length} รายการ)
                      </div>
                      <div className="divide-y divide-[#EEF1EC] dark:divide-[#212B24] border border-[#E2E7DF] dark:border-[#253128] rounded-xl px-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="py-2.5 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0">
                              <span className="font-medium text-[#141A15] dark:text-[#F1F5F2]">
                                {item.name}
                              </span>{' '}
                              <span className="font-mono text-[#5D6B5F] dark:text-[#98A89B]">
                                ×{item.quantity}
                              </span>
                              {item.note && (
                                <div className="text-[11px] text-[#5D6B5F] dark:text-[#98A89B] mt-0.5">
                                  โน้ต: {item.note}
                                </div>
                              )}
                            </div>
                            <span className="font-mono font-semibold text-[#141A15] dark:text-[#F1F5F2] tabular-nums shrink-0">
                              ฿{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                        {order.customItems.map((custom) => (
                          <div
                            key={custom.id}
                            className="py-2.5 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0">
                              <span className="font-medium text-[#141A15] dark:text-[#F1F5F2]">
                                [นอกรายการ] {custom.name}
                              </span>{' '}
                              <span className="font-mono text-[#5D6B5F] dark:text-[#98A89B]">
                                ×{custom.quantity}
                              </span>
                              <div className="text-[11px] text-[#5D6B5F] dark:text-[#98A89B] mt-0.5">
                                {custom.stallHint} {custom.note ? `· ${custom.note}` : ''}
                              </div>
                            </div>
                            <span className="font-mono font-semibold text-[#141A15] dark:text-[#F1F5F2] tabular-nums shrink-0">
                              ~฿{custom.estimatedPrice * custom.quantity}
                            </span>
                          </div>
                        ))}
                        <div className="py-2.5 flex items-center justify-between text-xs text-[#5D6B5F] dark:text-[#98A89B]">
                          <span>ค่าหิ้วและจัดส่ง</span>
                          <span className="font-mono tabular-nums">
                            {order.runnerFee === 0 ? 'ฟรี (฿0)' : `฿${order.runnerFee}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
