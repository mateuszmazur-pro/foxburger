import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { Intro } from '../components/Intro';
import { tenant } from '../tenant';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import { CartProvider } from '../cart/CartContext';
import { LocationProvider } from '../state/LocationContext';
import { OrdersProvider } from '../orders/OrdersContext';
import { colors } from '../theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useFonts({ PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold });
  const [introDone, setIntroDone] = useState(!tenant.introSvg);
  const hideSplash = useCallback(() => { SplashScreen.hideAsync().catch(() => {}); }, []);
  const finishIntro = useCallback(() => setIntroDone(true), []);
  useEffect(() => { if (loaded && !tenant.introSvg) hideSplash(); }, [loaded, hideSplash]);
  if (!loaded) return null;
  return (
    <LocationProvider>
      <CartProvider>
        <OrdersProvider>
          {!introDone && <StatusBar style="light" />}
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="produkt/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="koszyk" />
            <Stack.Screen name="zamowienie/[id]" options={{ gestureEnabled: false }} />
          </Stack>
          {!introDone && <Intro onReady={hideSplash} onDone={finishIntro} />}
        </OrdersProvider>
      </CartProvider>
    </LocationProvider>
  );
}
