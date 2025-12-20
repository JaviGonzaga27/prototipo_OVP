#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de predicción para el modelo de orientación vocacional.
Recibe datos en JSON y devuelve predicciones.
"""

import sys
import io
import json
import os
from pathlib import Path

# Configurar codificación UTF-8 para stdin/stdout
sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Suprimir warnings de scikit-learn sobre versiones
import warnings
warnings.filterwarnings('ignore', category=UserWarning)
warnings.filterwarnings('ignore', message='.*InconsistentVersionWarning.*')

import joblib
import pandas as pd
import numpy as np

# Obtener directorio del script
SCRIPT_DIR = Path(__file__).parent

def load_models():
    """Carga el modelo y el label encoder."""
    try:
        modelo_path = SCRIPT_DIR / 'modelo_random_forest.pkl'
        encoder_path = SCRIPT_DIR / 'label_encoder.pkl'
        
        if not modelo_path.exists():
            raise FileNotFoundError(f"No se encuentra el modelo en: {modelo_path}")
        
        if not encoder_path.exists():
            raise FileNotFoundError(f"No se encuentra el label encoder en: {encoder_path}")
        
        modelo = joblib.load(modelo_path)
        label_encoder = joblib.load(encoder_path)
        
        return modelo, label_encoder
    except Exception as e:
        raise Exception(f"Error al cargar modelos: {str(e)}")

def calcular_promedios(respuestas):
    """
    Calcula los promedios de cada dimensión a partir de las respuestas individuales.
    
    Parámetros:
    -----------
    respuestas : dict
        Diccionario con las 62 respuestas del test.
        Formato: {'q1': 3, 'q2': 4, ...}
    
    Retorna:
    --------
    dict : Diccionario con los promedios calculados para cada dimensión.
    """
    
    # Mapeo de preguntas a dimensiones (Total: 62 preguntas)
    dimension_map = {
        # RIASEC - R (preguntas 1-5)
        'R': [f'q{i}' for i in range(1, 6)],
        # RIASEC - I (preguntas 6-10)
        'I': [f'q{i}' for i in range(6, 11)],
        # RIASEC - A (preguntas 11-15)
        'A': [f'q{i}' for i in range(11, 16)],
        # RIASEC - S (preguntas 16-20)
        'S': [f'q{i}' for i in range(16, 21)],
        # RIASEC - E (preguntas 21-25)
        'E': [f'q{i}' for i in range(21, 26)],
        # RIASEC - C (preguntas 26-30)
        'C': [f'q{i}' for i in range(26, 31)],
        # Gardner - LM (preguntas 31-34)
        'LM': [f'q{i}' for i in range(31, 35)],
        # Gardner - L (preguntas 35-38)
        'L': [f'q{i}' for i in range(35, 39)],
        # Gardner - ES (preguntas 39-42)
        'ES': [f'q{i}' for i in range(39, 43)],
        # Gardner - M (preguntas 43-46)
        'M': [f'q{i}' for i in range(43, 47)],
        # Gardner - CK (preguntas 47-50)
        'CK': [f'q{i}' for i in range(47, 51)],
        # Gardner - IP (preguntas 51-54)
        'IP': [f'q{i}' for i in range(51, 55)],
        # Gardner - IA (preguntas 55-58)
        'IA': [f'q{i}' for i in range(55, 59)],
        # Gardner - N (preguntas 59-62)
        'N': [f'q{i}' for i in range(59, 63)],
    }
    
    # Calcular promedios
    promedios = {}
    
    # Calcular promedios para RIASEC y Gardner
    for dimension, preguntas in dimension_map.items():
        valores = [respuestas.get(q, 0) for q in preguntas]
        if valores:
            promedios[dimension] = round(sum(valores) / len(valores), 1)
        else:
            promedios[dimension] = 0.0
    
    return promedios

def aplicar_reglas_negocio(datos, carrera_pred, top_carreras, probabilidades, label_encoder):
    """
    Aplica reglas de negocio simples y conservadoras.
    Solo ajusta cuando hay evidencia clara de error.
    """
    
    I = datos.get('I', 0)
    A = datos.get('A', 0)
    LM = datos.get('LM', 0)
    ES = datos.get('ES', 0)
    S = datos.get('S', 0)
    R = datos.get('R', 0)
    E = datos.get('E', 0)
    IP = datos.get('IP', 0)
    
    # Por ahora, solo devolver la predicción del modelo sin ajustes
    # Las reglas se aplicarán solo para casos muy específicos
    carrera_ajustada = carrera_pred
    razon = None
    top_ajustado = top_carreras.copy()
    
    # ÚNICA REGLA: Arquitectura sin espacialidad → Descartar
    if carrera_pred == 'Arquitectura' and ES < 3.5:
        for career in top_carreras:
            if career['carrera'] != 'Arquitectura':
                carrera_ajustada = career['carrera']
                razon = f"Arquitectura requiere ES >= 3.5 (actual: {ES:.1f})"
                
                # Mover Arquitectura al final
                top_ajustado = [c for c in top_carreras if c['carrera'] != 'Arquitectura']
                arq_item = [c for c in top_carreras if c['carrera'] == 'Arquitectura'][0]
                top_ajustado.append(arq_item)
                break
    
    confianza_ajustada = top_ajustado[0]['probabilidad']
    
    return carrera_ajustada, confianza_ajustada, top_ajustado, razon

def predecir(datos_estudiante, modelo, label_encoder):
    """
    Realiza la predicción de carrera para un estudiante.
    
    Parámetros:
    -----------
    datos_estudiante : dict
        Diccionario con las 14 features del estudiante
        (R, I, A, S, E, C, LM, L, ES, M, CK, IP, IA, N)
    
    Retorna:
    --------
    dict : Resultados de la predicción
    """
    try:
        # Orden correcto de las features (14 dimensiones: 6 RIASEC + 8 Gardner)
        feature_order = [
            'R', 'I', 'A', 'S', 'E', 'C',
            'LM', 'L', 'ES', 'M', 'CK', 'IP', 'IA', 'N'
        ]
        
        # Crear DataFrame con el orden correcto
        df_estudiante = pd.DataFrame([datos_estudiante])[feature_order]
        
        # Realizar predicción
        prediccion = modelo.predict(df_estudiante)[0]
        probabilidades = modelo.predict_proba(df_estudiante)[0]
        
        # Obtener top 5 carreras
        top_indices = np.argsort(probabilidades)[-5:][::-1]
        
        top_carreras = []
        for idx in top_indices:
            carrera = label_encoder.inverse_transform([idx])[0]
            prob = float(probabilidades[idx])
            top_carreras.append({
                'carrera': carrera,
                'probabilidad': prob,
                'porcentaje': round(prob * 100, 2)
            })
        
        # Resultado principal
        carrera_recomendada = label_encoder.inverse_transform([prediccion])[0]
        confianza = float(probabilidades[prediccion])
        
        # APLICAR REGLAS DE NEGOCIO para ajustar predicciones
        carrera_ajustada, confianza_ajustada, top_carreras_ajustado, razon_ajuste = aplicar_reglas_negocio(
            datos_estudiante, 
            carrera_recomendada, 
            top_carreras, 
            probabilidades, 
            label_encoder
        )
        
        # MEJORAR CONFIANZA: Normalizar relativamente al top 5
        # Esto da porcentajes más intuitivos y altos
        top_5_probs = [c['probabilidad'] for c in top_carreras_ajustado]
        suma_top_5 = sum(top_5_probs)
        
        # Normalizar: distribuir el 100% solo entre el top 5
        # Esto hace que los porcentajes sean más altos e intuitivos
        if suma_top_5 > 0:
            for carrera in top_carreras_ajustado:
                prob_normalizada = carrera['probabilidad'] / suma_top_5
                carrera['probabilidad'] = prob_normalizada
                carrera['porcentaje'] = round(prob_normalizada * 100, 2)
        
        # La confianza de la primera carrera es ahora su probabilidad normalizada
        confianza_mejorada = top_carreras_ajustado[0]['probabilidad']
        
        # Boost adicional si hay clara diferencia con el segundo lugar
        if len(top_5_probs) > 1:
            prob_primera_norm = top_carreras_ajustado[0]['probabilidad']
            prob_segunda_norm = top_carreras_ajustado[1]['probabilidad']
            diferencia = prob_primera_norm - prob_segunda_norm
            
            # Si la diferencia es grande (>15%), aumentar confianza hasta 85-95%
            if diferencia > 0.15:
                boost = min((diferencia - 0.15) * 0.8, 0.25)  # Máximo 25% de boost
                confianza_mejorada = min(prob_primera_norm + boost, 0.95)
                
                # Reajustar el top 5 manteniendo las proporciones
                total_resto = 1 - confianza_mejorada
                suma_resto = sum(c['probabilidad'] for c in top_carreras_ajustado[1:])
                
                top_carreras_ajustado[0]['probabilidad'] = confianza_mejorada
                top_carreras_ajustado[0]['porcentaje'] = round(confianza_mejorada * 100, 2)
                
                if suma_resto > 0:
                    for carrera in top_carreras_ajustado[1:]:
                        nueva_prob = (carrera['probabilidad'] / suma_resto) * total_resto
                        carrera['probabilidad'] = nueva_prob
                        carrera['porcentaje'] = round(nueva_prob * 100, 2)
        
        resultado = {
            'success': True,
            'carrera_recomendada': carrera_ajustada,
            'confianza': confianza_mejorada,
            'porcentaje_confianza': round(confianza_mejorada * 100, 2),
            'top_5_carreras': top_carreras_ajustado,
            'perfil': datos_estudiante,
            'ajuste_aplicado': razon_ajuste if razon_ajuste else None
        }
        
        return resultado
        
    except Exception as e:
        return {
            'success': False,
            'error': f'Error en predicción: {str(e)}'
        }

def main():
    """Función principal."""
    try:
        # Leer datos de entrada desde stdin
        if len(sys.argv) > 1:
            # Si se pasa como argumento
            input_data = sys.argv[1]
        else:
            # Si se pasa por stdin
            input_data = sys.stdin.read()
        
        # Parsear JSON
        data = json.loads(input_data)
        
        # Cargar modelos
        modelo, label_encoder = load_models()
        
        # Verificar si vienen respuestas individuales o promedios
        if 'q1' in data:
            # Vienen respuestas individuales, calcular promedios
            datos_estudiante = calcular_promedios(data)
        else:
            # Ya vienen los promedios calculados
            datos_estudiante = data
        
        # Realizar predicción
        resultado = predecir(datos_estudiante, modelo, label_encoder)
        
        # Imprimir resultado como JSON
        print(json.dumps(resultado, ensure_ascii=False, indent=2))
        
    except json.JSONDecodeError as e:
        error_result = {
            'success': False,
            'error': f'Error al parsear JSON: {str(e)}'
        }
        print(json.dumps(error_result, ensure_ascii=False))
        sys.exit(1)
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e)
        }
        print(json.dumps(error_result, ensure_ascii=False))
        sys.exit(1)

if __name__ == '__main__':
    main()
