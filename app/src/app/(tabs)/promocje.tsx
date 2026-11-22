import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarSpace } from '../../components/TabBar';
import { Txt } from '../../components/Txt';
import { ZigEdge } from '../../components/ZigEdge';
import { useLocation } from '../../state/LocationContext';
import { tenant } from '../../tenant';
import type { Promo } from '../../tenant/types';
import { colors, fonts } from '../../theme';

const LIGHT = { bg: '#FFFFFF', text: colors.text, label: colors.brand, muted: colors.muted, dash: '#E7DDD5', value: colors.brand };
const DARK = { bg: colors.dark, text: '#FFFFFF', label: colors.navActive, muted: '#A8A29E', dash: '#44403C', value: '#FFFFFF' };

function Coupon({ promo, active, onActivate }: { promo: Promo; active: boolean; onActivate: () => void }) {
  const club = promo.kind === 'club';
  const c = club ? DARK : LIGHT;
  const on = club || active;
  return (
    <View>
      <ZigEdge color={c.bg} side="top" />
      <View style={{ backgroundColor: c.bg, paddingHorizontal: 18, paddingVertical: 14, gap: 12 }}>
        <View style={styles.row}>
          <View style={{ flex: 1, gap: 3 }}>
            <Txt w="extrabold" size={11} color={c.label} style={{ letterSpacing: 1.3 }}>{club ? tenant.loyalty.clubName.toUpperCase() : 'KUPON'}</Txt>
            <Txt w="extrabold" size={18} color={c.text}>{promo.title}</Txt>
            <Txt size={12} color={c.muted} style={{ lineHeight: 17 }}>{promo.description}</Txt>
          </View>
          <View style={[styles.value, { borderLeftColor: c.dash }]}>
            <Txt style={{ fontFamily: fonts.price, fontSize: 34, lineHeight: 36, color: c.value }}>{promo.value}</Txt>
            <Txt w="bold" size={11} color={c.muted} style={{ textAlign: 'center' }}>{promo.valueNote}</Txt>
          </View>
        </View>
        <View style={styles.between}>
          <Txt w="semibold" size={11} color={c.muted} style={{ flex: 1 }}>{promo.terms}</Txt>
          <Pressable
            disabled={on}
            onPress={onActivate}
            accessibilityRole="button"
            accessibilityState={{ disabled: on }}
            style={[styles.btn, { backgroundColor: on ? colors.navActive : colors.brand }]}
          >
            <Txt w="extrabold" size={14} color={on ? colors.dark : '#FFFFFF'}>{on ? 'Aktywny ✓' : 'Aktywuj'}</Txt>
          </Pressable>
        </View>
      </View>
      <ZigEdge color={c.bg} side="bottom" />
    </View>
  );
}

export default function PromoScreen() {
  const insets = useSafeAreaInsets();
  const bottom = useTabBarSpace();
  const { location } = useLocation();
  const [active, setActive] = useState<Record<string, boolean>>({});
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: bottom, paddingHorizontal: 20 }}>
      <Txt w="semibold" size={12} color={colors.muted}>Odbiór w lokalu · {location.name}</Txt>
      <Txt w="extrabold" size={30} accessibilityRole="header" style={{ letterSpacing: -0.6 }}>Promocje</Txt>
      <Txt size={13} color={colors.muted} style={{ marginTop: 10, lineHeight: 18 }}>Aktywuj kupon — zniżka doliczy się sama w koszyku.</Txt>
      <View style={{ gap: 18, marginTop: 16 }}>
        {tenant.promos.map((p) => (
          <Coupon key={p.id} promo={p} active={!!active[p.id]} onActivate={() => setActive((a) => ({ ...a, [p.id]: true }))} />
        ))}
      </View>
      <View style={styles.hint}>
        <SvgXml xml={tenant.logoSvg} width={44} height={36}/>
        <Txt size={12.5} color="#44403C" style={{ flex: 1, lineHeight: 18 }}>
          Nowe promocje pokażemy też jako powiadomienie — <Txt w="bold" size={12.5} color="#44403C">włącz powiadomienia</Txt>.
        </Txt>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  row: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  value: { width: 86, alignItems: 'center', paddingLeft: 14, borderLeftWidth: 2, borderStyle: 'dashed' },
  btn: { height: 38, paddingHorizontal: 16, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  hint: { marginTop: 22, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 18, paddingVertical: 12, paddingHorizontal: 14 },
});
