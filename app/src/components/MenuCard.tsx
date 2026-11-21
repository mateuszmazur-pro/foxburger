import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Line, Path, Polygon, Polyline, SvgXml } from 'react-native-svg';
import { useCart } from '../cart/CartContext';
import { plainKey, qtyForProduct } from '../cart/cart';
import { formatPLN } from '../format';
import { descLines, priceNumber } from '../menu/menuText';
import { Product, tenant } from '../tenant';
import { colors } from '../theme';
import { QtyStepper } from './QtyStepper';
import { Txt } from './Txt';

const SIDE = 96; // stała szerokość kolumny z ceną i przyciskiem – nic się nie przesuwa
const SPLAT_W = 94;
const SPLAT_H = 52;
const DOT = '#D6C7BE';

/** Koło z ząbkowaną krawędzią (jak w logo) – punkty wielokąta. */
function toothedPoints(size: number, teeth = 18, depth = 2.5): string {
  const c = size / 2;
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (Math.PI * i) / teeth;
    const r = i % 2 === 0 ? c : c - depth;
    pts.push(`${(c + r * Math.cos(a)).toFixed(1)},${(c + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}
const TOOTH = toothedPoints(46);

function ToothedPlus({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={4} style={styles.plus}>
      <Svg width={46} height={46} style={StyleSheet.absoluteFill}>
        <Polygon points={TOOTH} fill={colors.dark} />
      </Svg>
      <Svg width={18} height={18} viewBox="0 0 24 24">
        <Path d="M12 5v14M5 12h14" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
      </Svg>
    </Pressable>
  );
}

function Price({ grosze }: { grosze: number }) {
  const splat = tenant.priceSplatSvg;
  return (
    <View style={styles.priceBox}>
      {splat && (
        <View style={styles.splat} pointerEvents="none">
          <SvgXml xml={splat} width={SPLAT_W} height={SPLAT_H} color={colors.brand} />
        </View>
      )}
      <Txt w="price" size={36} color={splat ? '#FFFFFF' : colors.text} style={styles.price}>{priceNumber(grosze)}</Txt>
    </View>
  );
}

export function ZigzagLine() {
  const pts: string[] = [];
  for (let x = 0, up = true; x <= 350; x += 7, up = !up) pts.push(`${x} ${up ? 1 : 7}`);
  return (
    <Svg width="100%" height={8} viewBox="0 0 350 8" preserveAspectRatio="none">
      <Polyline points={pts.join(' ')} fill="none" stroke="#E7D5CC" strokeWidth={1.5} />
    </Svg>
  );
}

export function MenuCard({ product }: { product: Product }) {
  const { lines, add, setQty } = useCart();
  const qty = qtyForProduct(lines, product.id);
  const key = plainKey(product.id);
  const open = () => router.push(`/produkt/${product.id}`);
  return (
    <View style={styles.card}>
      <Pressable accessibilityRole="link" accessibilityLabel={`${product.name}, ${formatPLN(product.price)}`} onPress={open} style={styles.photo}>
        <Image source={product.image} style={styles.img} resizeMode="contain" />
      </Pressable>
      <Pressable onPress={open} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.row1}>
        <Txt w="extrabold" size={20} style={styles.name}>{product.name}</Txt>
        <View style={styles.leader}>
          <Svg width="100%" height={4}>
            <Line x1={2} y1={2} x2="100%" y2={2} stroke={DOT} strokeWidth={2} strokeDasharray="0.1 5" strokeLinecap="round" />
          </Svg>
        </View>
        <View style={styles.side}><Price grosze={product.price} /></View>
      </Pressable>
      <View style={styles.row2}>
        <Txt size={13.5} color={colors.muted} style={styles.desc}>{descLines(product.description).join('\n')}</Txt>
        <View style={[styles.side, styles.sideBottom]}>
          {qty === 0 ? (
            <ToothedPlus label={`Dodaj ${product.name} do koszyka`} onPress={() => add({ productId: product.id })} />
          ) : (
            <QtyStepper compact qty={qty} label={product.name} onInc={() => add({ productId: product.id })} onDec={() => setQty(key, qty - 1)} />
          )}
        </View>
      </View>
      <View style={styles.sep}><ZigzagLine /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingBottom: 6 },
  photo: { height: 168, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  img: { width: 236, height: 168 },
  row1: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  name: { flexShrink: 1, lineHeight: 26 },
  leader: { flex: 1, minWidth: 12, marginBottom: 6 },
  side: { width: SIDE, alignItems: 'center' },
  sideBottom: { justifyContent: 'flex-end' },
  priceBox: { width: SPLAT_W, height: 44, alignItems: 'center', justifyContent: 'center' },
  splat: { position: 'absolute', left: 0, top: (44 - SPLAT_H) / 2, width: SPLAT_W, height: SPLAT_H, transform: [{ rotate: '-4deg' }] },
  price: { lineHeight: 40, letterSpacing: -0.7, textAlign: 'center', includeFontPadding: false },
  row2: { flexDirection: 'row', gap: 8, marginTop: 2 },
  desc: { flex: 1, lineHeight: 19 },
  plus: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  sep: { marginTop: 18 },
});
