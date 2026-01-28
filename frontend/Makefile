# Makefile para facilitar comandos de Docker
# Uso: make <comando>

.PHONY: help build up down restart logs clean dev prod init-db backup restore

# Mostrar ayuda por defecto
help:
	@echo "Comandos disponibles para Docker OVP:"
	@echo ""
	@echo "  make build      - Construir todas las imágenes"
	@echo "  make up         - Levantar todos los servicios (producción)"
	@echo "  make down       - Detener todos los servicios"
	@echo "  make restart    - Reiniciar todos los servicios"
	@echo "  make logs       - Ver logs de todos los servicios"
	@echo "  make clean      - Limpiar contenedores, volúmenes e imágenes"
	@echo "  make dev        - Levantar en modo desarrollo con hot-reload"
	@echo "  make prod       - Levantar en modo producción"
	@echo "  make init-db    - Inicializar/reinicializar base de datos"
	@echo "  make backup     - Hacer backup de la base de datos"
	@echo "  make restore    - Restaurar backup de la base de datos"
	@echo "  make shell-backend   - Acceder a shell del backend"
	@echo "  make shell-db        - Acceder a psql de la base de datos"
	@echo "  make test-ml         - Probar el servicio ML"
	@echo ""

# Construir todas las imágenes
build:
	docker-compose build

# Construir sin cache
build-clean:
	docker-compose build --no-cache

# Levantar servicios en producción
up:
	docker-compose up -d

# Levantar servicios y ver logs
up-logs:
	docker-compose up

# Detener servicios
down:
	docker-compose down

# Detener y eliminar volúmenes
down-volumes:
	docker-compose down -v

# Reiniciar servicios
restart:
	docker-compose restart

# Ver logs de todos los servicios
logs:
	docker-compose logs -f

# Ver logs de un servicio específico
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f database

# Limpiar todo (contenedores, volúmenes, imágenes)
clean:
	docker-compose down -v
	docker system prune -af

# Modo desarrollo con hot-reload
dev:
	docker-compose -f docker-compose.dev.yml up

dev-build:
	docker-compose -f docker-compose.dev.yml up --build

# Modo producción
prod: build up

# Inicializar base de datos
init-db:
	docker-compose exec backend npm run init-db

# Acceder a shell del backend
shell-backend:
	docker-compose exec backend sh

# Acceder a PostgreSQL
shell-db:
	docker-compose exec database psql -U postgres -d ovp_database

# Ver estado de los servicios
status:
	docker-compose ps

# Ver uso de recursos
stats:
	docker stats

# Hacer backup de la base de datos
backup:
	@mkdir -p backups
	docker-compose exec -T database pg_dump -U postgres ovp_database > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup creado en backups/"

# Restaurar último backup
restore:
	@if [ -z "$$(ls -A backups/*.sql 2>/dev/null)" ]; then \
		echo "No hay backups disponibles"; \
		exit 1; \
	fi
	@LATEST=$$(ls -t backups/*.sql | head -1); \
	echo "Restaurando $$LATEST..."; \
	cat "$$LATEST" | docker-compose exec -T database psql -U postgres ovp_database

# Probar servicio ML
test-ml:
	docker-compose exec backend python ml/test_predict.py

# Ver versión de Python en el backend
python-version:
	docker-compose exec backend python --version

# Ver paquetes de Python instalados
python-packages:
	docker-compose exec backend pip3 list

# Reconstruir un servicio específico
rebuild-backend:
	docker-compose build --no-cache backend
	docker-compose up -d backend

rebuild-frontend:
	docker-compose build --no-cache frontend
	docker-compose up -d frontend

# Health check de todos los servicios
health:
	@echo "Verificando salud de los servicios..."
	@curl -s http://localhost:3000/health || echo "Backend no responde"
	@curl -s http://localhost/ || echo "Frontend no responde"
	@docker-compose exec database pg_isready -U postgres || echo "Database no responde"
