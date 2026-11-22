import { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Path, SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { logoAspect, tenant } from '../tenant';
import { colors } from '../theme';
import { toothPath } from './toothPath';

export const LOGO_SIZE = 162;
const DEPTH = 12;
const LOGO_HEIGHT = LOGO_SIZE * logoAspect(tenant.logoSvg);

/** Ciemny nagłówek z ząbkami; środek logo leży na dnie wcięcia pod środkiem ekranu. */
export function ToothedHeader({ left, right }: { left?: ReactNode; right?: ReactNode }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const height = Math.max(insets.top, 20) + 90;
  const valley = height - DEPTH;
  return (
    <View style={{ height, zIndex: 2 }}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Path d={toothPath(width, height, 26, DEPTH)} fill={colors.dark} />
      </Svg>
      <View style={[styles.row, { top: Math.max(insets.top, 20) + 4 }]}>
        <View>{left}</View>
        <View>{right}</View>
      </View>
      <View pointerEvents="none" style={[styles.logo, { top: valley - LOGO_HEIGHT / 2, left: width / 2 - LOGO_SIZE / 2 }]}>
        <SvgXml xml={tenant.logoSvg} width={LOGO_SIZE} height={LOGO_HEIGHT} />
      </View>
    </View>
  );
}

/** Ile miejsca zostawić pod nagłówkiem, żeby treść nie weszła pod logo. */
export const BELOW_HEADER = LOGO_SIZE / 2 + 18;

const styles = StyleSheet.create({
  row: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { position: 'absolute', width: LOGO_SIZE, height: LOGO_HEIGHT },
});
