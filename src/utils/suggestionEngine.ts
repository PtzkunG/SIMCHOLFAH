import {
  BundleSuggestion,
  CartItem,
  CustomErrandItem,
  MarketItem,
  MarketZone,
  PairingSuggestion,
  SuggestionPreferences,
} from '../types/market';

export const FREE_RUNNER_THRESHOLD = 450;

export function calculateRunnerFee(
  cart: CartItem[],
  customItems: CustomErrandItem[]
): {
  subtotal: number;
  runnerFee: number;
  zones: MarketZone[];
  amountToFree: number;
} {
  const cartSubtotal = cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const customSubtotal = customItems.reduce(
    (sum, entry) => sum + entry.estimatedPrice * entry.quantity,
    0
  );
  const subtotal = cartSubtotal + customSubtotal;

  const zoneSet = new Set<MarketZone>();
  cart.forEach((entry) => zoneSet.add(entry.item.zone));
  customItems.forEach((entry) => zoneSet.add(entry.zone));
  const zones = Array.from(zoneSet);

  if (subtotal === 0) {
    return {
      subtotal: 0,
      runnerFee: 0,
      zones: [],
      amountToFree: FREE_RUNNER_THRESHOLD,
    };
  }

  if (subtotal >= FREE_RUNNER_THRESHOLD) {
    return {
      subtotal,
      runnerFee: 0,
      zones,
      amountToFree: 0,
    };
  }

  // Base fee 25 THB covers up to 2 zones; +10 THB for each additional zone
  const extraZones = Math.max(0, zones.length - 2);
  const runnerFee = 25 + extraZones * 10;

  return {
    subtotal,
    runnerFee,
    zones,
    amountToFree: Math.max(0, FREE_RUNNER_THRESHOLD - subtotal),
  };
}

