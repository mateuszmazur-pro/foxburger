import { Text } from 'react-native';

/** Przecinek w Plus Jakarta ma szeroki lewy margines – dosuwamy go do cyfry przed nim („0,5” zamiast „0 ,5”). */
export function tightComma(text: string) {
  return text.split(/(\d,)/).map((part, i) =>
    /^\d,$/.test(part)
      ? <Text key={i}><Text style={{ letterSpacing: -1.8 }}>{part[0]}</Text>,</Text>
      : part,
  );
}
