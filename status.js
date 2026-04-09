const {execSync} = require('child_process');
const KEY = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const HOST = 'root@62.234.49.52';
function run(cmd, timeout) {
  try {
    return execSync('ssh -i "' + KEY + '" -o StrictHostKeyChecking=no ' + HOST, {
      encoding: 'utf8', timeout: timeout || 20000, windowsHide: true, input: cmd
    });
  } catch(e) { return (e.stdout || e.message || '').toString(); }
}

const out = run('ps aux | grep -E "next|python|node" | grep -v grep');
console.log(out);

const web = run('curl -s http://62.234.49.52/ | head -c 80');
console.log('Website: ' + web);

const api = run('curl -s http://127.0.0.1:8000/models | head -c 80');
console.log('Backend: ' + api);

const buildLog = run('tail -20 /www/wwwroot/aura-app/logs/nextjs.log');
console.log('Frontend log:\n' + buildLog);
