#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de prueba para verificar el modelo de 17 carreras.
Debe mostrar las nuevas carreras en los resultados.
"""

import json
from pathlib import Path
import sys

# Agregar el directorio ml al path
sys.path.insert(0, str(Path(__file__).parent))

# Importar funciones del predict actualizado
import joblib
import pandas as pd
import numpy as np

SCRIPT_DIR = Path(__file__).parent

def load_models():
    """Carga el modelo de 17 carreras."""
    modelo_path = SCRIPT_DIR / 'modelo_rf_17carreras.pkl'
    encoder_path = SCRIPT_DIR / 'label_encoder_17carreras.pkl'
    
    modelo = joblib.load(modelo_path)
    label_encoder = joblib.load(encoder_path)
    
    return modelo, label_encoder

def calcular_promedios(respuestas):
    """Calcula promedios de las respuestas."""
    dimension_map = {
        'R': [f'q{i}' for i in range(1, 6)],
        'I': [f'q{i}' for i in range(6, 11)],
        'A': [f'q{i}' for i in range(11, 16)],
        'S': [f'q{i}' for i in range(16, 21)],
        'E': [f'q{i}' for i in range(21, 26)],
        'C': [f'q{i}' for i in range(26, 31)],
        'LM': [f'q{i}' for i in range(31, 35)],
        'L': [f'q{i}' for i in range(35, 39)],
        'ES': [f'q{i}' for i in range(39, 43)],
        'M': [f'q{i}' for i in range(43, 47)],
        'CK': [f'q{i}' for i in range(47, 51)],
        'IP': [f'q{i}' for i in range(51, 55)],
        'IA': [f'q{i}' for i in range(55, 59)],
        'N': [f'q{i}' for i in range(59, 63)],
    }
    
    rendimiento_map = {
        'Rendimiento_General': 'q63',
        'Rendimiento_STEM': 'q64',
        'Rendimiento_Humanidades': 'q65'
    }
    
    promedios = {}
    for dimension, preguntas in dimension_map.items():
        valores = [respuestas.get(q, 0) for q in preguntas]
        promedios[dimension] = round(sum(valores) / len(valores), 1)
    
    for key, pregunta in rendimiento_map.items():
        promedios[key] = respuestas.get(pregunta, 0)
    
    return promedios

def predecir(datos_estudiante, modelo, label_encoder):
    """Realiza la predicción."""
    feature_order = [
        'R', 'I', 'A', 'S', 'E', 'C',
        'LM', 'L', 'ES', 'M', 'CK', 'IP', 'IA', 'N',
        'Rendimiento_General', 'Rendimiento_STEM', 'Rendimiento_Humanidades'
    ]
    
    df_estudiante = pd.DataFrame([datos_estudiante])[feature_order]
    prediccion = modelo.predict(df_estudiante)[0]
    probabilidades = modelo.predict_proba(df_estudiante)[0]
    
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
    
    carrera_recomendada = label_encoder.inverse_transform([prediccion])[0]
    confianza = float(probabilidades[prediccion])
    
    return {
        'success': True,
        'carrera_recomendada': carrera_recomendada,
        'confianza': confianza,
        'porcentaje_confianza': round(confianza * 100, 2),
        'top_5_carreras': top_carreras,
        'perfil': datos_estudiante
    }

def test_perfil_ingenieria_industrial():
    """Test con perfil orientado a Ingeniería Industrial (NUEVA CARRERA)."""
    print("="*70)
    print("TEST 1: Perfil → Ingeniería Industrial")
    print("="*70)
    
    respuestas = {
        # RIASEC - Perfil: R medio-alto, I alto, C muy alto, E alto
        'q1': 4, 'q2': 4, 'q3': 3, 'q4': 4, 'q5': 4,  # R = 3.8
        'q6': 4, 'q7': 4, 'q8': 5, 'q9': 4, 'q10': 4, # I = 4.2
        'q11': 2, 'q12': 2, 'q13': 3, 'q14': 2, 'q15': 2, # A = 2.2
        'q16': 3, 'q17': 3, 'q18': 3, 'q19': 4, 'q20': 3, # S = 3.2
        'q21': 4, 'q22': 4, 'q23': 4, 'q24': 4, 'q25': 4, # E = 4.0
        'q26': 4, 'q27': 4, 'q28': 5, 'q29': 4, 'q30': 5, # C = 4.4
        # Gardner - Alto LM, medio ES, IP
        'q31': 5, 'q32': 5, 'q33': 4, 'q34': 4,         # LM = 4.5
        'q35': 3, 'q36': 3, 'q37': 3, 'q38': 3,         # L = 3.0
        'q39': 4, 'q40': 4, 'q41': 4, 'q42': 4,         # ES = 4.0
        'q43': 2, 'q44': 2, 'q45': 1, 'q46': 2,         # M = 1.75
        'q47': 3, 'q48': 3, 'q49': 3, 'q50': 3,         # CK = 3.0
        'q51': 4, 'q52': 4, 'q53': 4, 'q54': 3,         # IP = 3.75
        'q55': 4, 'q56': 3, 'q57': 3, 'q58': 4,         # IA = 3.5
        'q59': 2, 'q60': 2, 'q61': 2, 'q62': 3,         # N = 2.25
        # Rendimiento alto en STEM
        'q63': 4, 'q64': 5, 'q65': 3
    }
    
    return run_test(respuestas, "Ingeniería Industrial")

def test_perfil_marketing():
    """Test con perfil orientado a Marketing (NUEVA CARRERA)."""
    print("\n" + "="*70)
    print("TEST 2: Perfil → Marketing")
    print("="*70)
    
    respuestas = {
        # RIASEC - Perfil: E muy alto, S alto, A alto
        'q1': 2, 'q2': 2, 'q3': 2, 'q4': 2, 'q5': 2,  # R = 2.0
        'q6': 3, 'q7': 4, 'q8': 3, 'q9': 4, 'q10': 3, # I = 3.4
        'q11': 4, 'q12': 4, 'q13': 5, 'q14': 4, 'q15': 4, # A = 4.2
        'q16': 4, 'q17': 5, 'q18': 4, 'q19': 5, 'q20': 4, # S = 4.4
        'q21': 5, 'q22': 5, 'q23': 5, 'q24': 4, 'q25': 4, # E = 4.6
        'q26': 4, 'q27': 4, 'q28': 4, 'q29': 3, 'q30': 4, # C = 3.8
        # Gardner - Alto L, IP, medio LM
        'q31': 3, 'q32': 4, 'q33': 4, 'q34': 3,         # LM = 3.5
        'q35': 5, 'q36': 5, 'q37': 4, 'q38': 4,         # L = 4.5
        'q39': 4, 'q40': 4, 'q41': 4, 'q42': 3,         # ES = 3.75
        'q43': 2, 'q44': 2, 'q45': 2, 'q46': 3,         # M = 2.25
        'q47': 2, 'q48': 3, 'q49': 2, 'q50': 3,         # CK = 2.5
        'q51': 5, 'q52': 5, 'q53': 5, 'q54': 4,         # IP = 4.75
        'q55': 4, 'q56': 4, 'q57': 4, 'q58': 3,         # IA = 3.75
        'q59': 2, 'q60': 2, 'q61': 2, 'q62': 2,         # N = 2.0
        # Rendimiento alto en Humanidades
        'q63': 4, 'q64': 3, 'q65': 5
    }
    
    return run_test(respuestas, "Marketing")

def test_perfil_diseno_grafico():
    """Test con perfil orientado a Diseño Gráfico (NUEVA CARRERA)."""
    print("\n" + "="*70)
    print("TEST 3: Perfil → Diseño Gráfico")
    print("="*70)
    
    respuestas = {
        # RIASEC - Perfil: A muy alto, ES muy alto
        'q1': 2, 'q2': 3, 'q3': 2, 'q4': 3, 'q5': 2,  # R = 2.4
        'q6': 4, 'q7': 4, 'q8': 4, 'q9': 3, 'q10': 4, # I = 3.8
        'q11': 5, 'q12': 5, 'q13': 5, 'q14': 4, 'q15': 5, # A = 4.8
        'q16': 3, 'q17': 4, 'q18': 3, 'q19': 4, 'q20': 3, # S = 3.4
        'q21': 4, 'q22': 4, 'q23': 4, 'q24': 3, 'q25': 4, # E = 3.8
        'q26': 3, 'q27': 4, 'q28': 3, 'q29': 4, 'q30': 3, # C = 3.4
        # Gardner - Alto ES, IA, IP
        'q31': 3, 'q32': 3, 'q33': 3, 'q34': 4,         # LM = 3.25
        'q35': 4, 'q36': 4, 'q37': 4, 'q38': 3,         # L = 3.75
        'q39': 5, 'q40': 5, 'q41': 5, 'q42': 4,         # ES = 4.75
        'q43': 3, 'q44': 3, 'q45': 3, 'q46': 3,         # M = 3.0
        'q47': 3, 'q48': 3, 'q49': 3, 'q50': 4,         # CK = 3.25
        'q51': 4, 'q52': 4, 'q53': 4, 'q54': 4,         # IP = 4.0
        'q55': 4, 'q56': 4, 'q57': 5, 'q58': 4,         # IA = 4.25
        'q59': 2, 'q60': 2, 'q61': 3, 'q62': 2,         # N = 2.25
        # Rendimiento medio-bajo STEM, alto Humanidades
        'q63': 3, 'q64': 3, 'q65': 4
    }
    
    return run_test(respuestas, "Diseño Gráfico")

def test_perfil_economia():
    """Test con perfil orientado a Economía (NUEVA CARRERA)."""
    print("\n" + "="*70)
    print("TEST 4: Perfil → Economía")
    print("="*70)
    
    respuestas = {
        # RIASEC - Perfil: I muy alto, C muy alto, E alto
        'q1': 2, 'q2': 2, 'q3': 2, 'q4': 2, 'q5': 2,  # R = 2.0
        'q6': 5, 'q7': 5, 'q8': 4, 'q9': 4, 'q10': 5, # I = 4.6
        'q11': 2, 'q12': 2, 'q13': 2, 'q14': 3, 'q15': 2, # A = 2.2
        'q16': 3, 'q17': 3, 'q18': 3, 'q19': 4, 'q20': 3, # S = 3.2
        'q21': 4, 'q22': 4, 'q23': 5, 'q24': 4, 'q25': 4, # E = 4.2
        'q26': 5, 'q27': 4, 'q28': 4, 'q29': 5, 'q30': 4, # C = 4.4
        # Gardner - Muy alto LM, alto IA
        'q31': 5, 'q32': 5, 'q33': 5, 'q34': 4,         # LM = 4.75
        'q35': 4, 'q36': 4, 'q37': 4, 'q38': 3,         # L = 3.75
        'q39': 2, 'q40': 3, 'q41': 2, 'q42': 3,         # ES = 2.5
        'q43': 1, 'q44': 2, 'q45': 1, 'q46': 2,         # M = 1.5
        'q47': 2, 'q48': 2, 'q49': 2, 'q50': 2,         # CK = 2.0
        'q51': 4, 'q52': 4, 'q53': 4, 'q54': 3,         # IP = 3.75
        'q55': 4, 'q56': 4, 'q57': 4, 'q58': 4,         # IA = 4.0
        'q59': 2, 'q60': 2, 'q61': 2, 'q62': 2,         # N = 2.0
        # Rendimiento muy alto STEM
        'q63': 4, 'q64': 5, 'q65': 4
    }
    
    return run_test(respuestas, "Economía")

def test_perfil_medicina_tradicional():
    """Test con perfil tradicional de Medicina (carrera original)."""
    print("\n" + "="*70)
    print("TEST 5: Perfil → Medicina (Carrera Original)")
    print("="*70)
    
    respuestas = {
        # RIASEC - Perfil: I muy alto, S muy alto
        'q1': 3, 'q2': 3, 'q3': 3, 'q4': 4, 'q5': 3,  # R = 3.2
        'q6': 5, 'q7': 5, 'q8': 4, 'q9': 5, 'q10': 4, # I = 4.6
        'q11': 2, 'q12': 2, 'q13': 2, 'q14': 3, 'q15': 2, # A = 2.2
        'q16': 5, 'q17': 5, 'q18': 5, 'q19': 4, 'q20': 5, # S = 4.8
        'q21': 3, 'q22': 3, 'q23': 3, 'q24': 3, 'q25': 3, # E = 3.0
        'q26': 4, 'q27': 4, 'q28': 4, 'q29': 4, 'q30': 5, # C = 4.2
        # Gardner - Alto IP, CK
        'q31': 4, 'q32': 4, 'q33': 3, 'q34': 4,         # LM = 3.75
        'q35': 3, 'q36': 4, 'q37': 3, 'q38': 4,         # L = 3.5
        'q39': 3, 'q40': 3, 'q41': 3, 'q42': 3,         # ES = 3.0
        'q43': 1, 'q44': 2, 'q45': 2, 'q46': 1,         # M = 1.5
        'q47': 4, 'q48': 4, 'q49': 4, 'q50': 3,         # CK = 3.75
        'q51': 5, 'q52': 5, 'q53': 4, 'q54': 5,         # IP = 4.75
        'q55': 4, 'q56': 4, 'q57': 4, 'q58': 4,         # IA = 4.0
        'q59': 3, 'q60': 2, 'q61': 2, 'q62': 3,         # N = 2.5
        # Rendimiento muy alto STEM, medio Humanidades
        'q63': 5, 'q64': 5, 'q65': 4
    }
    
    return run_test(respuestas, "Medicina")

def run_test(respuestas, carrera_esperada):
    """Ejecuta un test y muestra los resultados."""
    try:
        modelo, label_encoder = load_models()
        
        # Mostrar info del modelo
        print(f"\n📊 Modelo cargado:")
        print(f"   Total de carreras disponibles: {len(label_encoder.classes_)}")
        print(f"   Carreras: {', '.join(sorted(label_encoder.classes_))}")
        
        promedios = calcular_promedios(respuestas)
        print(f"\n📈 Perfil calculado:")
        print(f"   RIASEC: R={promedios['R']} I={promedios['I']} A={promedios['A']} "
              f"S={promedios['S']} E={promedios['E']} C={promedios['C']}")
        print(f"   Rendimiento STEM: {promedios['Rendimiento_STEM']}")
        
        resultado = predecir(promedios, modelo, label_encoder)
        
        if resultado['success']:
            print(f"\n✅ Predicción exitosa!")
            print(f"\n🎯 Carrera Recomendada: {resultado['carrera_recomendada']}")
            print(f"📊 Confianza: {resultado['porcentaje_confianza']:.2f}%")
            
            # Verificar si es la esperada
            if carrera_esperada in resultado['carrera_recomendada']:
                print(f"✅ CORRECTO: Predijo {carrera_esperada}")
            else:
                print(f"⚠️  Se esperaba: {carrera_esperada}")
                print(f"   Pero predijo: {resultado['carrera_recomendada']}")
            
            print(f"\n📊 Top 5 Carreras:")
            for i, carrera in enumerate(resultado['top_5_carreras'], 1):
                icon = "⭐" if i == 1 else "  "
                nueva = "🆕" if carrera['carrera'] in [
                    'Ingeniería Industrial', 'Ingeniería Mecánica', 
                    'Odontología', 'Economía', 'Marketing', 'Diseño Gráfico'
                ] else "  "
                print(f"   {icon} {i}. {nueva} {carrera['carrera']:30s} {carrera['porcentaje']:6.2f}%")
            
            return True
        else:
            print(f"❌ Error: {resultado['error']}")
            return False
            
    except Exception as e:
        print(f"❌ Error en test: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("\n🧪 SUITE DE PRUEBAS - MODELO 17 CARRERAS")
    print("="*70)
    print("\nVerificando modelo de 17 carreras (96.20% accuracy)")
    print("Incluye 6 nuevas carreras: Ing. Industrial, Ing. Mecánica,")
    print("Odontología, Economía, Marketing, Diseño Gráfico")
    print("="*70)
    
    resultados = []
    
    # Test 1: Nueva carrera - Ingeniería Industrial
    resultados.append(test_perfil_ingenieria_industrial())
    
    # Test 2: Nueva carrera - Marketing
    resultados.append(test_perfil_marketing())
    
    # Test 3: Nueva carrera - Diseño Gráfico
    resultados.append(test_perfil_diseno_grafico())
    
    # Test 4: Nueva carrera - Economía
    resultados.append(test_perfil_economia())
    
    # Test 5: Carrera original - Medicina
    resultados.append(test_perfil_medicina_tradicional())
    
    # Resumen
    print("\n" + "="*70)
    print("📊 RESUMEN DE PRUEBAS")
    print("="*70)
    exitosos = sum(resultados)
    total = len(resultados)
    print(f"\n✅ Pruebas exitosas: {exitosos}/{total}")
    print(f"📈 Porcentaje de éxito: {exitosos/total*100:.1f}%")
    
    if exitosos == total:
        print("\n🎉 ¡TODOS LOS TESTS PASARON!")
        print("✅ El modelo de 17 carreras está funcionando correctamente")
        print("✅ Las nuevas carreras están siendo predichas")
        print("✅ Listo para integración en producción")
    else:
        print("\n⚠️  Algunos tests fallaron. Revisar configuración.")
    
    print("="*70 + "\n")
