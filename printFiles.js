import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Directorio raíz (la carpeta actual donde se ejecuta el script)
const rootDir = process.cwd();
const rootName = path.basename(rootDir);

// Nombre del archivo de salida (por ejemplo, "miProyecto.txt" si la carpeta se llama "miProyecto")
const outputFile = path.join(rootDir, `${rootName}.txt`);

// Ejecutamos el comando "tree /f" y capturamos su salida
let treeOutput = '';
try {
  treeOutput = execSync('tree /f', { encoding: 'utf8' });
} catch (error) {
  console.error('Error ejecutando el comando tree /f:', error);
  treeOutput = 'tree /f'; // Fallback en caso de error
}

// Iniciamos el contenido con la salida real del comando "tree /f"
let outputContent = treeOutput + '\n\n';

/**
 * Función que recorre recursivamente una carpeta y agrega el contenido
 * de cada archivo encontrado a la variable outputContent.
 * @param {string} dir - Ruta del directorio a recorrer.
 */
function traverseDirectory(dir) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    // Omitir las carpetas: node_modules, public, assets y dist
    if (['assets', 'node_modules', 'public', 'dist', '.git'].includes(item)) {
      return;
    }

    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Recorrer la carpeta recursivamente
      traverseDirectory(fullPath);
    } else if (stats.isFile()) {
      // Evitar procesar el archivo de salida y package-lock.json
      if (fullPath === outputFile || item === 'package-lock.json') {
        return;
      }

      try {
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        // Calculamos la ruta relativa para incluirla como comentario
        const relativePath = path
          .relative(rootDir, fullPath)
          .replace(/\\/g, '/');

        // Siempre agregamos la ruta y el contenido del archivo, sin importar su formato
        outputContent += `---\n // ${relativePath}\n\n${fileContent}\n---\n`;
      } catch (error) {
        console.error(`Error al leer el archivo ${fullPath}:`, error);
      }
    }
  });
}

// Iniciamos el recorrido desde el directorio raíz
traverseDirectory(rootDir);

// Escribimos el contenido acumulado en el archivo de salida.
fs.writeFileSync(outputFile, outputContent, 'utf8');
console.log(`Archivo generado: ${outputFile}`);
