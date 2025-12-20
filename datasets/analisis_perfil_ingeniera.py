#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Análisis del perfil de Ingeniería en Sistemas en el dataset
y comparación con el caso de la ingeniera
"""

import pandas as pd
import numpy as np

print("="*80)
print("ANÁLISIS DE PERFILES - INGENIERÍA EN SISTEMAS vs ARQUITECTURA")
print("="*80)

# Cargar dataset
df = pd.read_csv('dataset_orientacion_vocacional_17carreras_3500.csv', encoding='utf-8-sig')

# Perfil de la ingeniera del caso real
perfil_ingeniera = {
    'R': 3.4, 'I': 5.0, 'A': 4.2, 'S': 2.6, 'E': 1.6, 'C': 3.2,
    'LM': 4.3, 'L': 2.8, 'ES': 2.3, 'M': 3.0, 'CK': 2.3,
    'IP': 2.0, 'IA': 4.0, 'N': 1.8,
    'Rendimiento_General': 4,
    'Rendimiento_STEM': 3,
    'Rendimiento_Humanidades': 4
}

# Filtrar por carrera
ing_sistemas = df[df['Carrera'] == 'Ingeniería en Sistemas']
arquitectura = df[df['Carrera'] == 'Arquitectura']

print(f"\n📊 REGISTROS EN DATASET:")
print(f"   Ingeniería en Sistemas: {len(ing_sistemas)} registros")
print(f"   Arquitectura: {len(arquitectura)} registros")

# Calcular estadísticas
features = ['R', 'I', 'A', 'S', 'E', 'C', 'LM', 'L', 'ES', 'M', 'CK', 'IP', 'IA', 'N',
            'Rendimiento_General', 'Rendimiento_STEM', 'Rendimiento_Humanidades']

print("\n" + "="*80)
print("COMPARACIÓN DE PROMEDIOS")
print("="*80)
print(f"{'Dimensión':<25} {'Ing. Sistemas':<15} {'Arquitectura':<15} {'Ingeniera':<15} {'Diferencia'}")
print("-"*80)

for feat in features:
    media_sistemas = ing_sistemas[feat].mean()
    media_arq = arquitectura[feat].mean()
    valor_ingeniera = perfil_ingeniera[feat]
    
    # Calcular a cuál se parece más
    diff_sistemas = abs(valor_ingeniera - media_sistemas)
    diff_arq = abs(valor_ingeniera - media_arq)
    mas_cercano = "→ Sistemas" if diff_sistemas < diff_arq else "→ Arq"
    
    print(f"{feat:<25} {media_sistemas:>6.2f}          {media_arq:>6.2f}          "
          f"{valor_ingeniera:>6.2f}          {mas_cercano}")

# Análisis de dimensiones críticas
print("\n" + "="*80)
print("DIMENSIONES CRÍTICAS PARA CADA CARRERA")
print("="*80)

print("\n🔧 INGENIERÍA EN SISTEMAS - Top 5 dimensiones más altas (promedio):")
sistemas_means = ing_sistemas[features].mean().sort_values(ascending=False)
for i, (dim, val) in enumerate(sistemas_means.head(5).items(), 1):
    ingeniera_val = perfil_ingeniera[dim]
    comparacion = "✅" if ingeniera_val >= val - 0.5 else "❌"
    print(f"   {i}. {dim:<25} {val:.2f}  (Ingeniera: {ingeniera_val:.1f}) {comparacion}")

print("\n🏛️  ARQUITECTURA - Top 5 dimensiones más altas (promedio):")
arq_means = arquitectura[features].mean().sort_values(ascending=False)
for i, (dim, val) in enumerate(arq_means.head(5).items(), 1):
    ingeniera_val = perfil_ingeniera[dim]
    comparacion = "✅" if ingeniera_val >= val - 0.5 else "❌"
    print(f"   {i}. {dim:<25} {val:.2f}  (Ingeniera: {ingeniera_val:.1f}) {comparacion}")

# Calcular distancia euclidiana
print("\n" + "="*80)
print("DISTANCIA AL PERFIL PROMEDIO")
print("="*80)

perfil_array = np.array([perfil_ingeniera[f] for f in features])
sistemas_mean = ing_sistemas[features].mean().values
arq_mean = arquitectura[features].mean().values

dist_sistemas = np.linalg.norm(perfil_array - sistemas_mean)
dist_arq = np.linalg.norm(perfil_array - arq_mean)

print(f"\n📏 Distancia euclidiana:")
print(f"   Ingeniería en Sistemas: {dist_sistemas:.3f}")
print(f"   Arquitectura: {dist_arq:.3f}")
print(f"   {'→ MÁS CERCANO A: SISTEMAS' if dist_sistemas < dist_arq else '→ MÁS CERCANO A: ARQUITECTURA'}")

# Buscar el registro más similar en el dataset de Ingeniería en Sistemas
print("\n" + "="*80)
print("REGISTRO MÁS SIMILAR EN INGENIERÍA EN SISTEMAS")
print("="*80)

# Calcular distancias
ing_sistemas_copy = ing_sistemas.copy()
distances = []
for idx, row in ing_sistemas_copy.iterrows():
    row_array = row[features].values
    dist = np.linalg.norm(perfil_array - row_array)
    distances.append(dist)

ing_sistemas_copy['distancia'] = distances
mas_similar = ing_sistemas_copy.nsmallest(1, 'distancia').iloc[0]

print(f"\n🎯 Registro más similar (distancia: {mas_similar['distancia']:.3f}):")
for feat in features:
    print(f"   {feat:<25} Dataset: {mas_similar[feat]:>5.2f}  |  Ingeniera: {perfil_ingeniera[feat]:>5.2f}")

# CONCLUSIONES
print("\n" + "="*80)
print("ANÁLISIS Y CONCLUSIONES")
print("="*80)

print("\n🔍 OBSERVACIONES:")

# 1. Análisis RIASEC
i_val = perfil_ingeniera['I']
a_val = perfil_ingeniera['A']
r_val = perfil_ingeniera['R']

print(f"\n1. RIASEC:")
print(f"   • I (Investigativo) = {i_val:.1f} - ⭐ EXCELENTE para Sistemas")
print(f"   • A (Artístico) = {a_val:.1f} - ⚠️  MUY ALTO (más típico de Arquitectura/Diseño)")
print(f"   • R (Realista) = {r_val:.1f} - ⚠️  MODERADO (debería ser ~{sistemas_means['R']:.1f} para Sistemas)")

# 2. Análisis Gardner
lm_val = perfil_ingeniera['LM']
es_val = perfil_ingeniera['ES']

print(f"\n2. INTELIGENCIAS MÚLTIPLES:")
print(f"   • LM (Lógico-Matemática) = {lm_val:.1f} - ✅ BUENO para Sistemas")
print(f"   • ES (Espacial) = {es_val:.1f} - ⚠️  BAJO (Arquitectura requiere ~{arq_means['ES']:.1f})")

# 3. Análisis Rendimiento
stem_val = perfil_ingeniera['Rendimiento_STEM']
hum_val = perfil_ingeniera['Rendimiento_Humanidades']

print(f"\n3. RENDIMIENTO ACADÉMICO:")
print(f"   • STEM = {stem_val} - ⚠️  MODERADO (debería ser 4-5 para Ingeniería)")
print(f"   • Humanidades = {hum_val} - ⚠️  ALTO (compite con perfil técnico)")

print(f"\n💡 CONCLUSIÓN:")
if dist_sistemas < dist_arq:
    print(f"   Aunque el modelo sugiera Arquitectura, el perfil es MÁS CERCANO a")
    print(f"   Ingeniería en Sistemas (distancia: {dist_sistemas:.3f} vs {dist_arq:.3f})")
    print(f"\n   El componente artístico alto (A=4.2) puede estar sesgando la predicción.")
    print(f"   El modelo necesita dar más peso a:")
    print(f"   • Rendimiento_STEM (para carreras de Ingeniería)")
    print(f"   • LM (Lógico-Matemática)")
    print(f"   • I (Investigativo)")
else:
    print(f"   El perfil es MÁS CERCANO a Arquitectura (distancia: {dist_arq:.3f} vs {dist_sistemas:.3f})")
    print(f"   Esto se debe a:")
    print(f"   • A (Artístico) = {a_val:.1f} muy alto")
    print(f"   • Rendimiento_Humanidades = {hum_val} alto")
    print(f"   • Rendimiento_STEM = {stem_val} solo moderado")

print("\n" + "="*80)
print("RECOMENDACIONES PARA MEJORAR EL MODELO")
print("="*80)

print("\n1. Aumentar peso de 'Rendimiento_STEM' para carreras de Ingeniería")
print("2. Crear reglas de negocio:")
print("   • Si Rendimiento_STEM >= 4 Y LM >= 4.0 → Favorecer Ingenierías")
print("   • Si A >= 4.0 Y ES >= 4.0 → Favorecer Arquitectura/Diseño")
print("3. Considerar crear un modelo ensemble con reglas + Random Forest")
print("4. Agregar más peso a la dimensión 'I' para carreras científicas/técnicas")

print("\n" + "="*80 + "\n")
