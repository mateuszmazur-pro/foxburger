@echo off
chcp 65001 >nul
title Fox Burger - auto pull
cd /d "%~dp0"
:loop
git pull --quiet
cd app
fc /b package-lock.json node_modules\.fox-lock >nul 2>&1
if errorlevel 1 (
  echo === Doszly nowe biblioteki: instaluje ===
  call npm install
  copy /y package-lock.json node_modules\.fox-lock >nul
)
cd ..
timeout /t 15 /nobreak >nul
goto loop
