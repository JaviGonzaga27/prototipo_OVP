# Script para iniciar SOLO el Backend del Sistema OVP
# PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Backend OVP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si MongoDB está corriendo
Write-Host "Verificando MongoDB..." -ForegroundColor Yellow
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if ($null -eq $mongoRunning) {
    Write-Host "ADVERTENCIA: MongoDB no está corriendo." -ForegroundColor Red
    Write-Host "Por favor, inicia MongoDB antes de continuar." -ForegroundColor Red
    Write-Host "En Windows, ejecuta: mongod --dbpath=C:\data\db" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
} else {
    Write-Host "MongoDB está corriendo correctamente." -ForegroundColor Green
}

Write-Host ""
Write-Host "Iniciando Backend en puerto 5000..." -ForegroundColor Yellow
Write-Host ""

cd backend
npm run dev
