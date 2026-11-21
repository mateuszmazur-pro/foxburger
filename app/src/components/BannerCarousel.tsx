import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { formatPLN } from '../format';
import { BannerSlide } from '../tenant';
import { colors } from '../theme';
import { Txt } from './Txt';

const INTERVAL = 6000;

export function BannerCarousel({ slides }: { slides: BannerSlide[] }) {
  const { width: screenW } = useWindowDimensions();
  const width = screenW - 40;
  const ref = useRef<FlatList<BannerSlide>>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % slides.length;
        ref.current?.scrollToOffset({ offset: next * width, animated: true });
        return next;
      });
    }, INTERVAL);
    return () => clearInterval(t);
  }, [paused, slides.length, width]);

  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
    setPaused(false);
  };

  return (
    <View>
      <FlatList
        ref={ref}
        data={slides}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => setPaused(true)}
        onMomentumScrollEnd={onEnd}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => <Slide slide={item} width={width} />}
      />
      <View style={styles.dots}>
        {slides.map((s, i) => (
          <Pressable key={s.id} accessibilityRole="button" accessibilityLabel={`Slajd ${i + 1}: ${s.title}`} hitSlop={10}
            onPress={() => { setIndex(i); ref.current?.scrollToOffset({ offset: i * width, animated: true }); }}
            style={[styles.dot, { width: i === index ? 22 : 8, backgroundColor: i === index ? colors.brand : '#D6CFC8' }]} />
        ))}
      </View>
    </View>
  );
}

function Slide({ slide, width }: { slide: BannerSlide; width: number }) {
  const open = () => slide.productId && router.push(`/produkt/${slide.productId}`);
  return (
    <View style={{ width, gap: 10 }}>
      <View style={{ gap: 4 }}>
        <Txt w="bold" size={11} color={colors.brandDark} style={{ letterSpacing: 2 }}>{slide.label}</Txt>
        <Txt w="extrabold" size={32} style={{ letterSpacing: -0.6 }} numberOfLines={1} adjustsFontSizeToFit>{slide.title}</Txt>
        <Txt size={14} color={colors.muted} numberOfLines={2} style={{ lineHeight: 20 }}>{slide.description}</Txt>
      </View>
      <Image source={slide.image} resizeMode="contain" style={{ width, height: 190 }} accessibilityLabel={slide.title} />
      <View style={styles.priceRow}>
        <View>
          {slide.price !== undefined && (
            <>
              <Txt w="medium" size={12} color={colors.muted}>{slide.priceLabel}</Txt>
              <Txt w="extrabold" size={26}>{formatPLN(slide.price)}</Txt>
            </>
          )}
        </View>
        <Pressable accessibilityRole="button" onPress={open} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}>
          <Txt w="bold" size={15} color="#FFFFFF">{slide.cta}</Txt>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { height: 8, borderRadius: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cta: {
    height: 52, paddingHorizontal: 34, borderRadius: 26, backgroundColor: colors.brand, justifyContent: 'center',
    shadowColor: colors.brand, shadowOpacity: 0.28, shadowRadius: 12, shadowOffset: { width: 0, height: 10 }, elevation: 4,
  },
});
