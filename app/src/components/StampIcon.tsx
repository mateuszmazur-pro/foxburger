import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import type { StampSlot } from '../loyalty/stamps';
import { tenant } from '../tenant';
import { colors } from '../theme';
import { Txt } from './Txt';

const EMPTY = '#57534E';
const ICON_OFF = '#44403C';
const ICON_REWARD = '#78716C';
const ICON_W = 1071.16;

/** Ikona marki (np. burger) wpisana w pole 40×40. */
function Mark({ d, color, x, y, w }: { d: string; color: string; x: number; y: number; w: number }) {
  const k = w / ICON_W;
  return (
    <G transform={`translate(${x} ${y}) scale(${k})`}>
      <Path d={d} fill={color} />
    </G>
  );
}

/** Jedno pole karty pieczątek: zebrana (kolor marki), połówka, niezebrana (szara), nagroda (złota). */
export function StampIcon({ slot, size = 44 }: { slot: StampSlot; size?: number }) {
  const clipId = `half-${useId().replace(/:/g, '')}`;
  const d = tenant.stampPath;
  if (d) {
    const big = { d, x: 2, y: 3, w: 36 };
    if (slot === 'reward') {
      return (
        <View style={{ width: size, height: size }}>
          <Svg width={size} height={size} viewBox="0 0 40 40">
            <Mark {...big} color={ICON_REWARD} />
          </Svg>
          <Txt w="extrabold" size={Math.max(9, size * 0.26)} color={ICON_REWARD} numberOfLines={1} style={{ position: 'absolute', top: size, left: -10, right: -10, textAlign: 'center', letterSpacing: 0.4 }}>
            GRATIS!
          </Txt>
        </View>
      );
    }
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <>
            <Mark {...big} color={slot === 'full' ? colors.stampOn : ICON_OFF} />
            {slot === 'half' && (
              <>
                <Defs>
                  <ClipPath id={clipId}>
                    <Rect x={0} y={0} width={20} height={40} />
                  </ClipPath>
                </Defs>
                <G clipPath={`url(#${clipId})`}>
                  <Mark {...big} color={colors.stampOn} />
                </G>
              </>
            )}
        </>
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      {slot === 'full' && (
        <>
          <Circle cx={10} cy={10} r={9.2} fill={colors.stampOn} />
          <Path d="M6.2 10.4l2.6 2.6 5-5.4" fill="none" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {(slot === 'half' || slot === 'empty') && (
        <Circle cx={10} cy={10} r={8.6} fill="none" stroke={EMPTY} strokeWidth={1.4} strokeDasharray="2 2" />
      )}
      {slot === 'half' && <Path d="M10 .8a9.2 9.2 0 0 0 0 18.4z" fill={colors.stampOn} />}
      {slot === 'reward' && (
        <>
          <Circle cx={10} cy={10} r={8.6} fill="none" stroke={colors.navActive} strokeWidth={1.4} />
          <Path d="M5.5 9h9v6h-9zM5 7h10v2H5zM10 7v8M10 7c-1.5-2.5-4-2-3 0M10 7c1.5-2.5 4-2 3 0" fill="none" stroke={colors.navActive} strokeWidth={1.2} strokeLinejoin="round" />
        </>
      )}
    </Svg>
  );
}
