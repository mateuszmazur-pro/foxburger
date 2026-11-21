/** Kwota w groszach → „39 zł” / „39,50 zł”. */
export function formatPLN(grosze: number): string {
  const zl = Math.floor(grosze / 100);
  const gr = grosze % 100;
  return gr === 0 ? `${zl} zł` : `${zl},${String(gr).padStart(2, '0')} zł`;
}
