import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../cart/CartContext';
import { formatPLN } from '../format';
import { colors } from '../theme';
import { TAB_BAR_HEIGHT } from './TabBar';
import { Txt } from './Txt';

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
  return (
    <Animated.View style={[styles.wrap, { bottom: Math.max(insets.bottom, 18) + TAB_BAR_HEIGHT + 10, opacity: enter, transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Koszyk, ${count} szt., ${formatPLN(total)}`} onPress={() => router.push('/koszyk')} style={styles.bar}>
        <Txt w="bold" size={15} color="#FFFFFF">Koszyk · {count} szt.</Txt>
        <View style={styles.pill}><Txt w="extrabold" size={15} color={colors.brand}>{formatPLN(total)}</Txt></View>
      </Pressable>
    </Animated.View>
  );
}

export const CART_BAR_SPACE = 66;

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 14, right: 14 },
  bar: {
    height: 56, borderRadius: 28, backgroundColor: colors.brand,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 8,
    shadowColor: colors.brand, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 12 }, elevation: 8,
  },
  pill: { height: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center' },
});