export function generateContextualBundle(
  prefs: SuggestionPreferences,
  allItems: MarketItem[]
): BundleSuggestion {
  const available = allItems.filter((item) => item.inStock);

  // Score each item according to preferences
  const scored = available
    .map((item) => {
      let score = item.popularityScore * 0.4;

      if (item.mealTimes.includes(prefs.mealTime)) {
        score += 32;
      }

      if (prefs.craving === 'all') {
        score += 10;
      } else if (prefs.craving === 'seafood' && item.category === 'seafood') {
        score += 42;
      } else if (prefs.craving === 'streetfood' && item.category === 'streetfood') {
        score += 42;
      } else if (prefs.craving === 'fresh' && item.category === 'produce') {
        score += 42;
      } else if (prefs.craving === 'dessert' && item.category === 'dessert') {
        score += 42;
      }

      if (prefs.peopleCount === 4 && item.tags.includes('family')) {
        score += 18;
      }
      if (prefs.peopleCount === 1 && item.tags.includes('quick')) {
        score += 15;
      }

      if (prefs.budget === 150 && item.price <= 85) {
        score += 18;
      } else if (prefs.budget === 700 && item.price >= 120) {
        score += 12;
      }

      return { item, score };
    })
    .sort((a, b) => b.score - a.score);

  const selected: { item: MarketItem; quantity: number; role: string }[] = [];
  let runningTotal = 0;
  const usedIds = new Set<string>();

  const tryAdd = (item: MarketItem, quantity: number, role: string): boolean => {
    if (usedIds.has(item.id)) return false;
    const cost = item.price * quantity;
    if (runningTotal + cost > prefs.budget) return false;
    usedIds.add(item.id);
    selected.push({ item, quantity, role });
    runningTotal += cost;
    return true;
  };

  // 1. Pick anchor dish
  const anchor = scored[0]?.item;
  if (anchor) {
    const anchorQty = prefs.peopleCount === 4 && anchor.price <= 90 ? 2 : 1;
    if (!tryAdd(anchor, anchorQty, 'เมนูหลักแนะนำ')) {
      tryAdd(anchor, 1, 'เมนูหลักแนะนำ');
    }

    // 2. Prioritize paired items from the anchor to keep meal cohesive and zones compact
    for (const pairing of anchor.pairings) {
      const pairedItem = available.find((i) => i.id === pairing.targetId);
      if (pairedItem) {
        const qty = pairedItem.price <= 25 && prefs.peopleCount >= 2 ? 2 : 1;
        tryAdd(pairedItem, qty, 'จับคู่เข้ากัน');
      }
    }
  }

  // 3. Fill remaining budget with high-scoring items, favoring same zone first
  const activeZones = new Set(selected.map((s) => s.item.zone));
  const fillCandidates = [...scored].sort((a, b) => {
    const aSameZone = activeZones.has(a.item.zone) ? 14 : 0;
    const bSameZone = activeZones.has(b.item.zone) ? 14 : 0;
    return b.score + bSameZone - (a.score + aSameZone);
  });

  const targetItemCount = prefs.peopleCount === 1 ? 3 : prefs.peopleCount === 2 ? 4 : 5;
  for (const candidate of fillCandidates) {
    if (selected.length >= targetItemCount) break;
    if (usedIds.has(candidate.item.id)) continue;

    // Avoid adding two heavy drinks in one bundle
    const drinkCount = selected.filter((s) => s.item.tags.includes('drink')).length;
    if (candidate.item.tags.includes('drink') && drinkCount >= 1) continue;

    const role = candidate.item.tags.includes('drink')
      ? 'เครื่องดื่มแก้เลี่ยน'
      : candidate.item.category === 'dessert'
        ? 'ของหวานตบท้าย'
        : activeZones.has(candidate.item.zone)
          ? 'โซนเดียวกัน (ไม่เพิ่มค่าหิ้ว)'
          : 'เสริมมื้อให้อิ่มครบ';

    tryAdd(candidate.item, 1, role);
  }

  const zonesUsed = Array.from(new Set(selected.map((s) => s.item.zone)));
  const extraZones = Math.max(0, zonesUsed.length - 2);
  const estimatedRunnerFee =
    runningTotal === 0 ? 0 : runningTotal >= FREE_RUNNER_THRESHOLD ? 0 : 25 + extraZones * 10;

  const mealLabel: Record<SuggestionPreferences['mealTime'], string> = {
    morning: 'มื้อเช้าตลาดริมชล',
    lunch: 'มื้อกลางวันพร้อมเสิร์ฟ',
    dinner: 'มื้อเย็นทำกินหรือตั้งวง',
    snack: 'ของว่างและเครื่องดื่มช่วงบ่าย',
  };

  const cravingLabel: Record<SuggestionPreferences['craving'], string> = {
    all: 'ครบทุกรสชาติ',
    seafood: 'เน้นซีฟู้ดสดจากท่า',
    streetfood: 'เน้นสตรีทฟู้ดและกับข้าว',
    fresh: 'เน้นผักสดและผลไม้',
    dessert: 'เน้นขนมไทยและเครื่องดื่ม',
  };

  const savingsNote =
    estimatedRunnerFee === 0
      ? 'ยอดถึงเกณฑ์ฟรีค่าหิ้ว 0 บาท'
      : zonesUsed.length <= 2
        ? `เดินซื้อรวม ${zonesUsed.length} โซนใกล้กัน ค่าหิ้วประหยัดสุด 25 บาท`
        : `เดิน ${zonesUsed.length} โซนตลาด รวมค่าหิ้ว ${estimatedRunnerFee} บาท`;

  return {
    title: `ชุดแนะนำสำหรับ${mealLabel[prefs.mealTime]}`,
    subtitle: `${cravingLabel[prefs.craving]} · สำหรับ ${prefs.peopleCount === 4 ? '4+ คน' : `${prefs.peopleCount} คน`} · คุมงบไม่เกิน ${prefs.budget} บาท`,
    items: selected,
    totalPrice: runningTotal,
    zonesUsed,
    estimatedRunnerFee,
    savingsNote,
  };
}

