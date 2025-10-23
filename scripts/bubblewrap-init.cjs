const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const manifestPath = path.resolve(process.cwd(), 'twa-manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('No twa-manifest.json found in project root. Create one or run bubblewrap init manually.');
  process.exit(1);
}

let config;
try {
  config = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch (err) {
  console.error('Failed to parse twa-manifest.json:', err.message);
  process.exit(1);
}

// Expect manifest_url and host in config
const manifestUrl = config.manifest_url || config.manifestUrl || config.manifest;
const host = config.host;
const packageId = config.packageId || config.package_id || config.package;

if (!manifestUrl || !host) {
  console.error('twa-manifest.json must include `manifest_url` and `host` fields.');
  console.error('Current twa-manifest.json keys:', Object.keys(config).join(', '));
  process.exit(1);
}

const baseArgs = ['@bubblewrap/cli', 'init', '--manifest', manifestUrl, '--host', host];
if (packageId) baseArgs.push('--packageId', packageId);

// allow passing through additional args from the command line
const extraArgs = process.argv.slice(2).filter(a => a !== '--auto');
const finalArgs = baseArgs.concat(extraArgs);

const cmd = `npx ${finalArgs.map(a => (a.includes(' ') ? `"${a}"` : a)).join(' ')}`;
console.log(`Bubblewrap init command:\n${cmd}`);
console.log(`\nIf you want this script to run the command (will download SDKs/JDK if needed), re-run with the --auto flag:`);
console.log('  npm run bubblewrap:init -- --auto');

if (process.argv.includes('--auto')) {
  console.log('Executing Bubblewrap init (this may download JDK/Android SDK and take several minutes)...');
  const p = spawn('npx', finalArgs, { stdio: 'inherit', shell: true });
  p.on('close', (code) => process.exit(code));
}
