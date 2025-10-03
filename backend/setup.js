#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Iniciando configuración del Backend TechSolutions...\n');

const backendPath = path.join(__dirname);

// Verificar si existe package.json
if (!fs.existsSync(path.join(backendPath, 'package.json'))) {
  console.error('❌ Error: package.json no encontrado');
  process.exit(1);
}

// Verificar si existe .env
if (!fs.existsSync(path.join(backendPath, '.env'))) {
  console.log('⚠️  Archivo .env no encontrado. Usando configuración por defecto.');
  console.log('📝 Puedes crear un archivo .env para personalizar la configuración.\n');
}

console.log('📦 Instalando dependencias...');

const npmInstall = spawn('npm', ['install'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true
});

npmInstall.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Dependencias instaladas correctamente');
    console.log('\n🎯 Para iniciar el servidor:');
    console.log('   npm run dev  (desarrollo con auto-reload)');
    console.log('   npm start    (producción)');
    console.log('\n📡 El servidor estará disponible en: http://localhost:3000');
    console.log('📚 Documentación de la API: http://localhost:3000/api/health');
    console.log('\n👤 Usuarios por defecto:');
    console.log('   Admin: admin@techsolutions.com / admin123');
    console.log('   Usuario: usuario@techsolutions.com / admin123');
  } else {
    console.error('\n❌ Error durante la instalación de dependencias');
    process.exit(1);
  }
});