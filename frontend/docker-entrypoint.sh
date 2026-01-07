#!/bin/sh
# Docker entrypoint script para inyectar variables de entorno en runtime

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "${GREEN}🚀 Iniciando Frontend OVP${NC}"
echo "================================"

# Valores por defecto si no se proporcionan
VITE_API_URL=${VITE_API_URL:-http://localhost:5000/api}
VITE_PORT=${VITE_PORT:-3000}

echo "${YELLOW}📝 Configuración:${NC}"
echo "  VITE_API_URL: ${VITE_API_URL}"
echo "  VITE_PORT: ${VITE_PORT}"
echo ""

# Crear archivo de configuración runtime
echo "${YELLOW}🔧 Generando archivo de configuración runtime...${NC}"

cat > /usr/share/nginx/html/env-config.js << EOF
// Configuración de variables de entorno en runtime
window.ENV = {
  VITE_API_URL: '${VITE_API_URL}',
  VITE_PORT: '${VITE_PORT}'
};
EOF

echo "${GREEN}✅ Archivo env-config.js generado${NC}"
echo ""

# Verificar que el archivo index.html existe
if [ ! -f /usr/share/nginx/html/index.html ]; then
  echo "${RED}❌ Error: index.html no encontrado${NC}"
  exit 1
fi

# Inyectar script de configuración en index.html
echo "${YELLOW}🔧 Inyectando configuración en index.html...${NC}"

# Buscar la etiqueta <head> e insertar el script después
sed -i 's|<head>|<head><script src="/env-config.js"></script>|' /usr/share/nginx/html/index.html

echo "${GREEN}✅ Configuración inyectada correctamente${NC}"
echo ""
echo "${GREEN}🎉 Frontend listo para servir en puerto 80${NC}"
echo "================================"
echo ""

# Ejecutar el comando original (nginx)
exec "$@"
