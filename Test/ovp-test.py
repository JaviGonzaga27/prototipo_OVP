"""
OVP - Test de Carga con Locust
Sistema de Orientación Vocacional Profesional

Este script crea usuarios únicos y realiza login con ellos.
Configurado para 200 usuarios concurrentes.

Uso:
    locust -f ovp-test.py --host=https://api-ovp.oppadev.com

    O para ejecutar sin interfaz web:
    locust -f ovp-test.py --host=https://api-ovp.oppadev.com --headless -u 200 -r 10 -t 5m
    
    Parámetros:
    -u 200  : 200 usuarios concurrentes
    -r 10   : 10 usuarios nuevos por segundo (spawn rate)
    -t 5m   : duración del test: 5 minutos
"""

from locust import HttpUser, task, between, events
import uuid
import random
import string
import time
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class OVPUser(HttpUser):
    """
    Usuario virtual para pruebas de carga del sistema OVP.
    Cada usuario crea una cuenta única y luego hace login.
    """
    
    # Tiempo de espera entre tareas (1-3 segundos)
    wait_time = between(1, 3)
    
    # Variables de instancia
    user_email = None
    user_password = None
    user_name = None
    token = None
    is_registered = False
    
    def on_start(self):
        """
        Se ejecuta cuando el usuario virtual inicia.
        Genera credenciales únicas y registra al usuario.
        """
        # Generar credenciales únicas
        unique_id = str(uuid.uuid4())[:8]
        timestamp = int(time.time() * 1000)
        
        self.user_email = f"loadtest_{unique_id}_{timestamp}@test.com"
        self.user_password = f"Test@{unique_id}123"
        self.user_name = f"LoadTest User {unique_id}"
        
        # Registrar usuario
        self._register_user()
    
    def _register_user(self):
        """Registra un nuevo usuario en el sistema."""
        payload = {
            "name": self.user_name,
            "email": self.user_email,
            "password": self.user_password
        }
        
        with self.client.post(
            "/api/auth/register",
            json=payload,
            catch_response=True,
            name="POST /api/auth/register"
        ) as response:
            if response.status_code == 201:
                data = response.json()
                if data.get("success"):
                    self.token = data.get("token")
                    self.is_registered = True
                    response.success()
                    logger.info(f"✅ Usuario registrado: {self.user_email}")
                else:
                    response.failure(f"Registro fallido: {data.get('message')}")
            elif response.status_code == 400:
                # Usuario ya existe (posible en re-ejecución)
                data = response.json()
                if "ya existe" in data.get("message", "").lower():
                    self.is_registered = True
                    response.success()
                    logger.info(f"⚠️ Usuario ya existía: {self.user_email}")
                else:
                    response.failure(f"Error 400: {data.get('message')}")
            else:
                response.failure(f"Error HTTP {response.status_code}")
    
    @task(3)
    def login(self):
        """
        Tarea principal: Login del usuario.
        Peso 3 = se ejecuta 3 veces más frecuente que otras tareas.
        """
        if not self.is_registered:
            return
        
        payload = {
            "email": self.user_email,
            "password": self.user_password
        }
        
        with self.client.post(
            "/api/auth/login",
            json=payload,
            catch_response=True,
            name="POST /api/auth/login"
        ) as response:
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.token = data.get("token")
                    response.success()
                else:
                    response.failure(f"Login fallido: {data.get('message')}")
            else:
                response.failure(f"Error HTTP {response.status_code}")
    
    @task(1)
    def get_me(self):
        """
        Tarea secundaria: Obtener información del usuario actual.
        Requiere autenticación.
        """
        if not self.token:
            return
        
        headers = {
            "Authorization": f"Bearer {self.token}"
        }
        
        with self.client.get(
            "/api/auth/me",
            headers=headers,
            catch_response=True,
            name="GET /api/auth/me"
        ) as response:
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    response.success()
                else:
                    response.failure(f"Error en /me: {data.get('message')}")
            elif response.status_code == 401:
                # Token expirado o inválido, hacer login de nuevo
                self.login()
                response.success()
            else:
                response.failure(f"Error HTTP {response.status_code}")
    
    @task(1)
    def health_check(self):
        """Verificar que el servidor está respondiendo."""
        with self.client.get(
            "/health",
            catch_response=True,
            name="GET /health"
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Health check falló: {response.status_code}")


# Eventos para estadísticas personalizadas
@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Se ejecuta al iniciar el test."""
    logger.info("=" * 50)
    logger.info("🚀 Iniciando Test de Carga OVP")
    logger.info("=" * 50)


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Se ejecuta al finalizar el test."""
    logger.info("=" * 50)
    logger.info("✅ Test de Carga OVP Finalizado")
    logger.info("=" * 50)


# Configuración por defecto para 200 usuarios
# Se puede sobrescribir desde línea de comandos
class StagesShape:
    """
    Configuración de etapas para ramp-up gradual.
    Opcional: usar con --shape StagesShape
    """
    stages = [
        {"duration": 60, "users": 50, "spawn_rate": 10},    # 1 min: subir a 50 usuarios
        {"duration": 120, "users": 100, "spawn_rate": 10},  # 2 min: subir a 100 usuarios
        {"duration": 180, "users": 200, "spawn_rate": 20},  # 3 min: subir a 200 usuarios
        {"duration": 300, "users": 200, "spawn_rate": 20},  # 5 min: mantener 200 usuarios
        {"duration": 360, "users": 0, "spawn_rate": 50},    # 6 min: bajar a 0
    ]
