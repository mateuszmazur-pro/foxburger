import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StampIcon } from '../../components/StampIcon';
import { useTabBarSpace } from '../../components/TabBar';
import { toothPath } from '../../components/toothPath';
import { Txt } from '../../components/Txt';
import { stampSlots, stampsLabel } from '../../loyalty/stamps';
import { tenant } from '../../tenant';
import { colors, fonts } from '../../theme';

const SETTINGS = [
  { icon: '🔔', title: 'Powiadomienia', sub: 'Promocje i status zamówienia' },
  { icon: '👤', title: 'Moje dane', sub: 'Imię, telefon, e-mail' },
  { icon: '📄', title: 'Regulamin i prywatność' },
];

const rows = <T,>(items: T[], n: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / n) }, (_, i) => items.slice(i * n, i * n + n));

const soon = () => Alert.alert('Wkrótce', 'Ta opcja pojawi się w kolejnej wersji aplikacji.');

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const bottom = useTabBarSpace();
  const [head, setHead] = useState({ w: 0, h: 0 });
  const { stampsToReward, demoStamps, zlPerHalfStamp, clubName } = tenant.loyalty;
  const left = stampsToReward - demoStamps;
  const howItWorks = () =>
    Alert.alert(
      `Jak działa ${clubName}?`,
      `Za każde pełne ${zlPerHalfStamp} zł w zamówieniu dostajesz 0,5 pieczątki (${zlPerHalfStamp * 2} zł = 1 pieczątka). Pokaż swój kod przy kasie albo zamów w aplikacji. Po zebraniu ${stampsToReward} pieczątek burger jest od nas.`,
    );
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: bottom }}>
      <View onLayout={(e) => setHead({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })} style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 44 }}>
        {head.w > 0 && (
          <Svg width={head.w} height={head.h} style={StyleSheet.absoluteFill}>
            <Path d={toothPath(head.w, head.h, 26, 12)} fill={colors.dark} />
          </Svg>
        )}
        <Txt w="semibold" size={13} color="#A8A29E">Twoje konto</Txt>
        <Txt w="extrabold" size={28} color="#FFFFFF" accessibilityRole="header" style={{ letterSpacing: -0.5 }}>Cześć, {tenant.demoCustomer.firstName}!</Txt>
        <View style={[styles.row, { marginTop: 18, gap: 14 }]}>
          <Txt style={{ fontFamily: fonts.price, fontSize: 64, lineHeight: 64, color: '#FFFFFF' }}>{String(demoStamps).replace('.', ',')}</Txt>
          <View>
            <Txt size={14} color="#D6D3D1">{stampsLabel(demoStamps).split(' ')[1]} z {stampsToReward}</Txt>
            <Txt w="bold" size={14} color={colors.navActive}>{String(left).replace('.', ',')} do darmowego burgera</Txt>
          </View>
        </View>
        <View style={styles.grid} accessible accessibilityLabel={`${stampsLabel(demoStamps)} z ${stampsToReward}`}>
          {rows(stampSlots(demoStamps, stampsToReward), 5).map((row, r) => (
            <View key={r} style={styles.gridRow}>
              {row.map((slot, i) => <StampIcon key={i} slot={slot} size={36} />)}
            </View>
          ))}
        </View>
        <View style={[styles.row, { marginTop: 18, gap: 10 }]}>
          <Pressable onPress={() => router.navigate('/kod')} accessibilityRole="button" style={[styles.btn, { backgroundColor: colors.navActive }]}>
            <Txt w="extrabold" size={14}>Pokaż mój kod</Txt>
          </Pressable>
          <Pressable onPress={howItWorks} accessibilityRole="button" style={[styles.btn, styles.btnOutline]}>
            <Txt w="bold" size={14} color="#FFFFFF">Jak to działa?</Txt>
          </Pressable>
        </View>
      </View>
      <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
        <Txt w="extrabold" size={18}>Ustawienia</Txt>
        {SETTINGS.map((s) => (
          <Pressable key={s.title} onPress={soon} accessibilityRole="button" style={styles.setting}>
            <View style={styles.settingIcon}><Txt size={16}>{s.icon}</Txt></View>
            <View style={{ flex: 1 }}>
              <Txt w="bold" size={15}>{s.title}</Txt>
              {s.sub && <Txt size={12} color={colors.muted}>{s.sub}</Txt>}
            </View>
            <Svg width={16} height={16} viewBox="0 0 24 24"><Path d="M9 6l6 6-6 6" fill="none" stroke="#A8A29E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" /></Svg>
          </Pressable>
        ))}
        <Pressable onPress={soon} accessibilityRole="button" style={{ paddingTop: 16, alignSelf: 'flex-start' }}>
          <Txt w="bold" size={14} color={colors.brand}>Wyloguj się</Txt>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  row: { flexDirection: 'row', alignItems: 'center' },
  grid: { gap: 10, marginTop: 18, paddingBottom: 12, alignSelf: 'center' },
  gridRow: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  btnOutline: { borderWidth: 1.5, borderColor: '#57534E' },
  setting: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#EFE6DF' },
  settingIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3EDE8', alignItems: 'center', justifyContent: 'center' },
});
