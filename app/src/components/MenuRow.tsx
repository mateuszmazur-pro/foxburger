import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useCart } from '../cart/CartContext';
import { plainKey, qtyForProduct } from '../cart/cart';
import { formatPLN } from '../format';
import { Product } from '../tenant';
import { colors } from '../theme';
import { Icon } from './Icon';
import { QtyStepper } from './QtyStepper';
import { Txt } from './Txt';

export function MenuRow({ product, last }: { product: Product; last?: boolean }) {
  const { lines, add, setQty } = useCart();
  const qty = qtyForProduct(lines, product.id);
  const key = plainKey(product.id);
  return (
    <View style={[styles.row, !last && styles.line]}>
      <Pressable accessibilityRole="link" accessibilityLabel={`${product.name}, ${formatPLN(product.price)}`} onPress={() => router.push(`/produkt/${product.id}`)} style={styles.info}>
        <Txt w="bold" size={16}>{product.name}</Txt>
        <Txt size={12} color={colors.muted} numberOfLines={2}>{product.description}</Txt>
        <Txt w="bold" size={14} style={{ marginTop: 2 }}>{formatPLN(product.price)}</Txt>
      </Pressable>
      {qty === 0 ? (
        <Pressable accessibilityRole="button" accessibilityLabel={`Dodaj ${product.name} do koszyka`} onPress={() => add({ productId: product.id })} style={styles.plus}>
          <Icon name="plus" size={18} color="#FFFFFF" strokeWidth={2.6} />
        </Pressable>
      ) : (
        <QtyStepper qty={qty} label={product.name} onInc={() => add({ productId: product.id })} onDec={() => setQty(key, qty - 1)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  line: { borderBottomWidth: 1, borderBottomColor: colors.line },
  info: { flex: 1, gap: 2 },
  plus: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center',
  },
});
