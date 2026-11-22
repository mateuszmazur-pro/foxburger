// Pozwala robić `import logo from './logo.svg'` — plik SVG trafia do kodu jako tekst.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.transformer.babelTransformerPath = require.resolve('./scripts/svg-jako-tekst.js');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = config;
