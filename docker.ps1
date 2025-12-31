# Script de PowerShell para facilitar comandos Docker en Windows
# Uso: .\docker.ps1 <comando>

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "Comandos disponibles para Docker OVP:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  .\docker.ps1 build          - Construir todas las imágenes" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 up             - Levantar todos los servicios (producción)" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 down           - Detener todos los servicios" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 restart        - Reiniciar todos los servicios" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 logs           - Ver logs de todos los servicios" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 clean          - Limpiar contenedores, volúmenes e imágenes" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 dev            - Levantar en modo desarrollo" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 prod           - Levantar en modo producción" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 init-db        - Inicializar/reinicializar base de datos" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 backup         - Hacer backup de la base de datos" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 restore        - Restaurar backup de la base de datos" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 shell-backend  - Acceder a shell del backend" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 shell-db       - Acceder a psql de la base de datos" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 test-ml        - Probar el servicio ML" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 status         - Ver estado de los servicios" -ForegroundColor Yellow
    Write-Host ""
}

switch ($Command.ToLower()) {
    "help" {
        Show-Help
    }
    "build" {
        Write-Host "Construyendo imágenes..." -ForegroundColor Green
        docker-compose build
    }
    "build-clean" {
        Write-Host "Construyendo imágenes sin cache..." -ForegroundColor Green
        docker-compose build --no-cache
    }
    "up" {
        Write-Host "Levantando servicios en modo producción..." -ForegroundColor Green
        docker-compose up -d
    }
    "up-logs" {
        Write-Host "Levantando servicios con logs..." -ForegroundColor Green
        docker-compose up
    }
    "down" {
        Write-Host "Deteniendo servicios..." -ForegroundColor Green
        docker-compose down
    }
    "down-volumes" {
        Write-Host "Deteniendo servicios y eliminando volúmenes..." -ForegroundColor Red
        $confirm = Read-Host "¿Estás seguro? Esto eliminará la base de datos (s/n)"
        if ($confirm -eq "s") {
            docker-compose down -v
        }
    }
    "restart" {
        Write-Host "Reiniciando servicios..." -ForegroundColor Green
        docker-compose restart
    }
    "logs" {
        Write-Host "Mostrando logs..." -ForegroundColor Green
        docker-compose logs -f
    }
    "logs-backend" {
        Write-Host "Mostrando logs del backend..." -ForegroundColor Green
        docker-compose logs -f backend
    }
    "logs-frontend" {
        Write-Host "Mostrando logs del frontend..." -ForegroundColor Green
        docker-compose logs -f frontend
    }
    "logs-db" {
        Write-Host "Mostrando logs de la base de datos..." -ForegroundColor Green
        docker-compose logs -f database
    }
    "clean" {
        Write-Host "Limpiando todo..." -ForegroundColor Red
        $confirm = Read-Host "¿Estás seguro? Esto eliminará contenedores, volúmenes e imágenes (s/n)"
        if ($confirm -eq "s") {
            docker-compose down -v
            docker system prune -af
        }
    }
    "dev" {
        Write-Host "Levantando en modo desarrollo..." -ForegroundColor Green
        docker-compose -f docker-compose.dev.yml up
    }
    "dev-build" {
        Write-Host "Construyendo y levantando en modo desarrollo..." -ForegroundColor Green
        docker-compose -f docker-compose.dev.yml up --build
    }
    "prod" {
        Write-Host "Construyendo y levantando en modo producción..." -ForegroundColor Green
        docker-compose build
        docker-compose up -d
    }
    "init-db" {
        Write-Host "Inicializando base de datos..." -ForegroundColor Green
        docker-compose exec backend npm run init-db
    }
    "shell-backend" {
        Write-Host "Accediendo a shell del backend..." -ForegroundColor Green
        docker-compose exec backend sh
    }
    "shell-db" {
        Write-Host "Accediendo a PostgreSQL..." -ForegroundColor Green
        docker-compose exec database psql -U postgres -d ovp_database
    }
    "status" {
        Write-Host "Estado de los servicios:" -ForegroundColor Green
        docker-compose ps
    }
    "stats" {
        Write-Host "Uso de recursos:" -ForegroundColor Green
        docker stats
    }
    "backup" {
        Write-Host "Creando backup de la base de datos..." -ForegroundColor Green
        if (!(Test-Path "backups")) {
            New-Item -ItemType Directory -Path "backups" | Out-Null
        }
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupFile = "backups/backup_$timestamp.sql"
        docker-compose exec -T database pg_dump -U postgres ovp_database > $backupFile
        Write-Host "Backup creado: $backupFile" -ForegroundColor Green
    }
    "restore" {
        Write-Host "Restaurando backup..." -ForegroundColor Green
        $backups = Get-ChildItem "backups/*.sql" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
        if ($backups.Count -eq 0) {
            Write-Host "No hay backups disponibles" -ForegroundColor Red
            exit 1
        }
        $latest = $backups[0]
        Write-Host "Restaurando $($latest.Name)..." -ForegroundColor Yellow
        Get-Content $latest.FullName | docker-compose exec -T database psql -U postgres ovp_database
        Write-Host "Backup restaurado exitosamente" -ForegroundColor Green
    }
    "test-ml" {
        Write-Host "Probando servicio ML..." -ForegroundColor Green
        docker-compose exec backend python ml/test_predict.py
    }
    "python-version" {
        Write-Host "Versión de Python en el backend:" -ForegroundColor Green
        docker-compose exec backend python --version
    }
    "python-packages" {
        Write-Host "Paquetes de Python instalados:" -ForegroundColor Green
        docker-compose exec backend pip3 list
    }
    "rebuild-backend" {
        Write-Host "Reconstruyendo backend..." -ForegroundColor Green
        docker-compose build --no-cache backend
        docker-compose up -d backend
    }
    "rebuild-frontend" {
        Write-Host "Reconstruyendo frontend..." -ForegroundColor Green
        docker-compose build --no-cache frontend
        docker-compose up -d frontend
    }
    "health" {
        Write-Host "Verificando salud de los servicios..." -ForegroundColor Green
        try {
            $backend = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 5
            Write-Host "✓ Backend: OK" -ForegroundColor Green
        } catch {
            Write-Host "✗ Backend: No responde" -ForegroundColor Red
        }
        try {
            $frontend = Invoke-WebRequest -Uri "http://localhost/" -UseBasicParsing -TimeoutSec 5
            Write-Host "✓ Frontend: OK" -ForegroundColor Green
        } catch {
            Write-Host "✗ Frontend: No responde" -ForegroundColor Red
        }
        try {
            docker-compose exec database pg_isready -U postgres | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ Database: OK" -ForegroundColor Green
            } else {
                Write-Host "✗ Database: No responde" -ForegroundColor Red
            }
        } catch {
            Write-Host "✗ Database: No responde" -ForegroundColor Red
        }
    }
    default {
        Write-Host "Comando no reconocido: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}
