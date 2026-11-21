import { router, useLocalSearchParams } from 'expo-router';
import { Image, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Icon, IconName } from '../../components/Icon';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Txt } from '../../components/Txt';
import { formatPLN } from '../../format';
import { hhmm, useNow } from '../../hooks';
import { useOrders } from '../../orders/OrdersContext';
import { OrderStatus, statusAt } from '../../orders/status';
import { tenant } from '../../tenant';
import { colors } from '../../theme';

const PAY: Record<string, string> = { blik: 'BLIK', applepay: 'Apple Pay', gpay: 'Google Pay', card: 'kartą' };
const BADGE: Record<OrderStatus, string> = { przyjete: 'Zamówienie przyjęte', przygotowanie: 'Przygotowujemy Twoje jedzenie', gotowe: 'Gotowe! Zapraszamy po odbiór' };

export default function OrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrders().get(id);
  const now = useNow();
  const close = () => router.dismissTo('/');
  if (!order) return <EmptyState title="Nie znaleziono zamówienia" text="To zamówienie nie jest już dostępne." action="Wróć na start" onAction={close} />;

  const status = statusAt(order.createdMs, now);
  const created = new Date(order.createdMs);
  const ready = order.pickup.mode === 'time' && order.pickup.time ? order.pickup.time : hhmm(new Date(order.createdMs + 20 * 60000));
  const loc = tenant.locations.find((l) => l.id === order.pickup.locationId) ?? tenant.locations[0];
  const names = order.lines.map((l) => tenant.products.find((p) => p.id === l.productId)?.name).filter(Boolean);
  const notes = order.lines.map((l) => l.note).filter(Boolean);
  const steps: { title: string; sub: string; state: 'done' | 'now' | 'todo' }[] = [
    { title: 'Zamówienie przyjęte', sub: `${hhmm(created)} · opłacone ${PAY[order.payment] ?? ''}`, state: 'done' },
    { title: 'W przygotowaniu', sub: 'Kuchnia już działa', state: status === 'przyjete' ? 'todo' : status === 'przygotowanie' ? 'now' : 'done' },
    { title: 'Gotowe do odbioru', sub: 'Damy znać powiadomieniem', state: status === 'gotowe' ? 'now' : 'todo' },
    { title: 'Odebrane', sub: '+1 pieczątka w Fox Club', state: 'todo' },
  ];

  return (
    <View style={styles.screen}>
      <ScreenHeader title={`Zamówienie #${order.number}`} subtitle={`Złożone o ${hhmm(created)}`} icon="close" onClose={close} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 14 }}>
        <View style={styles.hero}>
          <View style={{ flex: 1, gap: 2 }}>
            <Txt w="semibold" size={13} color={colors.muted}>{status === 'gotowe' ? 'Gotowe do odbioru' : 'Gotowe do odbioru ok.'}</Txt>
            <Txt w="extrabold" size={52} style={{ lineHeight: 56, letterSpacing: -1.5 }}>{ready}</Txt>
            <View style={styles.badge}><Txt w="bold" size={13} color={colors.brandDark}>{BADGE[status]}</Txt></View>
          </View>
          <Image source={tenant.products[0].image} resizeMode="contain" style={styles.img} />
        </View>
        <Card>
          {steps.map((s, i) => <Step key={s.title} {...s} last={i === steps.length - 1} />)}
        </Card>
        <Card style={{ gap: 12 }}>
          <View>
            <Txt w="bold" size={15}>{tenant.name} {loc.name}</Txt>
            <Txt size={13} color={colors.muted}>{loc.address}</Txt>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Action icon="nav" label="Nawiguj" dark onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`)} />
            {loc.phone && <Action icon="phone" label="Zadzwoń" onPress={() => Linking.openURL(`tel:${loc.phone}`)} />}
          </View>
        </Card>
        <Card style={styles.sum}>
          <View style={{ flex: 1 }}>
            <Txt w="bold" size={14} numberOfLines={2}>{names.join(', ')}</Txt>
            <Txt size={12} color={colors.muted}>{order.lines.reduce((s, l) => s + l.qty, 0)} szt.{notes.length ? ` · ${notes.join(', ')}` : ''}</Txt>
          </View>
          <Txt w="extrabold" size={16}>{formatPLN(order.total)}</Txt>
        </Card>
      </ScrollView>
    </View>
  );
}

function Step({ title, sub, state, last }: { title: string; sub: string; state: 'done' | 'now' | 'todo'; last: boolean }) {
  return (
    <View style={styles.step} accessibilityLabel={`${title}${state === 'done' ? ', zakończone' : state === 'now' ? ', w toku' : ''}`}>
      {state === 'done' && <View style={[styles.dot, { backgroundColor: colors.brand }]}><Icon name="check" size={14} color="#FFFFFF" strokeWidth={3} /></View>}
      {state === 'now' && <View style={[styles.dot, { backgroundColor: colors.brandLight }]}><View style={styles.pulse} /></View>}
      {state === 'todo' && <View style={[styles.dot, styles.todo]} />}
      {!last && <View style={[styles.vline, { backgroundColor: state === 'done' ? colors.brand : '#E7E0D6' }]} />}
      <View>
        <Txt w="bold" size={15} color={state === 'todo' ? '#A8A29E' : colors.text}>{title}</Txt>
        <Txt size={12} color={colors.muted}>{sub}</Txt>
      </View>
    </View>
  );
}

function Action({ icon, label, onPress, dark }: { icon: IconName; label: string; onPress: () => void; dark?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.action, { backgroundColor: dark ? colors.dark : colors.bg }]}>
      <Icon name={icon} size={16} color={dark ? '#FFFFFF' : colors.text} strokeWidth={2.2} />
      <Txt w="bold" size={14} color={dark ? '#FFFFFF' : colors.text}>{label}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: { flexDirection: 'row', alignItems: 'center' },
  badge: { alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: colors.brandLight },
  img: { width: 130, height: 130, marginRight: -10 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 14, height: 60 },
  dot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  pulse: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.brand },
  todo: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#D6CFC8' },
  vline: { position: 'absolute', left: 15, top: 46, width: 2, height: 26 },
  action: { flex: 1, height: 46, borderRadius: 23, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  sum: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
