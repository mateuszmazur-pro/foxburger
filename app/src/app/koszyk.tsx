import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../cart/CartContext';
import { lineTotal } from '../cart/cart';
import { Card } from '../components/Card';
import { FadeCard } from '../components/FadeCard';
import { tightComma } from '../components/tightComma';
import { groszeToNextHalf, stampsForOrder, stampsLabel } from '../loyalty/stamps';
import { EmptyState } from '../components/EmptyState';
import { Icon } from '../components/Icon';
import { LocationPicker } from '../components/LocationPicker';
import { QtyStepper } from '../components/QtyStepper';
import { ScreenHeader } from '../components/ScreenHeader';
import { Txt } from '../components/Txt';
import { formatPLN } from '../format';
import { useNow } from '../hooks';
import { useOrders } from '../orders/OrdersContext';
import { effectivePickup, pickupSlots } from '../orders/pickup';
import { useLocation } from '../state/LocationContext';
import { tenant } from '../tenant';
import { colors } from '../theme';

const PAYMENTS = [
  { id: 'blik', name: 'BLIK', note: 'Kod z aplikacji banku' },
  Platform.OS === 'android' ? { id: 'gpay', name: 'Google Pay', note: '' } : { id: 'applepay', name: 'Apple Pay', note: '' },
  { id: 'card', name: 'Karta płatnicza', note: 'Visa, Mastercard' },
];

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { lines, total, count, setQty, clear } = useCart();
  const { location } = useLocation();
  const { place } = useOrders();
  const [mode, setMode] = useState<'asap' | 'time'>('asap');
  const now = useNow(30000);
  const slots = useMemo(() => pickupSlots(new Date(now), location.closesAt), [location.closesAt, now]);
  const [time, setTime] = useState<string | undefined>();
  const [payment, setPayment] = useState(PAYMENTS[0].id);
  const [picking, setPicking] = useState(false);

  if (count === 0) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Twoje zamówienie" />
        <EmptyState title="Twój koszyk jest pusty" text="Dodaj coś pysznego z menu." action="Przejdź do menu" onAction={() => router.dismissTo('/menu')} />
      </View>
    );
  }

  const stamps = stampsForOrder(total, tenant.loyalty.zlPerHalfStamp);
  const pickup = effectivePickup(mode, time, slots);
  const chosenTime = pickup.time;
  const submit = () => {
    const id = place({ lines, total, pickup: { locationId: location.id, mode: pickup.mode, time: pickup.time }, payment });
    router.replace(`/zamowienie/${id}`);
    clear();
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Twoje zamówienie" subtitle={`${tenant.name} · ${location.name}`} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 130, gap: 14 }}>
        <FadeCard>
          <Txt w="extrabold" size={16}>Produkty</Txt>
          {lines.map((l) => {
            const p = tenant.products.find((x) => x.id === l.productId);
            if (!p) return null;
            const extras = [
              ...p.addons.filter((a) => l.addonIds.includes(a.id)).map((a) => a.name),
              ...(l.asSet ? ['Zestaw'] : []),
              ...(l.note ? [`Uwagi: ${l.note}`] : []),
            ].join(' · ');
            return (
              <View key={l.key} style={styles.line}>
                <Image source={p.image} resizeMode="contain" style={styles.thumb} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Txt w="bold" size={15}>{p.name}</Txt>
                  {extras ? <Txt size={12} color={colors.muted}>{extras}</Txt> : null}
                  <Txt w="extrabold" size={14}>{formatPLN(lineTotal(l, tenant.products))}</Txt>
                </View>
                <QtyStepper qty={l.qty} tone="muted" label={p.name} onInc={() => setQty(l.key, l.qty + 1)} onDec={() => setQty(l.key, l.qty - 1)} />
              </View>
            );
          })}
          <Pressable accessibilityRole="link" onPress={() => router.dismissTo('/menu')} style={styles.more}>
            <Icon name="plus" size={16} color={colors.brand} strokeWidth={2.6} />
            <Txt w="bold" size={14} color={colors.brand}>Dodaj coś jeszcze</Txt>
          </Pressable>
        </FadeCard>

        <Card style={{ gap: 12 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Zmień lokal odbioru" onPress={() => setPicking(true)} style={styles.locRow}>
            <View style={styles.circle}><Icon name="pin" size={18} color={colors.brand} /></View>
            <View style={{ flex: 1 }}>
              <Txt w="bold" size={15}>Odbiór w lokalu</Txt>
              <Txt size={12} color={colors.muted}>{location.address}</Txt>
            </View>
            <Txt w="bold" size={13} color={colors.brand}>zmień</Txt>
          </Pressable>
          <View style={styles.grid2}>
            <Choice on={pickup.mode === 'asap'} title="Jak najszybciej" sub="ok. 20 min" onPress={() => setMode('asap')} />
            <Choice on={pickup.mode === 'time'} title="Na godzinę" sub={slots.length ? chosenTime ?? 'wybierz' : 'brak terminów'} disabled={slots.length === 0} onPress={() => setMode('time')} />
          </View>
          {pickup.mode === 'time' && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {slots.map((s) => {
                const on = s === chosenTime;
                return (
                  <Pressable key={s} accessibilityRole="radio" accessibilityState={{ selected: on }} onPress={() => setTime(s)}
                    style={[styles.slot, on && { backgroundColor: colors.dark, borderColor: colors.dark }]}>
                    <Txt w="bold" size={14} color={on ? '#FFFFFF' : colors.text}>{s}</Txt>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </Card>

        <View style={styles.club}>
          <View style={[styles.clubDot, stamps === 0 && styles.clubDotOff]}>{stamps > 0 && <Icon name="check" size={16} color={colors.dark} strokeWidth={3} />}</View>
          <View>
            <Txt w="bold" size={14} color="#FFFFFF">{tightComma(stamps > 0 ? `+${stampsLabel(stamps)} w ${tenant.loyalty.clubName}` : `Jeszcze ${formatPLN(groszeToNextHalf(total, tenant.loyalty.zlPerHalfStamp))} do 0,5 pieczątki`)}</Txt>
            <Txt size={12} color="#D6D3D1">{stamps > 0 ? 'Doliczymy po odbiorze zamówienia' : `Pół pieczątki za każde pełne ${tenant.loyalty.zlPerHalfStamp} zł`}</Txt>
          </View>
        </View>

        <Card>
          <Txt w="extrabold" size={16} style={{ marginBottom: 4 }}>Płatność</Txt>
          {PAYMENTS.map((pm, i) => {
            const on = pm.id === payment;
            return (
              <Pressable key={pm.id} accessibilityRole="radio" accessibilityState={{ selected: on }} onPress={() => setPayment(pm.id)}
                style={[styles.pay, i < PAYMENTS.length - 1 && styles.border]}>
                <View style={[styles.radio, on && styles.radioOn]} />
                <View>
                  <Txt w="bold" size={15}>{pm.name}</Txt>
                  {pm.note ? <Txt size={12} color={colors.muted}>{pm.note}</Txt> : null}
                </View>
              </Pressable>
            );
          })}
        </Card>

        <View style={{ gap: 6, paddingHorizontal: 4 }}>
          <Row label="Produkty" value={formatPLN(total)} />
          <Row label="Opłata serwisowa" value="0 zł" />
          <View style={styles.totalRow}><Txt w="extrabold" size={18}>Razem</Txt><Txt w="extrabold" size={18}>{formatPLN(total)}</Txt></View>
        </View>
      </ScrollView>
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <Pressable accessibilityRole="button" onPress={submit} style={styles.payBtn}>
          <Txt w="bold" size={16} color="#FFFFFF">Zamawiam i płacę · {formatPLN(total)}</Txt>
        </Pressable>
      </View>
      <LocationPicker visible={picking} onClose={() => setPicking(false)} />
    </View>
  );
}

function Choice({ on, title, sub, onPress, disabled }: { on: boolean; title: string; sub: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected: on, disabled }} disabled={disabled} onPress={onPress}
      style={[styles.choice, on ? styles.choiceOn : null, disabled && { opacity: 0.5 }]}>
      <Txt w={on ? 'extrabold' : 'bold'} size={14}>{title}</Txt>
      <Txt size={12} color={on ? colors.brandDark : colors.muted}>{sub}</Txt>
    </Pressable>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <View style={styles.totalRow}><Txt size={14} color={colors.muted}>{label}</Txt><Txt size={14} color={colors.muted}>{value}</Txt></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  circle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.brandLight, alignItems: 'center', justifyContent: 'center' },
  grid2: { flexDirection: 'row', gap: 8 },
  choice: { flex: 1, height: 58, borderRadius: 16, borderWidth: 1, borderColor: '#E7E0D6', backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  choiceOn: { borderWidth: 2, borderColor: colors.brand, backgroundColor: '#FDF2F1' },
  slot: { height: 44, paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, borderColor: '#E7E0D6', justifyContent: 'center' },
  line: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EFE6DF' },
  thumb: { width: 64, height: 56 },
  more: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12, minHeight: 44 },
  club: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 22, backgroundColor: colors.dark },
  clubDotOff: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#57534E' },
  clubDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.stampOn, alignItems: 'center', justifyContent: 'center' },
  pay: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52 },
  border: { borderBottomWidth: 1, borderBottomColor: '#F1EAE4' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#D6CFC8' },
  radioOn: { borderWidth: 6, borderColor: colors.brand },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bar: {
    position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 14, backgroundColor: colors.card,
    borderTopLeftRadius: 26, borderTopRightRadius: 26, shadowColor: '#1C1917', shadowOpacity: 0.06, shadowRadius: 20, shadowOffset: { width: 0, height: -8 }, elevation: 12,
  },
  payBtn: {
    height: 56, borderRadius: 28, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center',
  },
});
