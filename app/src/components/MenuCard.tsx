import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Line, Path, Polygon, Polyline, SvgXml } from 'react-native-svg';
import { useCart } from '../cart/CartContext';
import { plainKey, qtyForProduct } from '../cart/cart';
import { formatPLN } from '../format';
import { descLines, priceNumber } from '../menu/menuText';
import { Product, tenant } from '../tenant';
import { colors } from '../theme';
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

const CRUMB_COLORS = [colors.brand, colors.navActive, colors.dark, colors.stampOn, colors.navActive, colors.brand, colors.dark, colors.navActive, colors.brand, colors.stampOn];
const CRUMBS = CRUMB_COLORS.map((color, i) => {
  const a = (2 * Math.PI * i) / CRUMB_COLORS.length - Math.PI / 2;
  return { color, dx: Math.round(46 * Math.cos(a)), dy: Math.round(46 * Math.sin(a)), size: i % 2 ? 7 : 9, square: i % 3 === 0 };
});

/** Ząbkowany plus z animacją: wciśnięcie + okruszki. */
function ToothedPlus({ label, onPress }: { label: string; onPress: () => void }) {
  const press = useRef(new Animated.Value(0)).current;
  const burst = useRef(new Animated.Value(0)).current;
  const tap = () => {
    onPress();
    press.setValue(0);
    burst.setValue(0);
    Animated.parallel([
      Animated.timing(press, { toValue: 1, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(burst, { toValue: 1, duration: 600, easing: Easing.bezier(0.2, 0.8, 0.3, 1), useNativeDriver: true }),
    ]).start();
  };
  const scale = press.interpolate({ inputRange: [0, 0.4, 1], outputRange: [1, 0.82, 1] });
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={tap} hitSlop={4} style={styles.plus}>
      {CRUMBS.map((c, i) => (
        <Animated.View key={i} pointerEvents="none" style={[styles.crumb, {
          width: c.size, height: c.size, marginLeft: -c.size / 2, marginTop: -c.size / 2, backgroundColor: c.color, borderRadius: c.square ? 2 : c.size / 2,
          opacity: burst.interpolate({ inputRange: [0, 0.01, 1], outputRange: [0, 1, 0] }),
          transform: [
            { translateX: burst.interpolate({ inputRange: [0, 1], outputRange: [0, c.dx] }) },
            { translateY: burst.interpolate({ inputRange: [0, 1], outputRange: [0, c.dy] }) },
            { scale: burst.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] }) },
            { rotate: c.square ? '45deg' : '0deg' },
          ],
        }]} />
      ))}
      <Animated.View style={[styles.plusInner, { transform: [{ scale }] }]}>
        <Svg width={46} height={46} style={StyleSheet.absoluteFill}>
          <Polygon points={TOOTH} fill={colors.dark} />
        </Svg>
        {tenant.addIconSvg ? (
          <SvgXml xml={tenant.addIconSvg} width={23} height={21} color="#FFFFFF" />
        ) : (
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path d="M12 5v14M5 12h14" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
          </Svg>
        )}
      </Animated.View>
    </Pressable>
  );
}

/** Cena na maźnięciu; `wiggle` rośnie przy każdym dodaniu i uruchamia drgnięcie. */
function Price({ grosze, wiggle }: { grosze: number; wiggle: number }) {
  const splat = tenant.priceSplatSvg;
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (wiggle === 0) return;
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }).start();
  }, [wiggle, anim]);
  const rotate = anim.interpolate({ inputRange: [0, 0.25, 0.6, 1], outputRange: ['0deg', '-6deg', '4deg', '0deg'] });
  const scale = anim.interpolate({ inputRange: [0, 0.25, 0.6, 1], outputRange: [1, 1.08, 1, 1] });
  return (
    <Animated.View style={[styles.priceBox, { transform: [{ rotate }, { scale }] }]}>
      {splat && (
        <View style={styles.splat} pointerEvents="none">
          <SvgXml xml={splat} width={SPLAT_W} height={SPLAT_H} color={colors.brand} />
        </View>
      )}
      <Txt w="price" size={36} color={splat ? '#FFFFFF' : colors.text} style={styles.price}>{priceNumber(grosze)}</Txt>
    </Animated.View>
  );
}

