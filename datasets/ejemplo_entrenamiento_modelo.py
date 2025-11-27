
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

# Configuración
RANDOM_STATE = 42
TEST_SIZE = 0.15
VAL_SIZE = 0.15

print("="*70)
print("ENTRENAMIENTO DE MODELO DE ORIENTACIÓN VOCACIONAL")
print("="*70)

# 1. CARGAR DATASET
print("\n📁 Cargando dataset...")
df = pd.read_csv('/mnt/user-data/outputs/dataset_orientacion_vocacional_2500.csv', encoding='utf-8-sig')
print(f"   ✓ Dataset cargado: {len(df)} registros")
print(f"   ✓ Carreras: {df['Carrera'].nunique()}")
print(f"   ✓ Features: {len(df.columns) - 1}")

# 2. PREPARAR DATOS
print("\n🔧 Preparando datos...")

# Separar features y target
feature_cols = ['R', 'I', 'A', 'S', 'E', 'C', 'LM', 'L', 'ES', 'M', 'CK', 'IP', 'IA', 'N',
                'Rendimiento_General', 'Rendimiento_STEM', 'Rendimiento_Humanidades']
X = df[feature_cols]
y = df['Carrera']

# Codificar labels
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

print(f"   ✓ Features shape: {X.shape}")
print(f"   ✓ Clases únicas: {len(label_encoder.classes_)}")

# 3. SPLIT DE DATOS (Stratified)
print("\n📊 Dividiendo dataset...")

# Primero separar test set
X_temp, X_test, y_temp, y_test = train_test_split(
    X, y_encoded, 
    test_size=TEST_SIZE, 
    random_state=RANDOM_STATE,
    stratify=y_encoded
)

# Luego separar train y validation
val_size_adjusted = VAL_SIZE / (1 - TEST_SIZE)
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp,
    test_size=val_size_adjusted,
    random_state=RANDOM_STATE,
    stratify=y_temp
)

print(f"   ✓ Train set: {len(X_train)} registros ({len(X_train)/len(df)*100:.1f}%)")
print(f"   ✓ Validation set: {len(X_val)} registros ({len(X_val)/len(df)*100:.1f}%)")
print(f"   ✓ Test set: {len(X_test)} registros ({len(X_test)/len(df)*100:.1f}%)")

# 4. NORMALIZACIÓN (opcional - RF no lo requiere estrictamente)
print("\n⚙️  Normalizando features...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_val_scaled = scaler.transform(X_val)
X_test_scaled = scaler.transform(X_test)
print("   ✓ Normalización completada")

# 5. ENTRENAR MODELO
print("\n🤖 Entrenando Random Forest Classifier...")
print("   Configuración:")
print("   - n_estimators: 200")
print("   - max_depth: 20")
print("   - min_samples_split: 5")
print("   - min_samples_leaf: 2")

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=RANDOM_STATE,
    n_jobs=-1
)

model.fit(X_train, y_train)
print("   ✓ Entrenamiento completado")

# 6. EVALUACIÓN
print("\n📈 Evaluando modelo...")

# Predicciones
y_train_pred = model.predict(X_train)
y_val_pred = model.predict(X_val)
y_test_pred = model.predict(X_test)

# Accuracy
train_acc = accuracy_score(y_train, y_train_pred)
val_acc = accuracy_score(y_val, y_val_pred)
test_acc = accuracy_score(y_test, y_test_pred)

print(f"\n📊 RESULTADOS:")
print(f"   Train Accuracy: {train_acc*100:.2f}%")
print(f"   Validation Accuracy: {val_acc*100:.2f}%")
print(f"   Test Accuracy: {test_acc*100:.2f}%")

# Cross-validation
print("\n🔄 Cross-validation (5-fold)...")
cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
print(f"   CV Scores: {cv_scores}")
print(f"   CV Mean: {cv_scores.mean()*100:.2f}% (+/- {cv_scores.std()*2*100:.2f}%)")

# 7. REPORTE DETALLADO
print("\n📋 Classification Report (Test Set):")
print("-" * 70)
print(classification_report(y_test, y_test_pred, 
                          target_names=label_encoder.classes_,
                          digits=3))

