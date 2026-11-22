// Konfiguracja Expo budowana z brand/brand.json — tu nic nie zmieniasz przy nowej apce.
const brand = require('./brand/brand.json');

module.exports = {
  expo: {
    name: brand.nazwa,
    slug: brand.slug,
    version: brand.wersja,
    scheme: brand.slug,
    orientation: 'portrait',
    icon: './brand/ikona.png',
    userInterfaceStyle: 'light',
    ios: {
      supportsTablet: true,
      bundleIdentifier: brand.identyfikatorAplikacji,
    },
    android: {
      package: brand.identyfikatorAplikacji,
      adaptiveIcon: {
        backgroundColor: brand.kolorTlaIkonyAndroid,
        foregroundImage: './brand/android-ikona-przod.png',
        backgroundImage: './brand/android-ikona-tlo.png',
        monochromeImage: './brand/android-ikona-mono.png',
      },
      predictiveBackGestureEnabled: false,
    },
    web: { favicon: './brand/favicon.png' },
    plugins: [
      'expo-router',
      'expo-font',
      ['expo-splash-screen', { image: './brand/ikona-ekranu-startowego.png', backgroundColor: brand.kolorEkranuStartowego, imageWidth: 200 }],
    ],
  },
};
