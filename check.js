const {execSync, spawn} = require('child_process');
const key = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const host = 'root@62.234.49.52';

function run(cmd) {
  try {
    const r = execSync(`ssh -i "${key}" -o StrictHostKeyChecking=no ${host} "${cmd}"`, {encoding: 'utf8', timeout: 15000, windowsHide: true});
    return r;
  } catch(e) {
    return (e.stdout || e.message || '');
  }
}

console.log('=== Nginx config ===');
console.log(run('cat /www/server/nginx/conf/vhost/aura.conf'));
console.log('=== Nginx test ===');
console.log(run('nginx -t'));
console.log('=== Frontend process ===');
console.log(run('ps aux | grep next'));
console.log('=== .next folder ===');
console.log(run('ls /www/wwwroot/aura-app/.next/'));
console.log('=== Frontend direct ===');
console.log(run('curl -s http://127.0.0.1:3000'));
console.log('=== Backend direct ===');
console.log(run('curl -s http://127.0.0.1:8000/models'));
