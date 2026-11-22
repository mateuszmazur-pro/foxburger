import { ScrollView, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarSpace } from '../../components/TabBar';
import { Txt } from '../../components/Txt';
import { useNow } from '../../hooks';
import { loyaltyCode, secondsToRefresh } from '../../loyalty/code';
import { tenant } from '../../tenant';
import { colors, shadow } from '../../theme';

export default function CodeScreen() {
  const insets = useSafeAreaInsets();
  const bottom = useTabBarSpace();
  const now = useNow();
  const code = loyaltyCode(tenant.demoCustomer.id, now);
  const left = secondsToRefresh(now);
  const { stampsToReward, demoStamps } = tenant.loyalty;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: bottom, paddingHorizontal: 20, gap: 18 }}>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <Txt w="extrabold" size={28} accessibilityRole="header">Mój kod</Txt>
        <Txt size={14} color={colors.muted}>Pokaż przy kasie, żeby zebrać pieczątkę</Txt>
      </View>
      <View style={[styles.card, shadow]}>
        <Txt w="extrabold" size={12} color={colors.brandDark} style={{ letterSpacing: 2.4 }}>{`${tenant.loyalty.programName.toUpperCase()} · ${tenant.demoCustomer.firstName.toUpperCase()}`}</Txt>
        <View accessible accessibilityLabel={`Kod QR ${code}`}>
          <QRCode value={`${tenant.loyalty.qrPrefix}:${code}`} size={220} color={colors.dark} backgroundColor="#FFFFFF" />
        </View>
        <Txt w="extrabold" size={16} style={{ letterSpacing: 2 }}>{code.replace('-', ' · ')}</Txt>
        <View style={{ alignSelf: 'stretch', gap: 6 }}>
          <View style={styles.track}><View style={[styles.fill, { width: `${(left / 60) * 100}%` }]} /></View>
          <Txt size={12} color={colors.muted}>Kod odświeży się za {left === 60 ? '1:00' : `0:${String(left).padStart(2, '0')}`}</Txt>
        </View>
      </View>
      <View style={styles.stamps}>
        <View style={styles.between}>
          <Txt w="extrabold" size={13} color={colors.navActive} style={{ letterSpacing: 1.8 }}>TWOJE PIECZĄTKI</Txt>
          <Txt w="extrabold" size={13} color="#FFFFFF">{demoStamps}/{stampsToReward}</Txt>
        </View>
        <View style={styles.between}>
          {Array.from({ length: stampsToReward }, (_, i) => (
            <View key={i} style={[styles.stamp, i < demoStamps ? { backgroundColor: colors.stampOn } : styles.stampOff]} />
          ))}
        </View>
        <Txt size={12} color="#D6D3D1">Jeszcze {stampsToReward - demoStamps} do darmowego burgera</Txt>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: colors.card, borderRadius: 28, padding: 22, alignItems: 'center', gap: 14, marginHorizontal: 12 },
  track: { height: 6, borderRadius: 3, backgroundColor: '#F1EAE4', overflow: 'hidden' },
  fill: { height: 6, backgroundColor: colors.brand },
  stamps: { backgroundColor: colors.dark, borderRadius: 22, padding: 16, gap: 12 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stamp: { width: 22, height: 22, borderRadius: 11 },
  stampOff: { borderWidth: 2, borderColor: '#57534E' },
});
