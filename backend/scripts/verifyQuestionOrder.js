// Script de prueba para verificar el orden de las preguntas
// Ejecutar desde la carpeta backend: node scripts/verifyQuestionOrder.js

import { Question } from '../models/index.js';

async function verifyQuestionOrder() {
  try {
    console.log('🔍 Verificando orden de preguntas...\n');
    
    const questions = await Question.findAll({
      where: { isActive: true },
      order: [['order', 'ASC']],
      attributes: ['id', 'order', 'category', 'dimension', 'text']
    });
    
    console.log(`Total de preguntas activas: ${questions.length}\n`);
    
    // Verificar que el orden sea secuencial del 1 al 65
    const expectedOrders = Array.from({ length: 65 }, (_, i) => i + 1);
    const actualOrders = questions.map(q => q.order);
    
    const missingOrders = expectedOrders.filter(order => !actualOrders.includes(order));
    const duplicateOrders = actualOrders.filter((order, index) => actualOrders.indexOf(order) !== index);
    
    if (missingOrders.length > 0) {
      console.log('❌ Faltan las siguientes preguntas:');
      console.log(missingOrders.join(', '));
    }
    
    if (duplicateOrders.length > 0) {
      console.log('❌ Hay órdenes duplicados:');
      console.log(duplicateOrders.join(', '));
    }
    
    if (missingOrders.length === 0 && duplicateOrders.length === 0 && questions.length === 65) {
      console.log('✅ Orden de preguntas correcto (1-65)\n');
      
      // Mostrar resumen por categoría
      const categorySummary = questions.reduce((acc, q) => {
        const key = `${q.category} - ${q.dimension}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📊 Resumen por categoría:');
      Object.entries(categorySummary).forEach(([key, count]) => {
        console.log(`  ${key}: ${count} preguntas`);
      });
      
      // Mostrar primeras 5 preguntas como muestra
      console.log('\n📝 Primeras 5 preguntas:');
      questions.slice(0, 5).forEach(q => {
        console.log(`  q${q.order}: [${q.category}-${q.dimension}] ${q.text.substring(0, 50)}...`);
      });
      
    } else {
      console.log('\n❌ Hay problemas con el orden de las preguntas');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyQuestionOrder();
