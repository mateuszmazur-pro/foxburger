import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../cart/CartContext';
import { formatPLN } from '../format';
import { colors } from '../theme';
import { TAB_BAR_HEIGHT } from './TabBar';
import { Txt } from './Txt';

export function CartBar() {
  const { count, total } = useCart();
  const insets = useSafeAreaInsets();
  if (count === 0) return null;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Koszyk, ${count} szt., ${formatPLN(total)}`} onPress={() => router.push('/koszyk')}
      style={[styles.bar, { bottom: Math.max(insets.bottom, 18) + TAB_BAR_HEIGHT + 10 }]}>
      <Txt w="bold" size={15} color="#FFFFFF">Koszyk · {count} szt.</Txt>
      <View style={styles.pill}><Txt w="extrabold" size={15} color={colors.brand}>{formatPLN(total)}</Txt></View>
    </Pressable>
  );
}

export const CART_BAR_SPACE = 66;

const styles = StyleSheet.create({
  bar: {
    position: 'absolute', left: 14, right: 14, height: 56, borderRadius: 28, backgroundColor: colors.brand,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 8,
    shadowColor: colors.brand, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 12 }, elevation: 8,
  },
  pill: { height: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center' },
});
