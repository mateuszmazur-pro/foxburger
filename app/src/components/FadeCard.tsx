import { ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme';

/** Blok bez tła po lewej (pod zdjęciami z beżowym tłem), przechodzący w biel w prawo. */
export function FadeCard({ children }: { children: ReactNode }) {
  // Svg z width/height „100%” w absolutnym widoku nie zawsze łapie pełny rozmiar – mierzymy blok i podajemy liczby.
  const [size, setSize] = useState({ w: 0, h: 0 });
  return (
    <View style={styles.card} onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
      {size.w > 0 && (
      <Svg style={StyleSheet.absoluteFill} width={size.w} height={size.h}>
        <Defs>
          <LinearGradient id="fadeCard" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colors.card} stopOpacity={0} />
            <Stop offset="0.18" stopColor={colors.card} stopOpacity={0} />
            <Stop offset="0.7" stopColor={colors.card} stopOpacity={1} />
            <Stop offset="1" stopColor={colors.card} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={size.w} height={size.h} fill="url(#fadeCard)" />
      </Svg>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, padding: 16, overflow: 'hidden' },
});
