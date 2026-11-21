import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../cart/CartContext';
import { unitPrice } from '../../cart/cart';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { QtyStepper } from '../../components/QtyStepper';
import { RoundIconButton } from '../../components/RoundIconButton';
import { Txt } from '../../components/Txt';
import { formatPLN } from '../../format';
import { tenant } from '../../tenant';
import { colors, fonts } from '../../theme';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = tenant.products.find((p) => p.id === id);
  const insets = useSafeAreaInsets();
  const { add } = useCart();
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [asSet, setAsSet] = useState(false);
  const [note, setNote] = useState('');
  const [qty, setQty] = useState(1);

  if (!product) {
    return <EmptyState title="Nie znaleziono produktu" text="Ta pozycja nie jest już dostępna w menu." action="Wróć do menu" onAction={() => router.dismissTo('/menu')} />;
  }
  const toggle = (aid: string) => setAddonIds((s) => (s.includes(aid) ? s.filter((x) => x !== aid) : [...s, aid]));
  const sum = unitPrice({ productId: product.id, addonIds, asSet }, tenant.products) * qty;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
        <View style={{ paddingTop: insets.top + 8 }}>
          <Image source={product.image} resizeMode="contain" style={styles.img} accessibilityLabel={product.name} />
          <View style={[styles.topBtns, { top: insets.top + 8 }]}>
            <RoundIconButton icon="back" label="Wróć" onPress={() => router.back()} />
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Txt w="extrabold" size={28} style={{ flex: 1, letterSpacing: -0.5 }}>{product.name}</Txt>
            <Txt w="extrabold" size={24} color={colors.brand}>{formatPLN(product.price)}</Txt>
          </View>
          <Txt size={14} color={colors.muted} style={{ lineHeight: 20 }}>{product.description}</Txt>
          {product.ingredients.length > 0 && (
            <View style={styles.chips}>
              {product.ingredients.map((i) => (
                <View key={i} style={styles.chip}><Txt w="semibold" size={13} color="#44403C">{i}</Txt></View>
              ))}
            </View>
          )}
          {product.addons.length > 0 && (
            <View>
              <Txt w="extrabold" size={16} style={{ marginBottom: 4 }}>Dodatki</Txt>
              {product.addons.map((a, i) => {
                const on = addonIds.includes(a.id);
                return (
                  <Pressable key={a.id} accessibilityRole="checkbox" accessibilityState={{ checked: on }} onPress={() => toggle(a.id)}
                    style={[styles.addon, i < product.addons.length - 1 && styles.line]}>
                    <View style={[styles.box, on && styles.boxOn]}>{on && <Icon name="check" size={14} color="#FFFFFF" strokeWidth={3} />}</View>
                    <Txt w="semibold" size={15} style={{ flex: 1 }}>{a.name}</Txt>
                    <Txt w="semibold" size={14} color={colors.muted}>+ {formatPLN(a.price)}</Txt>
                  </Pressable>
                );
              })}
            </View>
          )}
          {product.setUpgrade && (
            <Card style={styles.setCard}>
              <View style={styles.setIcon}><Icon name="fries" size={26} color={colors.brand} strokeWidth={1.8} /></View>
              <View style={{ flex: 1 }}>
                <Txt w="extrabold" size={15}>Zrób z tego zestaw</Txt>
                <Txt size={12} color={colors.muted}>{product.setUpgrade.label} · + {formatPLN(product.setUpgrade.price)}</Txt>
              </View>
              <Pressable accessibilityRole="switch" accessibilityState={{ checked: asSet }} accessibilityLabel="Zrób z tego zestaw" onPress={() => setAsSet((v) => !v)}
                style={[styles.switch, asSet && { backgroundColor: colors.brand }]} hitSlop={8}>
                <View style={[styles.knob, asSet && { left: 21 }]} />
              </Pressable>
            </Card>
          )}
          <View style={{ gap: 8 }}>
            <Txt w="extrabold" size={16}>Uwagi do zamówienia</Txt>
            <TextInput value={note} onChangeText={setNote} multiline maxLength={200} placeholder="np. bez cebuli, sos osobno, dobrze wysmażone"
              placeholderTextColor="#A8A29E" style={styles.note} accessibilityLabel="Uwagi do zamówienia" />
          </View>
        </View>
      </ScrollView>
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <QtyStepper qty={qty} size="lg" tone="muted" label={product.name} onInc={() => setQty((q) => q + 1)} onDec={() => setQty((q) => Math.max(1, q - 1))} />
        <Pressable accessibilityRole="button" onPress={() => { add({ productId: product.id, addonIds, asSet, note, qty }); router.back(); }} style={styles.addBtn}>
          <Txt w="bold" size={15} color="#FFFFFF">Dodaj · {formatPLN(sum)}</Txt>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  img: { width: '100%', height: 280, marginTop: 8 },
  topBtns: { position: 'absolute', left: 20 },
  body: { paddingHorizontal: 20, gap: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { height: 32, paddingHorizontal: 12, borderRadius: 16, backgroundColor: colors.card, justifyContent: 'center' },
  addon: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 50 },
  line: { borderBottomWidth: 1, borderBottomColor: colors.line },
  box: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: '#D6CFC8', alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  setCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  setIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.brandLight, alignItems: 'center', justifyContent: 'center' },
  switch: { width: 48, height: 30, borderRadius: 15, backgroundColor: '#E7E0D6', justifyContent: 'center' },
  knob: { position: 'absolute', left: 3, width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFFFFF' },
  note: { minHeight: 84, borderRadius: 16, borderWidth: 1, borderColor: '#E7E0D6', backgroundColor: colors.card, padding: 14, fontFamily: fonts.medium, fontSize: 14, color: colors.text, textAlignVertical: 'top' },
  bar: {
    position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 12, alignItems: 'center', paddingHorizontal: 20, paddingTop: 14,
    backgroundColor: colors.card, borderTopLeftRadius: 26, borderTopRightRadius: 26,
    shadowColor: '#1C1917', shadowOpacity: 0.06, shadowRadius: 20, shadowOffset: { width: 0, height: -8 }, elevation: 12,
  },
  addBtn: {
    flex: 1, height: 52, borderRadius: 26, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.brand, shadowOpacity: 0.28, shadowRadius: 12, shadowOffset: { width: 0, height: 10 }, elevation: 4,
  },
});
