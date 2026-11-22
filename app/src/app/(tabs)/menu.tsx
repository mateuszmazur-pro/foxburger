import { BlurTargetView, BlurView } from 'expo-blur';
import { ComponentRef, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { CART_BAR_SPACE, CartBar } from '../../components/CartBar';
import { Icon } from '../../components/Icon';
import { LocationPicker } from '../../components/LocationPicker';
import { MenuCard } from '../../components/MenuCard';
import { useTabBarSpace } from '../../components/TabBar';
import { Txt } from '../../components/Txt';
import { useCart } from '../../cart/CartContext';
import { useLocation } from '../../state/LocationContext';
import { tenant } from '../../tenant';
import { colors } from '../../theme';

const FADE = 36;
const FADE_STEPS = [45, 30, 18, 8];

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const bottom = useTabBarSpace();
  const { count } = useCart();
  const { location } = useLocation();
  const [cat, setCat] = useState(tenant.categories[0].id);
  const [picking, setPicking] = useState(false);
  const [headerH, setHeaderH] = useState(insets.top + 100);
  const target = useRef<ComponentRef<typeof View>>(null);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const products = tenant.products.filter((p) => p.categoryId === cat);

  const pick = (id: string) => {
    setCat(id);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <View style={styles.screen}>
      <BlurTargetView ref={target} style={styles.screen}>
        <ScrollView ref={scroll} contentContainerStyle={{ paddingTop: headerH + 16, paddingHorizontal: 20, paddingBottom: bottom + (count > 0 ? CART_BAR_SPACE : 0), gap: 22 }}>
          {products.map((p) => <MenuCard key={p.id} product={p} />)}
        </ScrollView>
      </BlurTargetView>

      <View style={[styles.header, { paddingTop: insets.top + 2 }]} onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}>
        <BlurView blurTarget={target} blurMethod="dimezisBlurViewSdk31Plus" intensity={70} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.frost]} />
        <View style={styles.head}>
          <Pressable accessibilityRole="button" accessibilityLabel="Zmień lokal" onPress={() => setPicking(true)} hitSlop={6}>
            <Txt w="medium" size={12} color={colors.muted}>Odbiór w lokalu</Txt>
            <View style={styles.locRow}>
              <Txt w="bold" size={15}>{location.name}</Txt>
              <Icon name="chevronDown" size={14} strokeWidth={2.4} />
            </View>
          </Pressable>
        </View>
        <View style={styles.tabs} accessibilityRole="tablist">
          {tenant.categories.map((c) => {
            const on = c.id === cat;
            return (
              <Pressable key={c.id} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => pick(c.id)} style={[styles.tab, on && styles.tabOn]}>
                <Txt w={on ? 'bold' : 'medium'} size={14} color={on ? colors.text : colors.muted}>{c.name}</Txt>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Pas pod belką: rozmycie słabnie schodkami w dół (jak w projekcie), na wierzchu delikatny gradient tła. */}
      <View pointerEvents="none" style={[styles.fade, { top: headerH, height: FADE }]}>
        {FADE_STEPS.map((intensity, i) => (
          <BlurView key={i} blurTarget={target} blurMethod="dimezisBlurViewSdk31Plus" intensity={intensity} tint="light"
            style={{ position: 'absolute', left: 0, right: 0, top: (i * FADE) / FADE_STEPS.length, height: FADE / FADE_STEPS.length }} />
        ))}
        <Svg width="100%" height={FADE} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.bg} stopOpacity={0.4} />
              <Stop offset="1" stopColor={colors.bg} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height={FADE} fill="url(#fade)" />
        </Svg>
      </View>

      <CartBar />
      <LocationPicker visible={picking} onClose={() => setPicking(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 20, overflow: 'hidden' },
  frost: { backgroundColor: 'rgba(248, 243, 240, 0.4)' },
  head: { flexDirection: 'row', alignItems: 'center', minHeight: 44, marginBottom: 2 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tabs: { flexDirection: 'row', gap: 22, borderBottomWidth: 1, borderBottomColor: '#E7DDD5' },
  tab: { paddingVertical: 10, minHeight: 44, justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent', marginBottom: -1 },
  tabOn: { borderBottomColor: colors.brand },
  fade: { position: 'absolute', left: 0, right: 0 },
});
