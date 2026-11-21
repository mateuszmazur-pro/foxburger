import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BannerCarousel } from '../../components/BannerCarousel';
import { CART_BAR_SPACE, CartBar } from '../../components/CartBar';
import { Icon } from '../../components/Icon';
import { LocationPicker } from '../../components/LocationPicker';
import { MenuRow } from '../../components/MenuRow';
import { RoundIconButton } from '../../components/RoundIconButton';
import { useTabBarSpace } from '../../components/TabBar';
import { Txt } from '../../components/Txt';
import { useCart } from '../../cart/CartContext';
import { useLocation } from '../../state/LocationContext';
import { tenant } from '../../tenant';
import { colors } from '../../theme';

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const bottom = useTabBarSpace();
  const { count } = useCart();
  const { location } = useLocation();
  const [cat, setCat] = useState(tenant.categories[0].id);
  const [picking, setPicking] = useState(false);
  const products = tenant.products.filter((p) => p.categoryId === cat);
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: bottom + (count > 0 ? CART_BAR_SPACE : 0) }}>
        <View style={styles.head}>
          <Pressable accessibilityRole="button" accessibilityLabel="Zmień lokal" onPress={() => setPicking(true)} hitSlop={6}>
            <Txt w="medium" size={12} color={colors.muted}>Odbiór w lokalu</Txt>
            <View style={styles.locRow}>
              <Txt w="bold" size={15}>{location.name}</Txt>
              <Icon name="chevronDown" size={14} strokeWidth={2.4} />
            </View>
          </Pressable>
          <RoundIconButton icon="bag" label="Koszyk" onPress={() => router.push('/koszyk')} />
        </View>
        <BannerCarousel slides={tenant.banner} />
        <View style={styles.tabs} accessibilityRole="tablist">
          {tenant.categories.map((c) => {
            const on = c.id === cat;
            return (
              <Pressable key={c.id} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setCat(c.id)} style={[styles.tab, on && styles.tabOn]}>
                <Txt w={on ? 'bold' : 'medium'} size={14} color={on ? colors.text : colors.muted}>{c.name}</Txt>
              </Pressable>
            );
          })}
        </View>
        {products.map((p, i) => <MenuRow key={p.id} product={p} last={i === products.length - 1} />)}
      </ScrollView>
      <CartBar />
      <LocationPicker visible={picking} onClose={() => setPicking(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tabs: { flexDirection: 'row', gap: 22, borderBottomWidth: 1, borderBottomColor: '#E7DDD5', marginTop: 8 },
  tab: { paddingVertical: 10, minHeight: 44, justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent', marginBottom: -1 },
  tabOn: { borderBottomColor: colors.brand },
});
