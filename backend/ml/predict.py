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
        modelo_path = SCRIPT_DIR / 'modelo_rf_17carreras.pkl'
        encoder_path = SCRIPT_DIR / 'label_encoder_17carreras.pkl'
        
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
        Diccionario con las 65 respuestas del test.
        Formato: {'q1': 3, 'q2': 4, ...}
    
    Retorna:
    --------
    dict : Diccionario con los promedios calculados para cada dimensión.
    """
    
    # Mapeo de preguntas a dimensiones
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
    
    # Rendimiento (preguntas 63-65, no se promedian)
    rendimiento_map = {
        'Rendimiento_General': 'q63',
        'Rendimiento_STEM': 'q64',
        'Rendimiento_Humanidades': 'q65'
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
    
    # Agregar valores de rendimiento (sin promediar)
    for key, pregunta in rendimiento_map.items():
        promedios[key] = respuestas.get(pregunta, 0)
    
    return promedios

def predecir(datos_estudiante, modelo, label_encoder):
    """
    Realiza la predicción de carrera para un estudiante.
    
    Parámetros:
    -----------
    datos_estudiante : dict
        Diccionario con las 17 features del estudiante
        (R, I, A, S, E, C, LM, L, ES, M, CK, IP, IA, N, 
         Rendimiento_General, Rendimiento_STEM, Rendimiento_Humanidades)
    
    Retorna:
    --------
    dict : Resultados de la predicción
    """
    try:
        # Orden correcto de las features
        feature_order = [
            'R', 'I', 'A', 'S', 'E', 'C',
            'LM', 'L', 'ES', 'M', 'CK', 'IP', 'IA', 'N',
            'Rendimiento_General', 'Rendimiento_STEM', 'Rendimiento_Humanidades'
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
        
        resultado = {
            'success': True,
            'carrera_recomendada': carrera_recomendada,
            'confianza': confianza,
            'porcentaje_confianza': round(confianza * 100, 2),
            'top_5_carreras': top_carreras,
            'perfil': datos_estudiante
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
