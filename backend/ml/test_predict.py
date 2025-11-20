#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de prueba para verificar que el modelo funciona correctamente.
"""

import json
from pathlib import Path
import sys

# Agregar el directorio ml al path
sys.path.insert(0, str(Path(__file__).parent))

from predict import load_models, predecir, calcular_promedios

def test_con_respuestas_individuales():
    """Prueba con respuestas individuales (q1-q65)"""
    print("="*70)
    print("TEST 1: Respuestas Individuales")
    print("="*70)
    
    # Respuestas de ejemplo (perfil orientado a Ingeniería)
    respuestas = {
        # RIASEC - R (Realista)
        'q1': 4, 'q2': 3, 'q3': 4, 'q4': 3, 'q5': 4,
        # RIASEC - I (Investigativo)
        'q6': 5, 'q7': 4, 'q8': 5, 'q9': 4, 'q10': 5,
        # RIASEC - A (Artístico)
        'q11': 2, 'q12': 3, 'q13': 2, 'q14': 2, 'q15': 2,
        # RIASEC - S (Social)
        'q16': 3, 'q17': 2, 'q18': 3, 'q19': 3, 'q20': 2,
        # RIASEC - E (Emprendedor)
        'q21': 3, 'q22': 2, 'q23': 4, 'q24': 3, 'q25': 3,
        # RIASEC - C (Convencional)
        'q26': 4, 'q27': 3, 'q28': 4, 'q29': 5, 'q30': 4,
        # Gardner - LM
        'q31': 5, 'q32': 5, 'q33': 4, 'q34': 5,
        # Gardner - L
        'q35': 3, 'q36': 3, 'q37': 3, 'q38': 2,
        # Gardner - ES
        'q39': 4, 'q40': 4, 'q41': 3, 'q42': 4,
        # Gardner - M
        'q43': 1, 'q44': 2, 'q45': 1, 'q46': 1,
        # Gardner - CK
        'q47': 3, 'q48': 3, 'q49': 4, 'q50': 3,
        # Gardner - IP
        'q51': 3, 'q52': 3, 'q53': 2, 'q54': 3,
        # Gardner - IA
        'q55': 4, 'q56': 4, 'q57': 4, 'q58': 4,
        # Gardner - N
        'q59': 2, 'q60': 2, 'q61': 2, 'q62': 3,
        # Rendimiento
        'q63': 4, 'q64': 5, 'q65': 3
    }
    
    try:
        # Cargar modelos
        modelo, label_encoder = load_models()
        print("✅ Modelos cargados correctamente\n")
        
        # Calcular promedios
        promedios = calcular_promedios(respuestas)
        print("📊 Promedios calculados:")
        print(json.dumps(promedios, indent=2, ensure_ascii=False))
        print()
        
        # Realizar predicción
        resultado = predecir(promedios, modelo, label_encoder)
        
        if resultado['success']:
            print("✅ Predicción exitosa!\n")
            print(f"🏆 Carrera Recomendada: {resultado['carrera_recomendada']}")
            print(f"📈 Confianza: {resultado['porcentaje_confianza']}%\n")
            print("📊 Top 5 Carreras:")
            for i, carrera in enumerate(resultado['top_5_carreras'], 1):
                print(f"   {i}. {carrera['carrera']:35s} {carrera['porcentaje']:6.2f}%")
        else:
            print(f"❌ Error: {resultado['error']}")
            
    except Exception as e:
        print(f"❌ Error en test: {str(e)}")

def test_con_promedios():
    """Prueba con promedios ya calculados"""
    print("\n" + "="*70)
    print("TEST 2: Promedios Ya Calculados")
    print("="*70)
    
    promedios = {
        'R': 3.6, 'I': 4.6, 'A': 2.2, 'S': 2.6, 'E': 3.0, 'C': 4.0,
        'LM': 4.75, 'L': 2.75, 'ES': 3.75, 'M': 1.25, 'CK': 3.25,
        'IP': 2.75, 'IA': 4.0, 'N': 2.25,
        'Rendimiento_General': 4,
        'Rendimiento_STEM': 5,
        'Rendimiento_Humanidades': 3
    }
    
    try:
        # Cargar modelos
        modelo, label_encoder = load_models()
        print("✅ Modelos cargados correctamente\n")
        
        print("📊 Perfil del estudiante:")
        print(json.dumps(promedios, indent=2, ensure_ascii=False))
        print()
        
        # Realizar predicción
        resultado = predecir(promedios, modelo, label_encoder)
        
        if resultado['success']:
            print("✅ Predicción exitosa!\n")
            print(f"🏆 Carrera Recomendada: {resultado['carrera_recomendada']}")
            print(f"📈 Confianza: {resultado['porcentaje_confianza']}%\n")
            print("📊 Top 5 Carreras:")
            for i, carrera in enumerate(resultado['top_5_carreras'], 1):
                print(f"   {i}. {carrera['carrera']:35s} {carrera['porcentaje']:6.2f}%")
        else:
            print(f"❌ Error: {resultado['error']}")
            
    except Exception as e:
        print(f"❌ Error en test: {str(e)}")

if __name__ == '__main__':
    print("\n🧪 PRUEBA DEL MODELO DE PREDICCIÓN\n")
    
    # Test 1: Con respuestas individuales
    test_con_respuestas_individuales()
    
    # Test 2: Con promedios calculados
    test_con_promedios()
    
    print("\n" + "="*70)
    print("✅ Tests completados")
    print("="*70 + "\n")
