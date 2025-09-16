/**
 * @author: @SovansunchhayKhoun
 * @description Auto generate a template for new modules including the ResponseDto and automatically prettier the files
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];
if (!moduleName) {
  console.error('Please provide a module name.');
  process.exit(1);
}

// Helper functions
function capitalize(str) {
  let result = '';
  result = str.charAt(0).toUpperCase() + str.slice(1);

  if (result.includes('-')) {
    result = '';
    let tokens = str.split('-');
    tokens.forEach((token) => {
      result += token.charAt(0).toUpperCase() + token.slice(1);
    });
  }

  return result;
}

function loadTemplate(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return content;
}

const fileTypes = ['controller', 'module', 'service'];

try {
  execSync(`nest g resource modules/${moduleName} --no-spec`, {
    stdio: 'inherit',
  });

  for (const type of fileTypes) {
    execSync(
      `prettier --write \"src/modules/${moduleName}/${moduleName}.${type}.ts\"`,
    );
  }
  console.log(`Module ${moduleName} generated successfully.`);

  generateResponseDto(moduleName);
  generateEntity(moduleName);
} catch (error) {
  console.error('Error:', error.message);
}

function generateResponseDto(moduleName) {
  // Define the directory and file paths for DTOs
  const responseDir = path.join(
    'src',
    'modules',
    moduleName,
    'dto',
    'response',
  );

  const initialResponseTemplatePath = path.join(
    process.cwd(),
    'scripts',
    'templates',
    'initial-module-response.template.txt',
  );
  const responseTemplatePath = path.join(
    process.cwd(),
    'scripts',
    'templates',
    'module-response.template.txt',
  );

  const initialResponseFile = path.join(
    responseDir,
    `initial-${moduleName}-response.dto.ts`,
  );
  const responseFile = path.join(responseDir, `${moduleName}-response.dto.ts`);

  // Ensure the directory exists
  fs.mkdirSync(responseDir, { recursive: true });

  // Load and generate files from templates
  const replacements = {
    ModuleName: capitalize(moduleName),
    moduleName: moduleName,
  };

  const initialResponseContent = loadTemplate(
    initialResponseTemplatePath,
    replacements,
  );
  const responseContent = loadTemplate(responseTemplatePath, replacements);

  fs.writeFileSync(initialResponseFile, initialResponseContent);
  fs.writeFileSync(responseFile, responseContent);

  // Format the new files
  execSync(`prettier --write "${initialResponseFile}"`, { stdio: 'inherit' });
  execSync(`prettier --write "${responseFile}"`, { stdio: 'inherit' });

  console.log(`Module ${moduleName} and DTOs generated successfully.`);
}

function generateEntity(moduleName) {
  // Define the directory and file paths for DTOs
  const entityDir = path.join('src', 'modules', moduleName, 'entities');

  const entitiyTemplatePath = path.join(
    process.cwd(),
    'scripts',
    'templates',
    'module-entity.template.txt',
  );

  const entityFile = path.join(entityDir, `${moduleName}.entity.ts`);

  // Ensure the directory exists
  fs.mkdirSync(entityDir, { recursive: true });

  // Load and generate files from templates
  const replacements = {
    ModuleName: capitalize(moduleName),
    moduleName: moduleName,
  };

  const initialResponseContent = loadTemplate(
    entitiyTemplatePath,
    replacements,
  );

  fs.writeFileSync(entityFile, initialResponseContent);

  // Format the new files
  execSync(`prettier --write "${entityFile}"`, { stdio: 'inherit' });

  console.log(`Entity ${moduleName} generated successfully.`);
}
