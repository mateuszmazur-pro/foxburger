@echo off
chcp 65001 >nul
title Fox Burger - auto pull
cd /d "%~dp0"
:loop
git pull --quiet
timeout /t 15 /nobreak >nul
goto loop
