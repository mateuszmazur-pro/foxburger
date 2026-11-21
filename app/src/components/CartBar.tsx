import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Polygon } from 'react-native-svg';
import { useCart } from '../cart/CartContext';
import { formatPLN } from '../format';
import { priceNumber } from '../menu/menuText';
import { colors } from '../theme';
import { TAB_BAR_HEIGHT } from './TabBar';
import { Txt } from './Txt';

const TEETH_H = 8;
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
  return (
    <Animated.View style={[styles.wrap, { bottom: Math.max(insets.bottom, 18) + TAB_BAR_HEIGHT + 6, opacity: enter, transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Twoje zamówienie, ${count} szt., ${formatPLN(total)}. Zamów`} onPress={open}>
        <View style={styles.receipt}>
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
        <Svg width="100%" height={TEETH_H} viewBox="0 0 362 8" preserveAspectRatio="none">
          <Polygon points={ZIGZAG} fill={colors.dark} />
        </Svg>
      </Pressable>
    </Animated.View>
  );
}

export const CART_BAR_SPACE = 80;

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 14, right: 14 },
  receipt: {
    backgroundColor: colors.dark, borderTopLeftRadius: 18, borderTopRightRadius: 18,
    paddingTop: 12, paddingBottom: 10, paddingLeft: 18, paddingRight: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  sumRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  sum: { lineHeight: 32, includeFontPadding: false },
  btn: { height: 44, paddingHorizontal: 18, borderRadius: 22, backgroundColor: colors.navActive, flexDirection: 'row', alignItems: 'center', gap: 8 },
});
