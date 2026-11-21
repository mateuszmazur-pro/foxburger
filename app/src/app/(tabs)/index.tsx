import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { BELOW_HEADER, ToothedHeader } from '../../components/ToothedHeader';
import { RoundIconButton } from '../../components/RoundIconButton';
import { PrimaryButton } from '../../components/PrimaryButton';
import { LocationPicker } from '../../components/LocationPicker';
import { Icon } from '../../components/Icon';
import { Txt } from '../../components/Txt';
import { useTabBarSpace } from '../../components/TabBar';
import { useLocation } from '../../state/LocationContext';
import { tenant } from '../../tenant';
import { colors } from '../../theme';

export default function StartScreen() {
  const bottom = useTabBarSpace();
  const { location } = useLocation();
  const [picking, setPicking] = useState(false);
  const hero = tenant.banner[0]?.image ?? tenant.products[0].image;
  return (
    <View style={styles.screen}>
      <ToothedHeader
        left={<RoundIconButton icon="qr" label="Mój kod" variant="onDark" onPress={() => router.navigate('/kod')} />}
        right={<RoundIconButton icon="bag" label="Koszyk" variant="onDark" onPress={() => router.push('/koszyk')} />}
      />
      <View style={{ paddingTop: BELOW_HEADER, paddingHorizontal: 20 }}>
        <Txt w="extrabold" size={28} style={styles.title} accessibilityRole="header">
          {`Witaj, ${tenant.demoCustomer.firstName}!\nZamów swojego Foxa.`}
        </Txt>
      </View>
      <Image source={hero} resizeMode="contain" style={styles.hero} accessibilityLabel={tenant.name} />
      <View style={[styles.bottom, { paddingBottom: bottom }]}>
        <PrimaryButton label="Zamów z odbiorem własnym" icon="bag" onPress={() => router.navigate('/menu')} />
        <Pressable accessibilityRole="button" accessibilityLabel="Zmień lokal odbioru" onPress={() => setPicking(true)} style={styles.loc} hitSlop={6}>
          <Icon name="pin" size={14} color={colors.brand} strokeWidth={2.2} />
          <Txt size={13} color={colors.muted} numberOfLines={1} style={{ flexShrink: 1 }}>
            Odbiór: <Txt w="bold" size={13}>{location.name}</Txt> · <Txt w="bold" size={13} color={colors.brand}>zmień</Txt>
          </Txt>
        </Pressable>
      </View>
      <LocationPicker visible={picking} onClose={() => setPicking(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { textAlign: 'center', lineHeight: 32, letterSpacing: -0.5 },
  hero: { flex: 1, width: '100%', minHeight: 120, marginVertical: 8, alignSelf: 'center', maxWidth: 360 },
  bottom: { paddingHorizontal: 20, gap: 8 },
  loc: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 36 },
});
