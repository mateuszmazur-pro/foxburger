@echo off
chcp 65001 >nul
title Fox Burger - Expo
cd /d "%~dp0"

echo === Fox Burger: pobieram najnowsze zmiany z GitHuba ===
for /f %%i in ('git rev-parse HEAD') do set BEFORE=%%i
git pull
for /f %%i in ('git rev-parse HEAD') do set AFTER=%%i

cd app
if not exist node_modules (
  echo === Pierwsze uruchomienie: instaluje biblioteki ===
  call npm install
) else (
  git diff --quiet %BEFORE% %AFTER% -- package.json package-lock.json
  if errorlevel 1 (
    echo === Doszly nowe biblioteki: instaluje ===
    call npm install
  )
)

echo === Wlaczam automatyczne pobieranie zmian co 15 sekund (osobne okno) ===
start "Fox Burger - auto pull" /min cmd /c "%~dp0Auto-pull.bat"

echo === Startuje Expo. Zeskanuj kod QR w Expo Go. Zamknij to okno, zeby zatrzymac. ===
call npx expo start
