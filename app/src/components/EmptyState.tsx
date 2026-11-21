import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { Icon } from './Icon';
import { PrimaryButton } from './PrimaryButton';
import { Txt } from './Txt';

export function EmptyState({ title, text, action, onAction }: { title: string; text: string; action: string; onAction: () => void }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}><Icon name="bag" size={34} color={colors.brand} /></View>
      <Txt w="extrabold" size={22} style={{ textAlign: 'center' }}>{title}</Txt>
      <Txt size={14} color={colors.muted} style={{ textAlign: 'center', marginBottom: 12 }}>{text}</Txt>
      <PrimaryButton label={action} onPress={onAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 32, gap: 8 },
  icon: { alignSelf: 'center', width: 80, height: 80, borderRadius: 40, backgroundColor: colors.brandLight, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
});
