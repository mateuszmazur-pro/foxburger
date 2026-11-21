import { Tabs } from 'expo-router';
import { TabBar } from '../../components/TabBar';
import { colors } from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="menu" />
      <Tabs.Screen name="kod" />
      <Tabs.Screen name="promocje" />
      <Tabs.Screen name="konto" />
    </Tabs>
  );
}
