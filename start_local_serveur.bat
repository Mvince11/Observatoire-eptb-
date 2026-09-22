@echo off
title Observatoire EPTB - Serveur PMTiles

cd /d "%~dp0"

echo.
echo ==========================================
echo   SERVEUR PMTILES - EPTB OBSERVATOIRE
echo ==========================================
echo.
echo Dossier du projet :
echo %CD%
echo.

:: Lancer le serveur Python dans une nouvelle fenêtre
start "Serveur PMTiles" cmd /k python serveur_pmtiles.py

:: Attendre que le serveur soit disponible
timeout /t 2 /nobreak >nul

:: Ouvrir le site dans le navigateur
start "" "http://localhost:8000/"

echo.
echo Le site a ete ouvert dans le navigateur.
echo.
pause