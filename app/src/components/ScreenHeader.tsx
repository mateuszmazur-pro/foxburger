import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { RoundIconButton } from './RoundIconButton';
import { Txt } from './Txt';

type Props = { title: string; subtitle?: string; icon?: 'back' | 'close'; onClose?: () => void };

export function ScreenHeader({ title, subtitle, icon = 'back', onClose }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.row, { paddingTop: insets.top + 8 }]}>
      <RoundIconButton icon={icon} label={icon === 'back' ? 'Wróć' : 'Zamknij'} onPress={onClose ?? (() => router.back())} />
      <View style={{ flex: 1 }}>
        <Txt w="extrabold" size={22} accessibilityRole="header" numberOfLines={1}>{title}</Txt>
        {subtitle && <Txt size={12} color={colors.muted}>{subtitle}</Txt>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingBottom: 12 } });
