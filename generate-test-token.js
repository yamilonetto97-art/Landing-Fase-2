/**
 * Script para generar tokens JWT de prueba
 * Uso: node generate-test-token.js [userId]
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'genera-retention-secret-2024';
const userId = parseInt(process.argv[2]) || 1;

const payload = {
  userId: userId,
  type: 'retention'
};

const token = jwt.sign(payload, JWT_SECRET, {
  expiresIn: '7d'
});

const url = `http://localhost:3000?token=${token}`;

console.log('\n🔑 Token JWT generado:');
console.log('━'.repeat(80));
console.log(token);
console.log('━'.repeat(80));
console.log('\n🌐 URL completa para probar:');
console.log('━'.repeat(80));
console.log(url);
console.log('━'.repeat(80));
console.log(`\n👤 Usuario ID: ${userId}`);
console.log('⏰ Válido por: 7 días');
console.log('\n💡 Copia la URL completa y ábrela en tu navegador\n');
