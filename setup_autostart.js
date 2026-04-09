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

console.log('=== 1. SCP upload start script ===');
try {
  const r = execSync(`scp -i "${key}" -o StrictHostKeyChecking=no "G:\\duanmk\\claw_code\\aura-app\\aura-nginx.conf" root@62.234.49.52:/tmp/aura-start.sh`, {encoding: 'utf8', timeout: 30000});
  console.log(r);
} catch(e) { console.log(e.stdout || e.message || ''); }

console.log('=== 2. Set permissions ===');
console.log(run('chmod +x /tmp/aura-start.sh'));

console.log('=== 3. Setup systemd service ===');
const systemd = `[Unit]
Description=AURA Auto Start Service
After=network.target

[Service]
Type=oneshot
ExecStart=/tmp/aura-start.sh start
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target`;

run(`cat > /tmp/aura.service << 'EOF'\n${systemd}\nEOF`);

console.log(run('cp /tmp/aura.service /etc/systemd/system/aura.service'));
console.log(run('systemctl daemon-reload'));
console.log(run('systemctl enable aura.service'));
console.log(run('systemctl is-enabled aura.service'));

console.log('=== 4. Also add to /etc/rc.local ===');
console.log(run('chmod +x /tmp/aura-start.sh'));
console.log(run('grep -q "aura-start.sh" /etc/rc.d/rc.local || echo "bash /tmp/aura-start.sh start" >> /etc/rc.d/rc.local'));
console.log(run('chmod +x /etc/rc.d/rc.local'));

console.log('=== 5. Try starting now ===');
console.log(run('bash /tmp/aura-start.sh start'));

console.log('=== 6. Status check ===');
console.log(run('bash /tmp/aura-start.sh status'));
