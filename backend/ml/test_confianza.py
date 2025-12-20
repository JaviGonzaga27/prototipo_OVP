import sys
import json

# Simular las respuestas del test de la imagen (Medicina con 24.09%)
# Basándonos en las primeras 3 respuestas visibles: 4/5, 5/5, 3/5 en RIASEC-R

respuestas_test = {
    # RIASEC - Realista (visible en imagen)
    'q1': 4,  # Construcción: 4/5
    'q2': 5,  # Máquinas: 5/5
    'q3': 3,  # Aire libre: 3/5
    'q4': 2,  # Manualidades: estimado
    'q5': 2,  # Físico: estimado
    
    # RIASEC - Investigativo (perfil médico alto)
    'q6': 5,  # Investigar: alto para medicina
    'q7': 5,  # Laboratorio: alto para medicina
    'q8': 5,  # Análisis datos: alto para medicina
    'q9': 5,  # Problemas lógicos: alto para medicina
    'q10': 4, # Teorías: alto para medicina
    
    # RIASEC - Artístico (neutral/bajo para medicina)
    'q11': 2,
    'q12': 2,
    'q13': 1,
    'q14': 2,
    'q15': 2,
    
    # RIASEC - Social (alto para medicina)
    'q16': 4,  # Educación
    'q17': 5,  # Ayudar salud: MUY alto para medicina
    'q18': 5,  # Proyectos comunitarios
    'q19': 5,  # Aconsejar
    'q20': 5,  # Servir a otros
    
    # RIASEC - Emprendedor (medio)
    'q21': 3,
    'q22': 3,
    'q23': 2,
    'q24': 4,
    'q25': 3,
    
    # RIASEC - Convencional (medio)
    'q26': 3,
    'q27': 3,
    'q28': 3,
    'q29': 4,
    'q30': 3,
    
    # Gardner - Lógico-Matemática (alto para medicina)
    'q31': 4,
    'q32': 4,
    'q33': 4,
    'q34': 4,
    
    # Gardner - Lingüística (medio)
    'q35': 3,
    'q36': 3,
    'q37': 3,
    'q38': 3,
    
    # Gardner - Espacial (medio-alto)
    'q39': 4,
    'q40': 3,
    'q41': 3,
    'q42': 3,
    
    # Gardner - Musical (bajo)
    'q43': 2,
    'q44': 1,
    'q45': 2,
    'q46': 2,
    
    # Gardner - Corporal-Kinestésica (medio-alto para cirugía)
    'q47': 4,
    'q48': 2,
    'q49': 4,
    'q50': 4,
    
    # Gardner - Interpersonal (MUY alto para medicina)
    'q51': 5,
    'q52': 5,
    'q53': 5,
    'q54': 5,
    
    # Gardner - Intrapersonal (alto)
    'q55': 4,
    'q56': 4,
    'q57': 5,
    'q58': 4,
    
    # Gardner - Naturalista (medio)
    'q59': 3,
    'q60': 4,
    'q61': 3,
    'q62': 4
}

# Convertir a JSON para enviar al script de Python
respuestas_json = json.dumps(respuestas_test)
print(respuestas_json)
