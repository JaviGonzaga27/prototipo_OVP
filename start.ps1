# Script para iniciar Frontend y Backend del Sistema OVP
# PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sistema de Orientacion Vocacional" -ForegroundColor Cyan
Write-Host "  Iniciando Servidores..." -ForegroundColor Cyan
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
    $continue = Read-Host "¿Deseas continuar de todas formas? (s/n)"
    if ($continue -ne "s") {
        exit
    }
} else {
    Write-Host "MongoDB está corriendo correctamente." -ForegroundColor Green
}

Write-Host ""
Write-Host "Iniciando Backend en puerto 5000..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

Start-Sleep -Seconds 3

Write-Host "Iniciando Frontend en puerto 5173..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Servidores Iniciados!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Credenciales de Admin:" -ForegroundColor Yellow
Write-Host "  Email: admin@ovp.com" -ForegroundColor White
Write-Host "  Pass:  admin123" -ForegroundColor White
Write-Host ""
Write-Host "Para detener los servidores, cierra las ventanas de terminal." -ForegroundColor Gray
Write-Host ""
