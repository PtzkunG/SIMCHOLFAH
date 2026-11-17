import { Check, Copy, Download, Eye, Paperclip, QrCode, Send, X } from 'lucide-react';
import QRCode from 'qrcode';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ErrandOrder } from '../types/market';
import {
  buildOrderPicklistPayload,
  buildPromptPayPayload,
  buildRunnerShareMessage,
} from '../utils/qrPayload';

interface RunnerQrModalProps {
  order: ErrandOrder | null;
  onClose: () => void;
  onDispatchQr: (
    orderId: string,
    mode: 'picklist' | 'promptpay',
    note: string,
    slipAttachedName?: string
  ) => void;
}

export function RunnerQrModal({
  order,
  onClose,
  onDispatchQr,
}: RunnerQrModalProps) {
  const [mode, setMode] = useState<'picklist' | 'promptpay'>('picklist');
  const [runnerNote, setRunnerNote] = useState('');
  const [slipFileName, setSlipFileName] = useState<string | undefined>(undefined);
  const [showScanPreview, setShowScanPreview] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const payload = useMemo(() => {
    if (!order) return '';
    return mode === 'picklist'
      ? buildOrderPicklistPayload(order)
      : buildPromptPayPayload(order.runnerPhone, order.total);
  }, [order, mode]);

  useEffect(() => {
    if (!order || !canvasRef.current || !payload) return;
    QRCode.toCanvas(
      canvasRef.current,
      payload,
      {
        width: 224,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#141A15',
          light: '#FFFFFF',
        },
      },
      (err) => {
        if (err) {
          console.error('QR generation failed:', err);
        }
      }
    );
  }, [order, payload]);

  useEffect(() => {
    if (order) {
      setRunnerNote(order.qrDispatch?.note || '');
      setSlipFileName(order.qrDispatch?.slipAttachedName);
      setJustSent(false);
      setShowScanPreview(false);
    }
  }, [order]);

  if (!order) return null;

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const qrCanvas = canvasRef.current;

    const card = document.createElement('canvas');
    card.width = 360;
    card.height = 440;
    const ctx = card.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, card.width, card.height);

    ctx.strokeStyle = '#D4DAD0';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, card.width - 2, card.height - 2);

    ctx.fillStyle = '#14532D';
    ctx.fillRect(0, 0, card.width, 54);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      mode === 'picklist'
        ? 'ฝากซื้อตลาดริมชล · QR รายการฝาก'
        : 'ฝากซื้อตลาดริมชล · PromptPay QR',
      card.width / 2,
      33
    );

    ctx.drawImage(qrCanvas, (card.width - 240) / 2, 76, 240, 240);

    ctx.fillStyle = '#141A15';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`ออเดอร์ ${order.id}`, card.width / 2, 348);

    ctx.fillStyle = '#4A554C';
    ctx.font = '14px sans-serif';
    ctx.fillText(`ผู้รับฝาก: ${order.runnerName}`, card.width / 2, 376);

    ctx.fillStyle = '#14532D';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`ยอดรวม ฿${order.total}`, card.width / 2, 408);

    const link = document.createElement('a');
    link.download = `rimchol-${mode}-${order.id}.png`;
    link.href = card.toDataURL('image/png');
    link.click();
  };

  const handleCopyMessage = async () => {
    const text = buildRunnerShareMessage(order);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      window.setTimeout(() => setCopiedText(false), 1800);
    } catch {
      // Clipboard fallback ignored silently
    }
  };

  const handleSlipSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipFileName(file.name);
    }
  };

  const handleSendToRunner = () => {
    onDispatchQr(order.id, mode, runnerNote.trim(), slipFileName);
    setJustSent(true);
  };

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
        aria-label={`ส่ง QR Code หาคนรับฝาก ออเดอร์ ${order.id}`}
        className="relative z-10 w-full max-w-xl max-h-[92vh] bg-white dark:bg-[#131A15] border border-[#E2E7DF] dark:border-[#253128] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-colors"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E7DF] dark:border-[#212B24] flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#5D6B5F] dark:text-[#98A89B]">
              ออเดอร์{' '}
              <span className="font-mono font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                {order.id}
              </span>{' '}
              · {order.runnerName} ({order.runnerPhone})
            </div>
            <h2 className="text-lg font-bold text-[#141A15] dark:text-[#F1F5F2] mt-0.5">
              ส่ง QR Code หาคนรับฝาก
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง QR Code"
            className="p-2 text-[#4A554C] dark:text-[#A4B2A7] hover:text-[#141A15] dark:hover:text-white hover:bg-[#F1F3F0] dark:hover:bg-[#1B251E] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Mode Segmented Selector */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#EFF2ED] dark:bg-[#18211B] rounded-xl">
            <button
              type="button"
              onClick={() => setMode('picklist')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'picklist'
                  ? 'bg-white dark:bg-[#233128] text-[#141A15] dark:text-white shadow-xs font-semibold'
                  : 'text-[#4A554C] dark:text-[#98A89B] hover:text-[#141A15] dark:hover:text-white'
              }`}
            >
              QR รายการฝากซื้อ (Pick-list)
            </button>
            <button
              type="button"
              onClick={() => setMode('promptpay')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'promptpay'
                  ? 'bg-white dark:bg-[#233128] text-[#141A15] dark:text-white shadow-xs font-semibold'
                  : 'text-[#4A554C] dark:text-[#98A89B] hover:text-[#141A15] dark:hover:text-white'
              }`}
            >
              QR ยอดโอน PromptPay
            </button>
          </div>

          {/* QR Display + Details Split */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-[#F6F8F5] dark:bg-[#18211B] border border-[#E2E7DF] dark:border-[#253128] rounded-xl p-5">
            <div className="sm:col-span-6 flex flex-col items-center">
              {/* Always keep high-contrast white QR background for reliable camera scanning */}
              <div className="p-3 bg-white border border-[#D4DAD0] rounded-xl shadow-xs">
                <canvas
                  ref={canvasRef}
                  aria-label={
                    mode === 'picklist'
                      ? `QR Code รายการฝากซื้อ ${order.id}`
                      : `PromptPay QR Code ยอด ${order.total} บาท`
                  }
                  className="block"
                />
              </div>
              <div className="mt-2.5 text-[11px] font-mono text-[#5D6B5F] dark:text-[#98A89B] tabular-nums">
                {mode === 'picklist'
                  ? `${order.items.length + order.customItems.length} รายการ · ฿${order.total}`
                  : `PromptPay ${order.runnerPhone} · ฿${order.total}`}
              </div>
            </div>

            <div className="sm:col-span-6 space-y-3">
              <div>
                <div className="text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                  {mode === 'picklist'
                    ? 'ให้คนรับฝากสแกนดูรายการครบทุกแผง'
                    : 'QR พร้อมเพย์สำหรับชำระค่าฝากซื้อ'}
                </div>
                <p className="text-xs text-[#4A554C] dark:text-[#A4B2A7] mt-1 leading-relaxed">
                  {mode === 'picklist'
                    ? 'คนรับฝากสามารถสแกนเพื่อเช็กรายการอาหาร หมายเหตุแต่ละร้าน และจุดส่งได้ทันที'
                    : `สร้างจากรหัสพร้อมเพย์มาตรฐานของ ${order.runnerName} ยอด ฿${order.total} หรือแนบสลิปส่งยืนยันด้านล่าง`}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#141A15] dark:text-[#F1F5F2] bg-white dark:bg-[#1E2A22] border border-[#D4DAD0] dark:border-[#2C3B31] hover:bg-[#EEF2EC] dark:hover:bg-[#25352A] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลด QR (.png)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#141A15] dark:text-[#F1F5F2] bg-white dark:bg-[#1E2A22] border border-[#D4DAD0] dark:border-[#2C3B31] hover:bg-[#EEF2EC] dark:hover:bg-[#25352A] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#14532D] dark:text-[#6EE7B7]" />
                      <span>คัดลอกข้อความแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>คัดลอกส่งแชท</span>
                    </>
                  )}
                </button>
              </div>

              {mode === 'picklist' && (
                <button
                  type="button"
                  onClick={() => setShowScanPreview((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#14532D] dark:text-[#6EE7B7] hover:underline cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>
                    {showScanPreview
                      ? 'ซ่อนตัวอย่างข้อมูลใน QR'
                      : 'ดูตัวอย่างข้อมูลเมื่อคนรับฝากสแกน'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Runner Scan Preview */}
          {mode === 'picklist' && showScanPreview && (
            <div className="bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg p-4 space-y-2">
              <div className="text-xs font-semibold text-[#141A15] dark:text-[#F1F5F2]">
                ข้อมูลที่ฝั่งคนรับฝากอ่านได้จาก QR Code
              </div>
              <pre className="text-[11px] font-mono text-[#333D35] dark:text-[#C5D1C7] whitespace-pre-wrap leading-relaxed bg-[#F8F9F7] dark:bg-[#151D17] p-3 rounded border border-[#EEF1EC] dark:border-[#212B24]">
                {payload}
              </pre>
            </div>
          )}

          {/* Optional Slip Attachment & Runner Message */}
          <div className="space-y-3">
            {mode === 'promptpay' && (
              <div>
                <label
                  htmlFor="slip-upload"
                  className="block text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-1.5"
                >
                  แนบสลิปโอนเงิน / รูป QR ยืนยันส่งให้คนรับฝาก (ไม่บังคับ)
                </label>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="slip-upload"
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#141A15] dark:text-[#F1F5F2] bg-[#F8F9F7] dark:bg-[#18211B] hover:bg-[#EEF2EC] dark:hover:bg-[#1E2A22] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>เลือกไฟล์สลิป</span>
                  </label>
                  <input
                    id="slip-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleSlipSelect}
                    className="sr-only"
                  />
                  <span className="text-xs text-[#5D6B5F] dark:text-[#98A89B] truncate">
                    {slipFileName ? `แนบไฟล์แล้ว: ${slipFileName}` : 'ยังไม่ได้แนบไฟล์'}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="runner-qr-note"
                className="block text-xs font-semibold text-[#333D35] dark:text-[#D1DDD3] mb-1.5"
              >
                ข้อความถึงคนรับฝาก ({order.runnerName})
              </label>
              <input
                id="runner-qr-note"
                type="text"
                value={runnerNote}
                onChange={(e) => setRunnerNote(e.target.value)}
                placeholder="เช่น ส่ง QR รายการให้แล้ว ถึงร้านป้าแดงทักบอกได้เลยค่ะ"
                className="w-full h-10 px-3.5 bg-white dark:bg-[#101612] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg text-xs text-[#141A15] dark:text-[#F1F5F2] placeholder:text-[#7A877C] dark:placeholder:text-[#6E7F72] focus:outline-none focus:border-[#14532D] dark:focus:border-[#34D399]"
              />
            </div>
          </div>

          {/* Sent Confirmation Banner */}
          {(justSent || order.qrDispatch) && (
            <div className="bg-[#EAF2EC] dark:bg-[#193022] border border-[#BFD7C4] dark:border-[#2B4E38] rounded-lg px-4 py-3 flex items-start gap-2.5">
              <QrCode className="w-4 h-4 text-[#14532D] dark:text-[#6EE7B7] shrink-0 mt-0.5" />
              <div className="text-xs text-[#14532D] dark:text-[#A7F3D0] leading-relaxed">
                <span className="font-semibold">
                  ส่ง QR Code หา {order.runnerName} เรียบร้อยแล้ว
                </span>{' '}
                {order.qrDispatch?.sentAt && `(${order.qrDispatch.sentAt})`}
                {order.qrDispatch?.slipAttachedName && (
                  <div>แนบสลิป: {order.qrDispatch.slipAttachedName}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E7DF] dark:border-[#212B24] bg-[#F6F8F5] dark:bg-[#111713] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#4A554C] dark:text-[#C5D1C7] hover:text-[#141A15] dark:hover:text-white bg-white dark:bg-[#18211B] border border-[#D4DAD0] dark:border-[#27342B] rounded-lg cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>

          <button
            type="button"
            onClick={handleSendToRunner}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#166534] dark:bg-[#1E7E48] dark:hover:bg-[#196B3D] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {order.qrDispatch ? 'ส่ง QR หาคนรับฝากอีกครั้ง' : 'ส่ง QR หาคนรับฝากทันที'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
