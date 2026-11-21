import { Text, TextProps } from 'react-native';
import { colors, fonts } from '../theme';

type Weight = keyof typeof fonts;
type Props = TextProps & { w?: Weight; size?: number; color?: string };

export function Txt({ w = 'regular', size = 14, color = colors.text, style, ...rest }: Props) {
  return <Text {...rest} style={[{ fontFamily: fonts[w], fontSize: size, color }, style]} />;
}
