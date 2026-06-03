#!/usr/bin/env node

/**
 * Security Check Script
 * Run this script to perform security checks on the project
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Running Security Checks...\n');

// Check 1: Verify package.json exists
console.log('1️⃣  Checking package.json...');
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found');
  process.exit(1);
}
console.log('✅ package.json found\n');

// Check 2: Run npm audit
console.log('2️⃣  Running npm audit...');
try {
  execSync('npm audit --audit-level=moderate', { stdio: 'inherit' });
  console.log('✅ npm audit completed\n');
} catch (error) {
  console.warn('⚠️  npm audit found vulnerabilities. Review and fix them.\n');
}

// Check 3: Check for outdated dependencies
console.log('3️⃣  Checking for outdated dependencies...');
try {
  execSync('npm outdated', { stdio: 'inherit' });
} catch (error) {
  // npm outdated exits with code 1 if packages are outdated
  console.log('ℹ️  Some dependencies are outdated. Consider updating.\n');
}

// Check 4: Verify .env files are not committed
console.log('4️⃣  Checking for .env files in git...');
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  const envFiles = gitStatus.split('\n').filter(line => 
    line.includes('.env') && !line.includes('.env.example')
  );
  
  if (envFiles.length > 0) {
    console.error('❌ Found .env files in git staging area:');
    envFiles.forEach(file => console.error(`   ${file}`));
    console.error('\n⚠️  WARNING: Never commit .env files to version control!');
    console.error('   Use .env.example as a template and .gitignore to exclude .env files.\n');
  } else {
    console.log('✅ No .env files found in git staging area\n');
  }
} catch (error) {
  console.log('ℹ️  Git check skipped (not in a git repository)\n');
}

// Check 5: Verify .gitignore includes sensitive files
console.log('5️⃣  Checking .gitignore configuration...');
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  const requiredIgnores = [
    'node_modules',
    '.env',
    '.env.local',
    '.next',
    'out',
    'build'
  ];
  
  const missingIgnores = requiredIgnores.filter(pattern => 
    !gitignore.includes(pattern)
  );
  
  if (missingIgnores.length > 0) {
    console.warn(`⚠️  .gitignore missing patterns: ${missingIgnores.join(', ')}\n`);
  } else {
    console.log('✅ .gitignore properly configured\n');
  }
} else {
  console.warn('⚠️  .gitignore file not found\n');
}

// Check 6: Verify no secrets in code (basic check)
console.log('6️⃣  Performing basic secret scan...');
const secretsPatterns = [
  /password\s*[:=]\s*['"][^'"]{4,}['"]/gi,
  /secret\s*[:=]\s*['"][^'"]{4,}['"]/gi,
  /key\s*[:=]\s*['"][^'"]{8,}['"]/gi,
  /token\s*[:=]\s*['"][^'"]{8,}['"]/gi,
  /api[-_]?key\s*[:=]\s*['"][^'"]{8,}['"]/gi
];

let foundSecrets = false;
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    secretsPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        console.error(`❌ Potential secret found in ${filePath}:`);
        matches.forEach(match => console.error(`   ${match}`));
        foundSecrets = true;
      }
    });
  } catch (error) {
    // Skip files that can't be read
  }
}

// Scan TypeScript/JavaScript files
['.ts', '.tsx', '.js', '.jsx', '.json'].forEach(ext => {
  try {
    const files = execSync(`find . -name "*${ext}" -type f ! -path "./node_modules/*" ! -path "./.next/*"`, { encoding: 'utf8' });
    files.split('\n').filter(Boolean).forEach(file => {
      scanFile(file);
    });
  } catch (error) {
    // No files found with this extension
  }
});

if (!foundSecrets) {
  console.log('✅ No obvious secrets found in code\n');
} else {
  console.error('\n⚠️  WARNING: Potential secrets found in code!');
  console.error('   Remove hardcoded secrets and use environment variables instead.\n');
}

console.log('🔐 Security Check Summary:');
console.log('------------------------');
console.log('✅ Basic security checks completed');
console.log('📋 Review the findings above and fix any issues');
console.log('🚀 For production deployment:');
console.log('   - Use Vercel Environment Variables for secrets');
console.log('   - Enable branch protection rules in GitHub');
console.log('   - Configure automated security scanning');
console.log('   - Use 2FA for all accounts\n');

process.exit(foundSecrets ? 1 : 0);