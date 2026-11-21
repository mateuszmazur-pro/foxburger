import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { Icon, IconName } from './Icon';
import { Txt } from './Txt';

const TABS: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Start', icon: 'home' },
  menu: { label: 'Menu', icon: 'menu' },
  kod: { label: 'Mój kod', icon: 'qr' },
  promocje: { label: 'Promocje', icon: 'tag' },
  konto: { label: 'Konto', icon: 'user' },
};

export const TAB_BAR_HEIGHT = 66;
export function useTabBarSpace() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + Math.max(insets.bottom, 18) + 16;
}

export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { bottom: Math.max(insets.bottom, 18) }]}>
      {state.routes.map((route, i) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        const active = state.index === i;
        const color = active ? colors.navActive : colors.navIdle;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
            onPress={() => { if (!active) navigateToTab(route.key); }}
            style={styles.item}
          >
            <Icon name={tab.icon} size={21} color={color} />
            <Txt w={active ? 'bold' : 'semibold'} size={10} color={color}>{tab.label}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute', left: 14, right: 14, height: TAB_BAR_HEIGHT, borderRadius: TAB_BAR_HEIGHT / 2,
    backgroundColor: colors.dark, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#1C1917', shadowOpacity: 0.25, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 10,
  },
  item: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center', gap: 3 },
});
