// To samo dla testów (Jest): .svg -> tekst.
module.exports = {
  process(src) {
    return { code: `module.exports = ${JSON.stringify(src)};` };
  },
};
