# Script para crear la base de datos PostgreSQL para OVP
# Ejecutar desde PowerShell: .\createDatabase.ps1

Write-Host "`n=== Creador de Base de Datos OVP ===" -ForegroundColor Cyan
Write-Host "Este script creará la base de datos PostgreSQL para el sistema OVP`n" -ForegroundColor Yellow

# Solicitar credenciales
$dbUser = Read-Host "Ingresa el usuario de PostgreSQL (por defecto: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "postgres"
}

$dbPassword = Read-Host "Ingresa la contraseña de PostgreSQL" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

$dbName = Read-Host "Ingresa el nombre de la base de datos (por defecto: ovp_database)"
if ([string]::IsNullOrWhiteSpace($dbName)) {
    $dbName = "ovp_database"
}

Write-Host "`n[1/3] Verificando conexión a PostgreSQL..." -ForegroundColor Cyan

# Verificar si psql está disponible
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psqlPath) {
    Write-Host "ERROR: No se encontró el comando 'psql'. Asegúrate de que PostgreSQL esté instalado y en el PATH." -ForegroundColor Red
    Write-Host "Puedes agregar PostgreSQL al PATH o ejecutar este script desde el directorio bin de PostgreSQL." -ForegroundColor Yellow
    pause
    exit 1
}

# Configurar variable de entorno para la contraseña
$env:PGPASSWORD = $dbPasswordPlain

# Intentar conectar a PostgreSQL
$testConnection = & psql -U $dbUser -d postgres -c "SELECT version();" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo conectar a PostgreSQL. Verifica las credenciales." -ForegroundColor Red
    Write-Host "Detalles: $testConnection" -ForegroundColor Red
    Remove-Item Env:\PGPASSWORD
    pause
    exit 1
}

Write-Host "✅ Conexión exitosa a PostgreSQL`n" -ForegroundColor Green

Write-Host "[2/3] Creando base de datos '$dbName'..." -ForegroundColor Cyan

# Verificar si la base de datos ya existe
$dbExists = & psql -U $dbUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$dbName'" 2>&1

if ($dbExists -eq "1") {
    Write-Host "⚠️  La base de datos '$dbName' ya existe." -ForegroundColor Yellow
    $response = Read-Host "¿Deseas eliminarla y crearla de nuevo? (S/N)"
    
    if ($response -eq "S" -or $response -eq "s") {
        Write-Host "   Eliminando base de datos existente..." -ForegroundColor Yellow
        & psql -U $dbUser -d postgres -c "DROP DATABASE $dbName;" 2>&1 | Out-Null
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: No se pudo eliminar la base de datos. Puede estar en uso." -ForegroundColor Red
            Remove-Item Env:\PGPASSWORD
            pause
            exit 1
        }
        
        Write-Host "   Creando nueva base de datos..." -ForegroundColor Cyan
        & psql -U $dbUser -d postgres -c "CREATE DATABASE $dbName;" 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Base de datos '$dbName' creada correctamente`n" -ForegroundColor Green
        } else {
            Write-Host "ERROR: No se pudo crear la base de datos." -ForegroundColor Red
            Remove-Item Env:\PGPASSWORD
            pause
            exit 1
        }
    } else {
        Write-Host "   Usando base de datos existente`n" -ForegroundColor Yellow
    }
} else {
    # Crear la base de datos
    & psql -U $dbUser -d postgres -c "CREATE DATABASE $dbName;" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de datos '$dbName' creada correctamente`n" -ForegroundColor Green
    } else {
        Write-Host "ERROR: No se pudo crear la base de datos." -ForegroundColor Red
        Remove-Item Env:\PGPASSWORD
        pause
        exit 1
    }
}

# Limpiar variable de entorno
Remove-Item Env:\PGPASSWORD

Write-Host "[3/3] Configurando archivo .env..." -ForegroundColor Cyan

# Verificar si existe .env
if (Test-Path ".env") {
    $response = Read-Host "El archivo .env ya existe. ¿Deseas actualizarlo? (S/N)"
    if ($response -ne "S" -and $response -ne "s") {
        Write-Host "   Manteniendo .env existente" -ForegroundColor Yellow
    } else {
        # Actualizar .env
        $envContent = Get-Content ".env" -Raw
        $envContent = $envContent -replace "DB_HOST=.*", "DB_HOST=localhost"
        $envContent = $envContent -replace "DB_PORT=.*", "DB_PORT=5432"
        $envContent = $envContent -replace "DB_NAME=.*", "DB_NAME=$dbName"
        $envContent = $envContent -replace "DB_USER=.*", "DB_USER=$dbUser"
        $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$dbPasswordPlain"
        
        Set-Content ".env" $envContent
        Write-Host "✅ Archivo .env actualizado`n" -ForegroundColor Green
    }
} else {
    # Crear .env desde .env.example
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        
        # Actualizar valores en .env
        $envContent = Get-Content ".env" -Raw
        $envContent = $envContent -replace "DB_HOST=.*", "DB_HOST=localhost"
        $envContent = $envContent -replace "DB_PORT=.*", "DB_PORT=5432"
        $envContent = $envContent -replace "DB_NAME=.*", "DB_NAME=$dbName"
        $envContent = $envContent -replace "DB_USER=.*", "DB_USER=$dbUser"
        $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$dbPasswordPlain"
        
        Set-Content ".env" $envContent
        Write-Host "✅ Archivo .env creado correctamente`n" -ForegroundColor Green
    } else {
        Write-Host "⚠️  No se encontró .env.example. Crea manualmente el archivo .env" -ForegroundColor Yellow
    }
}

Write-Host "=== ¡Configuración completada! ===" -ForegroundColor Green
Write-Host "`nPróximos pasos:" -ForegroundColor Cyan
Write-Host "1. Verificar el archivo .env con tus configuraciones" -ForegroundColor White
Write-Host "2. Ejecutar: npm install" -ForegroundColor White
Write-Host "3. Ejecutar: npm run init-db (para crear tablas y datos iniciales)" -ForegroundColor White
Write-Host "4. Ejecutar: npm run dev (para iniciar el servidor)`n" -ForegroundColor White

Write-Host "Credenciales de acceso por defecto:" -ForegroundColor Yellow
Write-Host "Admin: admin@ovp.com / admin123" -ForegroundColor White
Write-Host "Estudiante: estudiante@test.com / test123`n" -ForegroundColor White

pause
