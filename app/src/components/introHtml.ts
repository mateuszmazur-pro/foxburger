/** Strona HTML dla WebView: wyśrodkowane animowane SVG na pełnym ekranie. */
export function introHtml(svg: string, bg: string): string {
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<style>html,body{margin:0;height:100%;background:${bg};overflow:hidden}body{display:flex;align-items:center;justify-content:center}svg{width:62vw;max-width:320px;height:auto}</style>
</head><body>${svg}</body></html>`;
}
