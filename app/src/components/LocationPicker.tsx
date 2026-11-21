import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { tenant } from '../tenant';
import { useLocation } from '../state/LocationContext';
import { colors } from '../theme';
import { Icon } from './Icon';
import { Txt } from './Txt';

export function LocationPicker({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { location, setLocationId } = useLocation();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Zamknij wybór lokalu" />
      <View style={styles.sheet}>
        <Txt w="extrabold" size={20}>Wybierz lokal</Txt>
        {tenant.locations.map((l) => {
          const on = l.id === location.id;
          return (
            <Pressable key={l.id} accessibilityRole="radio" accessibilityState={{ selected: on }}
              onPress={() => { setLocationId(l.id); onClose(); }} style={styles.row}>
              <View style={[styles.dot, on && styles.dotOn]}>{on && <Icon name="check" size={14} color="#FFFFFF" strokeWidth={3} />}</View>
              <View style={{ flex: 1 }}>
                <Txt w="bold" size={15}>{l.name}</Txt>
                <Txt size={12} color={colors.muted}>{l.address}</Txt>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(28,25,23,0.4)' },
  sheet: { backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 40, gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 58, borderBottomWidth: 1, borderBottomColor: colors.line },
  dot: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D6CFC8', alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: colors.brand, borderColor: colors.brand },
});
