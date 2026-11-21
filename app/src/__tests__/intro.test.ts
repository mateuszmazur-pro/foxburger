import { introHtml } from '../components/introHtml';

test('strona intro zawiera SVG, kolor tła i blokadę powiększania', () => {
  const html = introHtml('<svg id="x"></svg>', '#1C1917');
  expect(html).toContain('<svg id="x"></svg>');
  expect(html).toContain('background:#1C1917');
  expect(html).toContain('user-scalable=no');
});
