import { RunnerProfile } from '../types/market';

export const INITIAL_RUNNERS: RunnerProfile[] = [
  {
    id: 'runner-ton',
    name: 'พี่ต้น (ทีมเดินตลาดริมชล)',
    phone: '081-775-3910',
    currentZone: 'โซนสตรีทฟู้ด & กับข้าว',
    activeSlot: 'รอบเดินตลาดทุก 30 นาที (07:00 – 15:00 น.)',
    isAvailable: true,
    completedTrips: 142,
    note: 'ชำนาญโซนหมูปิ้ง ก๋วยเตี๋ยวเรือ และของสดท่าเรือ',
  },
  {
    id: 'runner-ek',
    name: 'พี่เอก (มอเตอร์ไซค์ส่งไวริมชล)',
    phone: '086-349-2218',
    currentZone: 'โซนของสดริมน้ำ',
    activeSlot: 'รอบกลางวัน – เย็น (10:30 – 19:00 น.)',
    isAvailable: true,
    completedTrips: 98,
    note: 'มีกล่องเก็บความเย็นสำหรับกุ้งแม่น้ำ ปลากะพง และเครื่องดื่ม',
  },
  {
    id: 'runner-may',
    name: 'น้องเมย์ (โซนผักผลไม้ & ขนมไทย)',
    phone: '084-918-6520',
    currentZone: 'โซนขนม & เครื่องดื่ม',
    activeSlot: 'รอบเช้า – บ่าย (06:30 – 14:30 น.)',
    isAvailable: true,
    completedTrips: 76,
    note: 'คัดผักผลไม้ตามสั่งและดูแลขนมไทยไม่ให้ช้ำ',
  },
];
