import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { tenant } from '../tenant';
import { colors } from '../theme';
import { introHtml } from './introHtml';

const SHOW_MS = 2700; // animacja w SVG kończy się ok. 2,4 s
const FADE_MS = 350;

/** Animowane intro nad aplikacją; po zakończeniu znika. `onReady` — gdy WebView się wczytał (wtedy chowamy natywny splash). */
export function Intro({ onReady, onDone }: { onReady: () => void; onDone: () => void }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: FADE_MS, useNativeDriver: true }).start(() => onDone());
    }, SHOW_MS);
    return () => clearTimeout(t);
  }, [loaded, onDone, opacity]);

  // Gdyby WebView się nie wczytał, nie blokujemy aplikacji.
  useEffect(() => {
    const t = setTimeout(() => { if (!loaded) { onReady(); onDone(); } }, 4000);
    return () => clearTimeout(t);
  }, [loaded, onDone, onReady]);

  if (!tenant.introSvg) return null;
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.wrap, { opacity }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: introHtml(tenant.introSvg, colors.dark) }}
        style={styles.web}
        scrollEnabled={false}
        onLoadEnd={() => { setLoaded(true); onReady(); }}
        javaScriptEnabled={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.dark, zIndex: 100 },
  web: { flex: 1, backgroundColor: colors.dark },
});
