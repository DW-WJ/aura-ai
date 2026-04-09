const {execSync} = require('child_process');
const key = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const host = 'root@62.234.49.52';

function run(cmd, timeout=20000) {
  try {
    return execSync(`ssh -i "${key}" -o StrictHostKeyChecking=no ${host} "${cmd.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8', timeout, windowsHide: true
    });
  } catch(e) { return e.stdout || e.message || ''; }
}

console.log('=== Upload update script ===');
try {
  const r = execSync(`scp -i "${key}" -o StrictHostKeyChecking=no "G:\\duanmk\\claw_code\\aura-app\\update.sh" root@62.234.49.52:/tmp/update.sh`, {encoding: 'utf8', timeout: 30000});
  console.log(r);
} catch(e) { console.log(e.stdout || e.message || ''); }

console.log('=== Set permissions ===');
console.log(run('chmod +x /tmp/update.sh'));
console.log(run('cp /tmp/update.sh /www/wwwroot/aura-app/update.sh'));

console.log('=== Verify ===');
console.log(run('ls -la /www/wwwroot/aura-app/update.sh'));
console.log('Done!');
