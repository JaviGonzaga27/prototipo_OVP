# Script para crear el usuario administrador
# PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Crear Usuario Administrador" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si MongoDB está corriendo
Write-Host "Verificando MongoDB..." -ForegroundColor Yellow
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if ($null -eq $mongoRunning) {
    Write-Host "ERROR: MongoDB no está corriendo." -ForegroundColor Red
    Write-Host "Por favor, inicia MongoDB antes de continuar." -ForegroundColor Red
    Write-Host "En Windows, ejecuta: mongod --dbpath=C:\data\db" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
} else {
    Write-Host "MongoDB está corriendo correctamente." -ForegroundColor Green
}

Write-Host ""
Write-Host "Creando usuario administrador..." -ForegroundColor Yellow
Write-Host ""

cd backend
node createAdmin.js

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
