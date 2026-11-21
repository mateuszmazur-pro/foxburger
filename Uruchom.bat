@echo off
chcp 65001 >nul
title Fox Burger - Expo
cd /d "%~dp0"

echo === Fox Burger: pobieram najnowsze zmiany z GitHuba ===
for /f %%i in ('git rev-parse HEAD') do set BEFORE=%%i
git pull
for /f %%i in ('git rev-parse HEAD') do set AFTER=%%i

cd app
rem Biblioteki instalujemy, gdy package-lock.json rozni sie od zapamietanej kopii
rem (dziala tez, gdy zmiany sciagnal wczesniej Auto-pull).
fc /b package-lock.json node_modules\.fox-lock >nul 2>&1
if errorlevel 1 (
  echo === Instaluje biblioteki ===
  call npm install
  copy /y package-lock.json node_modules\.fox-lock >nul
)

echo === Wlaczam automatyczne pobieranie zmian co 15 sekund (osobne okno) ===
start "Fox Burger - auto pull" /min cmd /c "%~dp0Auto-pull.bat"

echo === Startuje Expo. Zeskanuj kod QR w Expo Go. Zamknij to okno, zeby zatrzymac. ===
call npx expo start
