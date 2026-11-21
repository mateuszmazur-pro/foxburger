import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { Icon } from './Icon';
import { Txt } from './Txt';

type Props = { qty: number; onInc: () => void; onDec: () => void; size?: 'sm' | 'lg'; tone?: 'light' | 'muted' | 'dark'; label?: string; compact?: boolean };

export function QtyStepper({ qty, onInc, onDec, size = 'sm', tone = 'light', label = '', compact = false }: Props) {
  const h = size === 'lg' ? 52 : 44;
  const bg = tone === 'dark' ? 'transparent' : tone === 'muted' ? colors.bg : colors.card;
  const fg = tone === 'dark' ? '#FFFFFF' : colors.text;
  const acc = tone === 'dark' ? colors.navActive : colors.brand;
  return (
    <View style={[styles.wrap, { height: h, borderRadius: h / 2, backgroundColor: bg }, tone === 'light' && styles.shadow]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Mniej ${label}`.trim()} onPress={onDec} style={[styles.btn, { height: h }, compact && styles.btnCompact]} hitSlop={4}>
        <Icon name="minus" size={16} color={fg} strokeWidth={2.6} />
      </Pressable>
      <Txt w="extrabold" size={size === 'lg' ? 16 : 15} color={fg} style={styles.qty} accessibilityLabel={`Ilość ${qty}`}>{qty}</Txt>
      <Pressable accessibilityRole="button" accessibilityLabel={`Więcej ${label}`.trim()} onPress={onInc} style={[styles.btn, { height: h }, compact && styles.btnCompact]} hitSlop={4}>
        <Icon name="plus" size={16} color={acc} strokeWidth={2.6} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center' },
  shadow: { shadowColor: '#1C1917', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  btn: { width: 44, alignItems: 'center', justifyContent: 'center' },
  btnCompact: { width: 32 },
  qty: { minWidth: 18, textAlign: 'center' },
});
