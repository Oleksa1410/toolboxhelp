@echo off
chcp 65001 > nul
echo ========================================
echo   СИНХРОНІЗАЦІЯ ТА ВІДПРАВКА
echo ========================================

:input
set /p msg="Введіть коментар до змін: "
if "%msg%"=="" goto :input

echo --- Оновлення локальних файлів з GitHub...
git pull origin main

echo --- Підготовка та коміт...
git add .
git commit -m "%msg%"

echo --- Відправка в репозиторій...
git push origin main

echo.
echo ========================================
echo   ГОТОВО!
echo ========================================
pause