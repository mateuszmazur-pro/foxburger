import { Pressable, StyleSheet } from 'react-native';
import { Icon, IconName } from './Icon';

type Props = { icon: IconName; onPress: () => void; label: string; variant?: 'onDark' | 'onLight'; badge?: number };

export function RoundIconButton({ icon, onPress, label, variant = 'onLight' }: Props) {
  const dark = variant === 'onDark';
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={4}
      style={({ pressed }) => [styles.btn, dark ? styles.dark : styles.light, pressed && { opacity: 0.7 }]}>
      <Icon name={icon} size={20} color={dark ? '#FFFFFF' : '#1C1917'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  dark: { backgroundColor: 'rgba(255,255,255,0.16)' },
  light: { backgroundColor: '#FFFFFF', shadowColor: '#1C1917', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
});
