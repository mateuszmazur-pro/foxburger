import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Polygon } from 'react-native-svg';
import { useCart } from '../cart/CartContext';
import { formatPLN } from '../format';
import { stampsForOrder, stampsLabel } from '../loyalty/stamps';
import { tenant } from '../tenant';
import { priceNumber } from '../menu/menuText';
import { colors } from '../theme';
import { TAB_BAR_HEIGHT } from './TabBar';
import { Txt } from './Txt';

const TEETH_H = 8;
const MAX_ICONS = 5;

function StampIcons({ stamps }: { stamps: number }) {
  const whole = Math.min(Math.floor(stamps), MAX_ICONS);
  const half = stamps % 1 !== 0 && whole < MAX_ICONS;
  return (
    <View style={styles.icons}>
      {Array.from({ length: whole }, (_, i) => (
        <Svg key={i} width={16} height={16} viewBox="0 0 20 20"><Circle cx={10} cy={10} r={9} fill={colors.stampOn} /></Svg>
      ))}
      {half && (
        <Svg width={16} height={16} viewBox="0 0 20 20">
          <Circle cx={10} cy={10} r={8} fill="none" stroke="#57534E" strokeWidth={2} />
          <Path d="M10 1a9 9 0 0 0 0 18z" fill={colors.stampOn} />
        </Svg>
      )}
    </View>
  );
}
const ZIGZAG = (() => {
  const pts = ['0 0'];
  for (let x = 0, i = 0; x <= 362; x += 7, i++) pts.push(`${x} ${i % 2 === 0 ? 0 : 7}`);
  pts.push('362 0');
  return pts.join(' ');
})();

/** „Paragon” z ząbkowanym dołem – pokazuje się, gdy coś jest w koszyku. */
export function CartBar() {
  const { count, total } = useCart();
  const insets = useSafeAreaInsets();
  const enter = useRef(new Animated.Value(0)).current;
  const shown = count > 0;
  useEffect(() => {
    if (!shown) { enter.setValue(0); return; }
    Animated.spring(enter, { toValue: 1, friction: 7, tension: 120, useNativeDriver: true }).start();
  }, [shown, enter]);
  if (!shown) return null;
  const open = () => router.push('/koszyk');
  const stamps = stampsForOrder(total, tenant.loyalty.zlPerHalfStamp);
  return (
    <Animated.View style={[styles.wrap, { bottom: Math.max(insets.bottom, 18) + TAB_BAR_HEIGHT + 6, opacity: enter, transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Twoje zamówienie, ${count} szt., ${formatPLN(total)}, ${stampsLabel(stamps)} za zamówienie. Zamów`} onPress={open}>
        <View style={styles.receipt}>
          <View style={styles.stampRow}>
            <StampIcons stamps={stamps} />
            <Txt w="bold" size={12.5} color={colors.navActive}>+{stampsLabel(stamps)} za to zamówienie</Txt>
          </View>
          <Svg width="100%" height={1} style={styles.dash}>
            <Line x1={0} y1={0.5} x2="100%" y2={0.5} stroke="#44403C" strokeWidth={1} strokeDasharray="4 3" />
          </Svg>
          <View style={styles.main}>
          <View>
            <Txt w="semibold" size={12} color="#A8A29E">Twoje zamówienie · {count} szt.</Txt>
            <View style={styles.sumRow}>
              <Txt w="price" size={28} color="#FFFFFF" style={styles.sum}>{priceNumber(total)}</Txt>
              <Txt w="bold" size={12} color="#A8A29E">zł</Txt>
            </View>
          </View>
          <View style={styles.btn}>
            <Txt w="extrabold" size={15} color={colors.dark}>Zamów</Txt>
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path d="M5 12h14M13 6l6 6-6 6" stroke={colors.dark} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </Svg>
          </View>
          </View>
        </View>
        <Svg width="100%" height={TEETH_H} viewBox="0 0 362 8" preserveAspectRatio="none">
          <Polygon points={ZIGZAG} fill={colors.dark} />
        </Svg>
      </Pressable>
    </Animated.View>
  );
}

export const CART_BAR_SPACE = 118;

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 14, right: 14 },
  receipt: {
    backgroundColor: colors.dark, borderTopLeftRadius: 18, borderTopRightRadius: 18,
    paddingTop: 12, paddingBottom: 10, paddingLeft: 18, paddingRight: 12,
  },
  stampRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 10 },
  dash: { marginBottom: 10 },
  icons: { flexDirection: 'row', gap: 3 },
  main: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sumRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  sum: { lineHeight: 32, includeFontPadding: false },
  btn: { height: 44, paddingHorizontal: 18, borderRadius: 22, backgroundColor: colors.navActive, flexDirection: 'row', alignItems: 'center', gap: 8 },
});