# 8. FEATURE IMPORTANCE
print("\n🎯 Feature Importance (Top 10):")
print("-" * 70)
feature_importance = pd.DataFrame({
    'feature': feature_cols,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

for idx, row in feature_importance.head(10).iterrows():
    print(f"   {row['feature']:25} {row['importance']:.4f}")

# 9. GUARDAR MODELO
print("\n💾 Guardando modelo y artefactos...")
joblib.dump(model, '/mnt/user-data/outputs/modelo_rf_orientacion.pkl')
joblib.dump(scaler, '/mnt/user-data/outputs/scaler.pkl')
joblib.dump(label_encoder, '/mnt/user-data/outputs/label_encoder_nuevo.pkl')
print("   ✓ modelo_rf_orientacion.pkl")
print("   ✓ scaler.pkl")
print("   ✓ label_encoder_nuevo.pkl")

# 10. VISUALIZACIONES
print("\n📊 Generando visualizaciones...")

# Crear figura con 3 subplots
fig = plt.figure(figsize=(16, 5))

# Subplot 1: Feature Importance
ax1 = plt.subplot(1, 3, 1)
top_features = feature_importance.head(10)
ax1.barh(range(len(top_features)), top_features['importance'], color='steelblue', alpha=0.7)
ax1.set_yticks(range(len(top_features)))
ax1.set_yticklabels(top_features['feature'])
ax1.set_xlabel('Importancia', fontsize=10)
ax1.set_title('Top 10 Features Más Importantes', fontsize=12, fontweight='bold')
ax1.grid(axis='x', alpha=0.3)

# Subplot 2: Matriz de Confusión (Test Set)
ax2 = plt.subplot(1, 3, 2)
cm = confusion_matrix(y_test, y_test_pred)
sns.heatmap(cm, annot=False, fmt='d', cmap='Blues', 
            xticklabels=label_encoder.classes_, 
            yticklabels=label_encoder.classes_,
            ax=ax2, cbar_kws={'shrink': 0.8})
ax2.set_xlabel('Predicción', fontsize=10)
ax2.set_ylabel('Real', fontsize=10)
ax2.set_title('Matriz de Confusión (Test Set)', fontsize=12, fontweight='bold')
plt.setp(ax2.get_xticklabels(), rotation=45, ha='right', fontsize=8)
plt.setp(ax2.get_yticklabels(), rotation=0, fontsize=8)

# Subplot 3: Accuracy por conjunto
ax3 = plt.subplot(1, 3, 3)
datasets = ['Train', 'Validation', 'Test']
accuracies = [train_acc * 100, val_acc * 100, test_acc * 100]
colors = ['#2ecc71', '#3498db', '#e74c3c']
bars = ax3.bar(datasets, accuracies, color=colors, alpha=0.7)
ax3.set_ylabel('Accuracy (%)', fontsize=10)
ax3.set_title('Accuracy por Conjunto de Datos', fontsize=12, fontweight='bold')
ax3.set_ylim(0, 100)
ax3.grid(axis='y', alpha=0.3)

# Añadir valores en las barras
for i, (bar, acc) in enumerate(zip(bars, accuracies)):
    height = bar.get_height()
    ax3.text(bar.get_x() + bar.get_width()/2., height,
            f'{acc:.1f}%',
            ha='center', va='bottom', fontweight='bold')

plt.tight_layout()
plt.savefig('/mnt/user-data/outputs/resultados_entrenamiento.png', dpi=150, bbox_inches='tight')
print("   ✓ resultados_entrenamiento.png")

# 11. FUNCIÓN DE PREDICCIÓN
def predecir_carrera(perfil_riasec_habilidades):
    """
    Predice la carrera más adecuada basándose en el perfil RIASEC y habilidades.
    
    Args:
        perfil_riasec_habilidades: dict con las 17 dimensiones
        
    Returns:
        dict con carrera recomendada, confianza y top-3
    """
    # Preparar features en el orden correcto
    features = [perfil_riasec_habilidades[col] for col in feature_cols]
    features_array = np.array([features])
    
    # Escalar
    features_scaled = scaler.transform(features_array)
    
    # Predecir
    pred_class = model.predict(features_scaled)[0]
    pred_proba = model.predict_proba(features_scaled)[0]
    
    # Obtener top-3
    top_3_idx = np.argsort(pred_proba)[-3:][::-1]
    top_3 = [
        {
            'carrera': label_encoder.classes_[idx],
            'probabilidad': float(pred_proba[idx])
        }
        for idx in top_3_idx
    ]
    
    return {
        'carrera_recomendada': label_encoder.classes_[pred_class],
        'confianza': float(pred_proba[pred_class]),
        'top_3': top_3
    }

# 12. EJEMPLO DE PREDICCIÓN
print("\n🎯 Ejemplo de Predicción:")
print("-" * 70)

# Cargar el ejemplo del resultado previo
ejemplo_perfil = {
    'R': 2.0, 'I': 3.4, 'A': 2.0, 'S': 2.6, 'E': 2.2, 'C': 2.8,
    'LM': 3.5, 'L': 1.8, 'ES': 2.0, 'M': 2.0, 'CK': 2.0,
    'IP': 3.0, 'IA': 1.8, 'N': 3.5,
    'Rendimiento_General': 3,
    'Rendimiento_STEM': 2,
    'Rendimiento_Humanidades': 2
}

resultado = predecir_carrera(ejemplo_perfil)

print(f"   Perfil RIASEC:")
print(f"   R={ejemplo_perfil['R']:.1f}, I={ejemplo_perfil['I']:.1f}, "
      f"A={ejemplo_perfil['A']:.1f}, S={ejemplo_perfil['S']:.1f}, "
      f"E={ejemplo_perfil['E']:.1f}, C={ejemplo_perfil['C']:.1f}")
print(f"\n   Carrera recomendada: {resultado['carrera_recomendada']}")
print(f"   Confianza: {resultado['confianza']*100:.1f}%")
print(f"\n   Top 3 recomendaciones:")
for i, rec in enumerate(resultado['top_3'], 1):
    print(f"   {i}. {rec['carrera']:30} ({rec['probabilidad']*100:.1f}%)")

print("\n" + "="*70)
print("✅ ENTRENAMIENTO COMPLETADO EXITOSAMENTE")
print("="*70)
print("\n📁 Archivos generados:")
print("   • modelo_rf_orientacion.pkl (modelo entrenado)")
print("   • scaler.pkl (normalizador)")
print("   • label_encoder_nuevo.pkl (codificador de labels)")
print("   • resultados_entrenamiento.png (visualizaciones)")
print("\n💡 Para usar el modelo en producción:")
print("   1. Cargar modelo: joblib.load('modelo_rf_orientacion.pkl')")
print("   2. Cargar scaler: joblib.load('scaler.pkl')")
print("   3. Cargar encoder: joblib.load('label_encoder_nuevo.pkl')")
print("   4. Usar función predecir_carrera() para hacer predicciones")
print("="*70 + "\n")
