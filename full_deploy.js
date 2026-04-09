const {execSync} = require('child_process');
const key = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const host = 'root@62.234.49.52';

function run(cmd, timeout) {
  try {
    return execSync(`ssh -i "${key}" -o StrictHostKeyChecking=no ${host}`, {
      encoding: 'utf8', timeout: timeout || 300000, windowsHide: true,
      input: cmd
    });
  } catch(e) { return (e.stdout || e.message || '').toString(); }
}

const deployScript = `
#!/bin/bash
set -e
echo "=== 1. Copy fixed route.ts ==="
mkdir -p /www/wwwroot/aura-app/src/app/api/enhance
cp /tmp/route.ts /www/wwwroot/aura-app/src/app/api/enhance/route.ts
echo "Copied"

echo "=== 2. npm install ==="
cd /www/wwwroot/aura-app
npm install 2>&1 | tail -3

echo "=== 3. npm build ==="
npm run build 2>&1 | tail -10

echo "=== 4. Stop old services ==="
pkill -f "python main.py" || true
pkill -f "next start" || true
sleep 2

echo "=== 5. Start backend ==="
cd /www/wwwroot/aura-app/aura-api
nohup ./venv/bin/python main.py > /www/wwwroot/aura-app/logs/backend.log 2>&1 &
sleep 3
BACKEND=\$(curl -s http://127.0.0.1:8000/models | head -c 80)
echo "Backend: \$BACKEND"

echo "=== 6. Start frontend ==="
cd /www/wwwroot/aura-app
nohup npm run start > /www/wwwroot/aura-app/logs/nextjs.log 2>&1 &
sleep 4
FRONTEND=\$(curl -s http://62.234.49.52/ | head -c 80)
echo "Frontend: \$FRONTEND"

echo "=== DONE ==="
`;

// Step 1: Upload route.ts
console.log('Uploading route.ts...');
try {
  execSync(`scp -i "${key}" -o StrictHostKeyChecking=no "G:\\duanmk\\claw_code\\aura-app\\src\\app\\api\\enhance\\route.ts" root@62.234.49.52:/tmp/route.ts`, {encoding: 'utf8', timeout: 30000});
  console.log('Uploaded route.ts');
} catch(e) { console.log('Upload failed: ' + (e.message || '')); }

// Step 2: Write and run deploy script
console.log('\nRunning deploy script...\n');
const result = run(deployScript);
console.log(result);
console.log('\n=== COMPLETE ===');
