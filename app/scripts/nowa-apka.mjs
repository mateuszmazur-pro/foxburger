#!/usr/bin/env node
// Duplikuje całą aplikację pod nową restaurację.
//
//   npm run nowa-apka -- "Kowal Burger"
//   npm run nowa-apka -- "Kowal Burger" --folder ~/Projekty/kowal-burger --id pl.kowalburger.app
//
// Tworzy niezależną kopię repozytorium (bez node_modules i historii git), ustawia nazwę,
// slug i identyfikator aplikacji w brand/brand.json oraz package.json, i robi pierwszy commit.
// Logo, ikony, kolory i menu zostają jak w oryginale — podmieniasz je w folderze brand/.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoDir = path.resolve(appDir, '..');

const POMIJANE = new Set(['.git', 'node_modules', '.expo', 'dist', 'web-build', 'ios', 'android', 'docs']);

function blad(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

export function zrobSlug(nazwa) {
  return nazwa
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function zrobIdentyfikator(slug) {
  let czlon = slug.replace(/-/g, '');
  if (/^[0-9]/.test(czlon)) czlon = `app${czlon}`;
  return `pl.${czlon}.app`;
}

function argumenty(argv) {
  const out = { nazwa: undefined, folder: undefined, id: undefined, git: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--folder') out.folder = argv[++i];
    else if (a === '--id') out.id = argv[++i];
    else if (a === '--bez-git') out.git = false;
    else if (a.startsWith('--')) blad(`Nieznana opcja: ${a}`);
    else if (!out.nazwa) out.nazwa = a;
    else blad(`Nazwę w cudzysłowie, np. "Kowal Burger" (dostałem też: ${a})`);
  }
  return out;
}

function edytujJson(plik, zmiana) {
  const dane = JSON.parse(fs.readFileSync(plik, 'utf8'));
  zmiana(dane);
  fs.writeFileSync(plik, `${JSON.stringify(dane, null, 2)}\n`);
}

function main() {
  const { nazwa, folder, id, git } = argumenty(process.argv.slice(2));
  if (!nazwa) blad('Podaj nazwę nowej restauracji, np.: npm run nowa-apka -- "Kowal Burger"');

  const slug = zrobSlug(nazwa);
  if (!slug) blad(`Z nazwy „${nazwa}” nie da się zrobić sluga — użyj liter lub cyfr.`);
  const identyfikator = id ?? zrobIdentyfikator(slug);
  if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/.test(identyfikator)) {
    blad(`Identyfikator „${identyfikator}” jest niepoprawny. Wzór: pl.nazwa.app (małe litery, cyfry, kropki).`);
  }

  const cel = path.resolve((folder ?? path.join(repoDir, '..', slug)).replace(/^~(?=$|\/)/, os.homedir()));
  if (cel === repoDir || cel.startsWith(`${repoDir}${path.sep}`)) blad('Folder docelowy nie może być wewnątrz obecnego projektu.');
  if (fs.existsSync(cel)) blad(`Folder ${cel} już istnieje. Wybierz inny przez --folder.`);

  const zrodlo = JSON.parse(fs.readFileSync(path.join(appDir, 'brand', 'brand.json'), 'utf8'));

  fs.cpSync(repoDir, cel, {
    recursive: true,
    filter: (src) => {
      const rel = path.relative(repoDir, src);
      if (!rel) return true;
      return !rel.split(path.sep).some((czesc) => POMIJANE.has(czesc));
    },
  });

  const nowaApp = path.join(cel, 'app');
  edytujJson(path.join(nowaApp, 'brand', 'brand.json'), (b) => {
    b.nazwa = nazwa;
    b.slug = slug;
    b.identyfikatorAplikacji = identyfikator;
    b.wersja = '1.0.0';
  });
  edytujJson(path.join(nowaApp, 'package.json'), (p) => {
    p.name = slug;
  });
  const lock = path.join(nowaApp, 'package-lock.json');
  if (fs.existsSync(lock)) {
    edytujJson(lock, (l) => {
      l.name = slug;
      if (l.packages?.['']) l.packages[''].name = slug;
    });
  }
  const readme = path.join(cel, 'README.md');
  if (fs.existsSync(readme)) {
    const tresc = fs.readFileSync(readme, 'utf8').replace(/^# .*$/m, `# ${nazwa} — aplikacja mobilna`);
    fs.writeFileSync(readme, tresc);
  }

  let gitInfo = '';
  if (git) {
    try {
      const g = (...a) => execFileSync('git', a, { cwd: cel, stdio: 'pipe' });
      g('init', '-q', '-b', 'main');
      g('add', '-A');
      g('commit', '-q', '-m', `Nowa aplikacja ${nazwa} (kopia ${zrodlo.nazwa})`);
      gitInfo = '  git:            nowe repozytorium z pierwszym commitem (gałąź main)\n';
    } catch {
      gitInfo = '  git:            nie udało się zrobić commita — zrób go ręcznie\n';
    }
  }

  console.log(`
✔ Gotowe: ${nazwa}

  folder:         ${cel}
  slug:           ${slug}
  identyfikator:  ${identyfikator}   (App Store i Google Play — po publikacji nie da się zmienić)
${gitInfo}
Skopiowane z: ${zrodlo.nazwa}. Teraz podmień w ${path.join(cel, 'app', 'brand')}:
  1. logo.svg                       logo
  2. ikona.png + android-ikona-*.png + ikona-ekranu-startowego.png + favicon.png
  3. brand.json → "kolory"          kolory (brand = kolor akcentu)
  4. restauracja.ts                 lokale, menu, ceny, banery, nazwa programu lojalnościowego, teksty
  5. zdjecia/                       zdjęcia produktów

Podgląd:
  cd "${nowaApp}"
  npm install
  npm test          # sprawdzi, czy w brand/ wszystko się zgadza
  npx expo start
`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
