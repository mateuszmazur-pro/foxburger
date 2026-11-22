import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

const STEP = 14;
const DEPTH = 7;

/** Ząbkowana krawędź kuponu: `top` – ząbki w górę, `bottom` – ząbki w dół. */
export function ZigEdge({ color, side }: { color: string; side: 'top' | 'bottom' }) {
  const [w, setW] = useState(0);
  const pts: string[] = [];
  if (w > 0) {
    const n = Math.ceil(w / STEP);
    const tip = side === 'top' ? 0 : DEPTH + 1;
    const valley = side === 'top' ? DEPTH : 1;
    const base = side === 'top' ? DEPTH + 1 : 0;
    pts.push(`0 ${base}`, `0 ${valley}`);
    for (let i = 0; i < n; i++) pts.push(`${i * STEP + STEP / 2} ${tip}`, `${(i + 1) * STEP} ${valley}`);
    pts.push(`${n * STEP} ${base}`);
  }
  return (
    <View style={{ height: DEPTH + 1 }} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w > 0 && (
        <Svg width={w} height={DEPTH + 1}>
          <Polygon points={pts.join(' ')} fill={color} />
        </Svg>
      )}
    </View>
  );
}
