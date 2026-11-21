import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { Icon, IconName } from './Icon';
import { Txt } from './Txt';

type Props = { label: string; onPress: () => void; icon?: IconName; variant?: 'brand' | 'dark'; disabled?: boolean; height?: number };

export function PrimaryButton({ label, onPress, icon, variant = 'brand', disabled, height = 56 }: Props) {
  const bg = variant === 'brand' ? colors.brand : colors.dark;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.btn, { backgroundColor: bg, height, borderRadius: height / 2, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 }]}
    >
      <View style={styles.row}>
        {icon && <Icon name={icon} size={19} color="#FFFFFF" />}
        <Txt w="bold" size={16} color="#FFFFFF">{label}</Txt>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
