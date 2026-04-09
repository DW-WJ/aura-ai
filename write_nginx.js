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

// Check what's in vhost directory
console.log('=== vhost configs ===');
console.log(run('ls /www/server/nginx/conf/vhost/'));
console.log(run('cat /www/server/nginx/conf/vhost/aura.conf 2>/dev/null || echo aura.conf不存在或为空'));

// Get the default nginx config to see how vhost files are included
console.log('=== nginx.conf include line ===');
console.log(run('grep -n vhost /www/server/nginx/conf/nginx.conf | head -5'));