export function getCartPairingSuggestions(
  cart: CartItem[],
  allItems: MarketItem[]
): PairingSuggestion[] {
  const inCartIds = new Set(cart.map((c) => c.item.id));
  const available = allItems.filter((i) => i.inStock && !inCartIds.has(i.id));
  const cartZones = new Set(cart.map((c) => c.item.zone));

  const map = new Map<string, PairingSuggestion>();

  // 1. Direct pairing edges from items currently in cart
  for (const cartEntry of cart) {
    for (const pairing of cartEntry.item.pairings) {
      if (inCartIds.has(pairing.targetId)) continue;
      const target = available.find((i) => i.id === pairing.targetId);
      if (!target) continue;

      const existing = map.get(target.id);
      if (existing) {
        if (!existing.pairedWithNames.includes(cartEntry.item.name)) {
          existing.pairedWithNames.push(cartEntry.item.name);
        }
      } else {
        map.set(target.id, {
          item: target,
          reason: pairing.reason,
          sameZoneFree: cartZones.has(target.zone),
          pairedWithNames: [cartEntry.item.name],
        });
      }
    }
  }

  // 2. If cart has savory/seafood items but no drink or dessert yet, recommend refreshing options
  if (cart.length > 0) {
    const hasDrink = cart.some((c) => c.item.tags.includes('drink'));
    const hasDessert = cart.some((c) => c.item.category === 'dessert' && !c.item.tags.includes('drink'));

    if (!hasDrink) {
      const bestDrink = available
        .filter((i) => i.tags.includes('drink'))
        .sort((a, b) => b.popularityScore - a.popularityScore)[0];
      if (bestDrink && !map.has(bestDrink.id)) {
        map.set(bestDrink.id, {
          item: bestDrink,
          reason: 'ในตะกร้ายังไม่มีเครื่องดื่ม แนะนำเพิ่มความสดชื่นจากโซนน้ำชง',
          sameZoneFree: cartZones.has(bestDrink.zone),
          pairedWithNames: [],
        });
      }
    }

    if (!hasDessert && map.size < 4) {
      const bestDessert = available
        .filter((i) => i.category === 'dessert' && !i.tags.includes('drink'))
        .sort((a, b) => b.popularityScore - a.popularityScore)[0];
      if (bestDessert && !map.has(bestDessert.id)) {
        map.set(bestDessert.id, {
          item: bestDessert,
          reason: 'ขนมไทยยอดฮิตประจำตลาดริมชล เหมาะปิดท้ายมื้อ',
          sameZoneFree: cartZones.has(bestDessert.zone),
          pairedWithNames: [],
        });
      }
    }
  }

  // 3. Fill up to 4 items with same-zone popular picks (0 extra runner fee) or top market hits
  if (map.size < 4) {
    const filler = available
      .filter((i) => !map.has(i.id))
      .sort((a, b) => {
        const aZoneBonus = cartZones.has(a.zone) ? 25 : 0;
        const bZoneBonus = cartZones.has(b.zone) ? 25 : 0;
        return b.popularityScore + bZoneBonus - (a.popularityScore + aZoneBonus);
      });

    for (const item of filler) {
      if (map.size >= 4) break;
      const isSameZone = cartZones.has(item.zone);
      map.set(item.id, {
        item,
        reason: isSameZone
          ? `อยู่${item.zone}เดียวกับรายการในตะกร้า ฝากเพิ่มไม่มีค่าเดินเพิ่ม`
          : `สินค้าขายดียอดนิยมจาก${item.stall}`,
        sameZoneFree: isSameZone,
        pairedWithNames: [],
      });
    }
  }

  return Array.from(map.values()).slice(0, 4);
}

export function getSearchSuggestions(
  query: string,
  allItems: MarketItem[]
): {
  matches: MarketItem[];
  substitutes: { outOfStockItem: MarketItem; substituteItem: MarketItem; reason: string }[];
} {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return { matches: [], substitutes: [] };
  }

  const matched = allItems.filter(
    (item) =>
      item.name.toLowerCase().includes(normalized) ||
      item.stall.toLowerCase().includes(normalized) ||
      item.description.toLowerCase().includes(normalized) ||
      item.tags.some((t) => t.toLowerCase().includes(normalized))
  );

  const inStockMatches = matched.filter((m) => m.inStock);
  const outOfStockMatches = matched.filter((m) => !m.inStock && m.substituteId);

  const substitutes = outOfStockMatches
    .map((outItem) => {
      const sub = allItems.find((i) => i.id === outItem.substituteId && i.inStock);
      if (!sub) return null;
      return {
        outOfStockItem: outItem,
        substituteItem: sub,
        reason: outItem.substituteReason || `แนะนำ ${sub.name} ทดแทน`,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return {
    matches: inStockMatches.slice(0, 5),
    substitutes,
  };
}
