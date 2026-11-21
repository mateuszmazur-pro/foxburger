import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Txt } from '../../components/Txt';
import { colors } from '../../theme';

export default function Screen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.s, { paddingTop: insets.top + 24 }]}>
      <Txt w="extrabold" size={28}>Konto</Txt>
      <Txt size={15} color={colors.muted}>Logowanie, historia zamówień i ustawienia — wkrótce.</Txt>
    </View>
  );
}

const styles = StyleSheet.create({ s: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, gap: 8 } });
