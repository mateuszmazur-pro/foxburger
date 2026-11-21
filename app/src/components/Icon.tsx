import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName = 'home' | 'menu' | 'qr' | 'tag' | 'user' | 'bag' | 'pin' | 'chevronDown' | 'back' | 'close' | 'plus' | 'minus' | 'check' | 'phone' | 'nav' | 'clock' | 'fries';

type Props = { name: IconName; size?: number; color?: string; strokeWidth?: number };

export function Icon({ name, size = 22, color = '#1C1917', strokeWidth = 2 }: Props) {
  const p = { stroke: color, strokeWidth, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'home' && <Path d="M4 11l8-7 8 7v9H4z" {...p} />}
      {name === 'menu' && <Path d="M5 6h14M5 12h14M5 18h14" {...p} />}
      {name === 'qr' && (
        <>
          <Rect x={4} y={4} width={6} height={6} rx={1} {...p} />
          <Rect x={14} y={4} width={6} height={6} rx={1} {...p} />
          <Rect x={4} y={14} width={6} height={6} rx={1} {...p} />
          <Path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" {...p} />
        </>
      )}
      {name === 'tag' && (
        <>
          <Path d="M3 12V4h8l10 10-8 8z" {...p} />
          <Circle cx={7.5} cy={8.5} r={1.5} {...p} />
        </>
      )}
      {name === 'user' && (
        <>
          <Circle cx={12} cy={8} r={4} {...p} />
          <Path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" {...p} />
        </>
      )}
      {name === 'bag' && <Path d="M6 7h12l-1 13H7L6 7zM9 7a3 3 0 0 1 6 0" {...p} />}
      {name === 'pin' && (
        <>
          <Path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" {...p} />
          <Circle cx={12} cy={9.5} r={2.5} {...p} />
        </>
      )}
      {name === 'chevronDown' && <Path d="M6 9l6 6 6-6" {...p} />}
      {name === 'back' && <Path d="M15 6l-6 6 6 6" {...p} />}
      {name === 'close' && <Path d="M6 6l12 12M18 6L6 18" {...p} />}
      {name === 'plus' && <Path d="M12 5v14M5 12h14" {...p} />}
      {name === 'minus' && <Path d="M5 12h14" {...p} />}
      {name === 'check' && <Path d="M5 12l5 5 9-10" {...p} />}
      {name === 'phone' && <Path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" {...p} />}
      {name === 'nav' && <Path d="M3 11l18-8-8 18-2-8z" {...p} />}
      {name === 'clock' && (
        <>
          <Circle cx={12} cy={12} r={8} {...p} />
          <Path d="M12 8v4l3 2" {...p} />
        </>
      )}
      {name === 'fries' && <Path d="M6 10h12l-1.5 10h-9zM8 10V4M11 10V3M14 10V4M17 10V5" {...p} />}
    </Svg>
  );
}
