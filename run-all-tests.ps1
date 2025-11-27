# Script para ejecutar todas las pruebas del sistema OVP
# Autor: Plan de Pruebas - Sistema OVP
# Fecha: Noviembre 2025

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sistema OVP - Suite de Pruebas" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$ErrorCount = 0
$TestsPassed = 0
$TestsFailed = 0

# Función para ejecutar comando y verificar resultado
function Run-Test {
    param (
        [string]$Name,
        [string]$Command,
        [string]$Path = "."
    )
    
    Write-Host "`n>>> Ejecutando: $Name" -ForegroundColor Yellow
    Write-Host "    Ubicación: $Path" -ForegroundColor Gray
    Write-Host "    Comando: $Command`n" -ForegroundColor Gray
    
    Push-Location $Path
    
    try {
        Invoke-Expression $Command
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $Name - PASÓ" -ForegroundColor Green
            $script:TestsPassed++
        } else {
            Write-Host "❌ $Name - FALLÓ" -ForegroundColor Red
            $script:TestsFailed++
            $script:ErrorCount++
        }
    } catch {
        Write-Host "❌ $Name - ERROR: $_" -ForegroundColor Red
        $script:TestsFailed++
        $script:ErrorCount++
    } finally {
        Pop-Location
    }
}

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Debe ejecutar este script desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

# 1. INSTALACIÓN DE DEPENDENCIAS
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  1. INSTALACIÓN DE DEPENDENCIAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias del frontend..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "backend/node_modules")) {
    Write-Host "Instalando dependencias del backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

# 2. PRUEBAS BACKEND
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  2. PRUEBAS BACKEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Run-Test -Name "Autenticación (TC-001 a TC-004)" -Command "npm run test:auth" -Path "backend"
Run-Test -Name "Test Vocacional (TC-005, TC-006, TC-008)" -Command "npm run test:questionnaire" -Path "backend"
Run-Test -Name "Resultados y ML (TC-009 a TC-011)" -Command "npm run test:results" -Path "backend"
Run-Test -Name "Administración (TC-012 a TC-015)" -Command "npm run test:admin" -Path "backend"
Run-Test -Name "Integración API" -Command "npm run test:integration" -Path "backend"

# 3. PRUEBAS DE SEGURIDAD
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  3. PRUEBAS DE SEGURIDAD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Run-Test -Name "Seguridad del Sistema" -Command "npm run test:security" -Path "backend"

# 4. PRUEBAS DE MACHINE LEARNING
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  4. PRUEBAS DE MACHINE LEARNING" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Run-Test -Name "Modelo ML (TC-ML-001 a TC-ML-004)" -Command "npm run test:ml" -Path "backend"

# 5. COBERTURA BACKEND
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  5. COBERTURA DE CÓDIGO - BACKEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Run-Test -Name "Cobertura Backend" -Command "npm run test:coverage" -Path "backend"

# 6. PRUEBAS FRONTEND
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  6. PRUEBAS FRONTEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Solo si hay tests implementados en frontend
if (Test-Path "src/__tests__" -or Test-Path "src/**/*.test.jsx") {
    Run-Test -Name "Tests Frontend" -Command "npm test"
} else {
    Write-Host "⚠️  No hay tests de frontend implementados aún" -ForegroundColor Yellow
}

# 7. PRUEBAS E2E (OPCIONAL - requiere servidores corriendo)
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  7. PRUEBAS E2E (CYPRESS)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$response = Read-Host "¿Ejecutar pruebas E2E? (requiere backend y frontend corriendo) [s/N]"
if ($response -eq "s" -or $response -eq "S") {
    Run-Test -Name "E2E - Autenticación" -Command "npx cypress run --spec 'cypress/e2e/auth.cy.js'"
    Run-Test -Name "E2E - Cuestionario" -Command "npx cypress run --spec 'cypress/e2e/questionnaire.cy.js'"
    Run-Test -Name "E2E - Resultados" -Command "npx cypress run --spec 'cypress/e2e/results.cy.js'"
    Run-Test -Name "E2E - Administración" -Command "npx cypress run --spec 'cypress/e2e/admin.cy.js'"
} else {
    Write-Host "⏭️  Pruebas E2E omitidas" -ForegroundColor Gray
}

# 8. RESUMEN FINAL
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN DE EJECUCIÓN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n📊 Estadísticas:" -ForegroundColor White
Write-Host "   ✅ Tests pasados: $TestsPassed" -ForegroundColor Green
Write-Host "   ❌ Tests fallados: $TestsFailed" -ForegroundColor Red
Write-Host "   📈 Total: $($TestsPassed + $TestsFailed)" -ForegroundColor Cyan

if ($ErrorCount -eq 0) {
    Write-Host "`n🎉 ¡Todas las pruebas pasaron exitosamente!" -ForegroundColor Green
    Write-Host "`n📁 Reportes de cobertura generados en:" -ForegroundColor Cyan
    Write-Host "   - Frontend: coverage/index.html" -ForegroundColor Gray
    Write-Host "   - Backend: backend/coverage/index.html" -ForegroundColor Gray
    exit 0
} else {
    Write-Host "`n⚠️  Algunas pruebas fallaron. Revisar logs arriba." -ForegroundColor Red
    Write-Host "`n💡 Sugerencias:" -ForegroundColor Yellow
    Write-Host "   1. Verificar que la base de datos esté corriendo" -ForegroundColor Gray
    Write-Host "   2. Ejecutar: npm run create-db && npm run init-db" -ForegroundColor Gray
    Write-Host "   3. Revisar variables de entorno en .env" -ForegroundColor Gray
    Write-Host "   4. Verificar que Python y dependencias ML estén instaladas" -ForegroundColor Gray
    exit 1
}
