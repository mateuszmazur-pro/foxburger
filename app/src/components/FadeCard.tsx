import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme';

/** Blok bez tła po lewej (pod zdjęciami z beżowym tłem), przechodzący w biel w prawo. */
export function FadeCard({ children }: { children: ReactNode }) {
  return (
    <View style={styles.card}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="fadeCard" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colors.card} stopOpacity={0} />
            <Stop offset="0.18" stopColor={colors.card} stopOpacity={0} />
            <Stop offset="0.7" stopColor={colors.card} stopOpacity={1} />
            <Stop offset="1" stopColor={colors.card} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#fadeCard)" />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, padding: 16, overflow: 'hidden' },
});
