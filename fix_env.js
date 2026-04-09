const {spawn} = require('child_process');
const KEY = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const HOST = 'root@62.234.49.52';
function run(cmd, timeout) {
  return new Promise((resolve) => {
    const proc = spawn('ssh', ['-i', KEY, '-o', 'StrictHostKeyChecking=no', '-o', 'ServerAliveInterval=60', HOST, cmd], {
      windowsHide: true, timeout: timeout || 20000
    });
    let out = '';
    proc.stdout.on('data', d => out += d);
    proc.on('close', () => resolve(out));
    proc.on('error', err => resolve('ERR: ' + err.message));
    setTimeout(() => { try { proc.kill(); } catch(e) {} resolve('TIMEOUT'); }, timeout || 20000);
  });
}
async function main() {
  // Fix .env: PYTHON_API_URL should point to backend directly, not through /api/
  console.log('=== Fix .env ===');
  console.log(await run("sed -i 's|PYTHON_API_URL=\".*/api/\"$|PYTHON_API_URL=\"http://127.0.0.1:8000\"|' /www/wwwroot/aura-app/.env"));
  console.log(await run('grep PYTHON_API /www/wwwroot/aura-app/.env'));
  
  // Upload new route.ts
  console.log('=== Upload route.ts ===');
  const fs = require('fs');
  fs.writeFileSync('C:/Users/duanmk/AppData/Local/Temp/route.ts', fs.readFileSync('G:/duanmk/claw_code/aura-app/src/app/api/enhance/route.ts'));
  console.log('temp file written');
}
main().then(() => console.log('done'));
