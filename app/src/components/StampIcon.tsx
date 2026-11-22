import Svg, { Circle, Path } from 'react-native-svg';
import type { StampSlot } from '../loyalty/stamps';
import { colors } from '../theme';

const EMPTY = '#57534E';

/** Jedno pole karty pieczątek (pełne z ptaszkiem, połówka, puste, nagroda). */
export function StampIcon({ slot, size = 44 }: { slot: StampSlot; size?: number }) {
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