/** Licznik sztuk w rogu zdjęcia: minus + duża liczba. Pojawia się po pierwszym dodaniu. */
function QtyPill({ qty, label, onDec }: { qty: number; label: string; onDec: () => void }) {
  const show = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;
  const prev = useRef(qty);
  useEffect(() => {
    if (qty > 0 && prev.current === 0) {
      show.setValue(0);
      Animated.spring(show, { toValue: 1, friction: 6, tension: 140, useNativeDriver: true }).start();
    }
    if (qty > prev.current) {
      pop.setValue(0.3);
      Animated.spring(pop, { toValue: 1, friction: 4, tension: 220, useNativeDriver: true }).start();
    }
    prev.current = qty;
  }, [qty, show, pop]);
  if (qty === 0) return null;
  return (
    <Animated.View style={[styles.pill, { opacity: show, transform: [{ scale: show.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Usuń jedną sztukę: ${label}`} onPress={onDec} hitSlop={6} style={styles.minus}>
        <Svg width={14} height={14} viewBox="0 0 24 24"><Path d="M5 12h14" stroke={colors.text} strokeWidth={3} strokeLinecap="round" /></Svg>
      </Pressable>
      <Animated.View style={[styles.pillNum, { transform: [{ scale: pop }] }]} accessibilityLabel={`W koszyku: ${qty} szt.`}>
        <Txt w="price" size={24} style={styles.pillQty}>{qty}</Txt>
        <Txt w="bold" size={11} color={colors.muted}>szt.</Txt>
      </Animated.View>
    </Animated.View>
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
  const [wiggle, setWiggle] = useState(0);
  const addOne = () => { add({ productId: product.id }); setWiggle((w) => w + 1); };
  const open = () => router.push(`/produkt/${product.id}`);
  return (
    <View style={styles.card}>
      <Pressable accessibilityRole="link" accessibilityLabel={`${product.name}, ${formatPLN(product.price)}`} onPress={open} style={styles.photo}>
        <Image source={product.image} style={styles.img} resizeMode="contain" />
      </Pressable>
      <View style={styles.pillSpot} pointerEvents="box-none"><QtyPill qty={qty} label={product.name} onDec={() => setQty(key, qty - 1)} /></View>
      <Pressable onPress={open} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.row1}>
        <Txt w="extrabold" size={20} style={styles.name}>{product.name}</Txt>
        <View style={styles.leader}>
          <Svg width="100%" height={4}>
            <Line x1={2} y1={2} x2="100%" y2={2} stroke={DOT} strokeWidth={2} strokeDasharray="0.1 5" strokeLinecap="round" />
          </Svg>
        </View>
        <View style={styles.side}><Price grosze={product.price} wiggle={wiggle} /></View>
      </Pressable>
      <View style={styles.row2}>
        <Txt size={13.5} color={colors.muted} style={styles.desc}>{descLines(product.description).join('\n')}</Txt>
        <View style={[styles.side, styles.sideBottom]}>
          <ToothedPlus label={`Dodaj ${product.name} do koszyka`} onPress={addOne} />
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
  plusInner: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  crumb: { position: 'absolute', left: '50%', top: '50%' },
  pillSpot: { position: 'absolute', top: 6, right: 0 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, borderRadius: 22, backgroundColor: colors.card, paddingLeft: 4, paddingRight: 14 },
  minus: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3EDE8', alignItems: 'center', justifyContent: 'center' },
  pillNum: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  pillQty: { lineHeight: 28, includeFontPadding: false },
  sep: { marginTop: 18 },
});
