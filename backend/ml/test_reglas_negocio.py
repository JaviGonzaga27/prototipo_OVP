#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test del modelo con reglas de negocio usando el perfil de la ingeniera
"""

import sys
import json

# Perfil de la ingeniera que estudió Ingeniería en Sistemas
perfil_ingeniera = {
    'R': 3.4,
    'I': 5.0,
    'A': 4.2,
    'S': 2.6,
    'E': 1.6,
    'C': 3.2,
    'LM': 4.3,
    'L': 2.8,
    'ES': 2.3,
    'M': 3.0,
    'CK': 2.3,
    'IP': 2.0,
    'IA': 4.0,
    'N': 1.8,
    'Rendimiento_General': 4,
    'Rendimiento_STEM': 3,
    'Rendimiento_Humanidades': 4
}

print("="*80)
print("TEST DE PREDICCIÓN CON REGLAS DE NEGOCIO")
print("="*80)

print("\n📊 PERFIL DE LA INGENIERA:")
print(f"   RIASEC: R={perfil_ingeniera['R']:.1f}, I={perfil_ingeniera['I']:.1f}, "
      f"A={perfil_ingeniera['A']:.1f}, S={perfil_ingeniera['S']:.1f}, "
      f"E={perfil_ingeniera['E']:.1f}, C={perfil_ingeniera['C']:.1f}")
print(f"   Gardner: LM={perfil_ingeniera['LM']:.1f}, L={perfil_ingeniera['L']:.1f}, "
      f"ES={perfil_ingeniera['ES']:.1f}, M={perfil_ingeniera['M']:.1f}")
print(f"   Rendimiento: General={perfil_ingeniera['Rendimiento_General']}, "
      f"STEM={perfil_ingeniera['Rendimiento_STEM']}, "
      f"Humanidades={perfil_ingeniera['Rendimiento_Humanidades']}")

print("\n🔧 ANALIZANDO REGLAS APLICABLES:")
print("-"*80)

I = perfil_ingeniera['I']
LM = perfil_ingeniera['LM']
A = perfil_ingeniera['A']
ES = perfil_ingeniera['ES']
R_STEM = perfil_ingeniera['Rendimiento_STEM']

# Análisis de reglas
print("\n✅ REGLA 1: Perfil técnico-investigativo fuerte")
print(f"   Condición: I >= 4.5 AND LM >= 4.0")
print(f"   Valores: I={I:.1f}, LM={LM:.1f}")
if I >= 4.5 and LM >= 4.0:
    print(f"   ✅ SE CUMPLE → Favorecer Ingenierías")
else:
    print(f"   ❌ NO SE CUMPLE")

print("\n✅ REGLA 2: Arquitectura sin espacialidad")
print(f"   Condición: Carrera=Arquitectura AND ES < 3.5")
print(f"   Valores: ES={ES:.1f}")
if ES < 3.5:
    print(f"   ⚠️  Si el modelo predice Arquitectura, SE DESCARTARÁ")
    print(f"   Razón: Arquitectura requiere alta espacialidad (ES >= 3.5)")
else:
    print(f"   ✅ ES suficiente para Arquitectura")

print("\n✅ REGLA 3: Alto STEM + Perfil técnico")
print(f"   Condición: STEM >= 4 AND (I >= 4 OR LM >= 4)")
print(f"   Valores: STEM={R_STEM}, I={I:.1f}, LM={LM:.1f}")
if R_STEM >= 4 and (I >= 4.0 or LM >= 4.0):
    print(f"   ✅ SE CUMPLE → Forzar Ingenierías")
else:
    print(f"   ❌ NO SE CUMPLE (STEM={R_STEM} < 4)")
    print(f"   Nota: I y LM son excelentes, pero STEM es solo {R_STEM}")

print("\n" + "="*80)
print("💡 PREDICCIÓN ESPERADA:")
print("="*80)
print("\n🤖 Sin reglas de negocio:")
print("   • Probablemente: Arquitectura (por A=4.2 alto)")
print("   • Confianza: Media-Alta")

print("\n✅ Con reglas de negocio:")
print("   • Regla 1 SE APLICA: I=5.0 >= 4.5 Y LM=4.3 >= 4.0")
print("   • Si Arquitectura está en predicción, se descarta por ES=2.3 < 3.5")
print("   • Resultado esperado: Ingeniería en Sistemas")
print("   • Razón: Perfil técnico-investigativo fuerte")

print("\n" + "="*80)
print("📝 NOTA: Para ejecutar la predicción real, enviar este JSON al backend:")
print("="*80)
print(json.dumps(perfil_ingeniera, indent=2, ensure_ascii=False))

print("\n" + "="*80)
print("🚀 PRÓXIMO PASO: Probar en el sistema real")
print("="*80)
print("\nInstrucciones:")
print("1. Iniciar el backend: cd backend && npm run dev")
print("2. Hacer POST a http://localhost:5000/api/test/predict")
print("3. Enviar el JSON del perfil en el body")
print("4. Verificar que:")
print("   • carrera_recomendada = 'Ingeniería en Sistemas'")
print("   • ajuste_aplicado contenga la razón del ajuste")
print("   • top_5_carreras tenga Ingenierías en primeras posiciones")

print("\n" + "="*80 + "\n")
