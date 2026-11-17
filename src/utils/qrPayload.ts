import { ErrandOrder } from '../types/market';

function crc16Ccitt(input: string): string {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function tlv(tag: string, value: string): string {
  const len = String(value.length).padStart(2, '0');
  return `${tag}${len}${value}`;
}

/**
 * Generates a standard Thai PromptPay EMVCo QR payload from a mobile number and THB amount.
 */
export function buildPromptPayPayload(phone: string, amount: number): string {
  const digits = phone.replace(/\D/g, '');
  const formattedMobile = digits.startsWith('0')
    ? `0066${digits.slice(1)}`
    : digits.startsWith('66')
      ? `00${digits}`
      : `0066${digits}`;

  const merchantAccount =
    tlv('00', 'A000000677010111') + tlv('01', formattedMobile);

  const formattedAmount = amount.toFixed(2);

  const payloadWithoutCrc =
    tlv('00', '01') +
    tlv('01', amount > 0 ? '12' : '11') +
    tlv('29', merchantAccount) +
    tlv('53', '764') +
    (amount > 0 ? tlv('54', formattedAmount) : '') +
    tlv('58', 'TH') +
    '6304';

  const checksum = crc16Ccitt(payloadWithoutCrc);
  return `${payloadWithoutCrc}${checksum}`;
}

/**
 * Generates a compact, readable QR payload containing Rimchol order dispatch details for the runner.
 */
export function buildOrderPicklistPayload(order: ErrandOrder): string {
  const itemLines = [
    ...order.items.map(
      (i) => `- ${i.name} x${i.quantity} (${i.stall})${i.note ? ` [${i.note}]` : ''}`
    ),
    ...order.customItems.map(
      (c) => `- [นอกรายการ] ${c.name} x${c.quantity} (${c.stallHint})${c.note ? ` [${c.note}]` : ''}`
    ),
  ];

  return [
    `RIMCHOL ORDER ${order.id}`,
    `ผู้รับ: ${order.customerName} (${order.phone})`,
    `จุดส่ง: ${order.deliveryPoint}`,
    `รอบส่ง: ${order.deliverySlot}`,
    `คนรับฝาก: ${order.runnerName}`,
    `รายการ:`,
    ...itemLines,
    `รวมทั้งสิ้น: ${order.total} บาท (ค่าหิ้ว ${order.runnerFee} บาท)`,
  ].join('\n');
}

export function buildRunnerShareMessage(order: ErrandOrder): string {
  const lines = [
    `ฝากซื้อตลาดริมชล · ออเดอร์ ${order.id}`,
    `ถึงคนรับฝาก: ${order.runnerName}`,
    `ผู้ฝาก: ${order.customerName} (${order.phone})`,
    `จุดส่ง: ${order.deliveryPoint}`,
    `รอบส่ง: ${order.deliverySlot}`,
    '',
    'รายการสินค้า:',
    ...order.items.map(
      (i, idx) =>
        `${idx + 1}. ${i.name} x${i.quantity} — ฿${i.price * i.quantity} (${i.stall})${
          i.note ? ` | โน้ต: ${i.note}` : ''
        }`
    ),
    ...order.customItems.map(
      (c, idx) =>
        `${order.items.length + idx + 1}. [นอกรายการ] ${c.name} x${c.quantity} — งบ ~฿${
          c.estimatedPrice * c.quantity
        } (${c.stallHint})${c.note ? ` | โน้ต: ${c.note}` : ''}`
    ),
    '',
    `ค่าของ: ฿${order.subtotal} | ค่าหิ้ว: ฿${order.runnerFee} | ยอดรวม: ฿${order.total}`,
    `ชำระเงิน: ${order.paymentMethod === 'cod' ? 'เก็บเงินปลายทาง (COD)' : 'PromptPay'}`,
  ];

  return lines.join('\n');
}
