import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { colors, shadow } from '../theme';

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ backgroundColor: colors.card, borderRadius: 22, padding: 16 }, shadow, { shadowOpacity: 0.05 }, style]}>{children}</View>;
}
