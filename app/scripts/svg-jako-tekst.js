// Transformer Metro: plik .svg zamienia na moduł eksportujący jego treść jako tekst.
const upstream = require(
  require.resolve('@expo/metro-config/babel-transformer', { paths: [require.resolve('expo/package.json')] }),
);

module.exports.transform = (props) => {
  if (props.filename.endsWith('.svg')) {
    return upstream.transform({ ...props, src: `module.exports = ${JSON.stringify(props.src)};` });
  }
  return upstream.transform(props);
};
