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

const buildScript = `
set -e
echo "Step 1: Copy fixed files"
mkdir -p /www/wwwroot/aura-app/src/app/api/enhance
cp /tmp/route.ts /www/wwwroot/aura-app/src/app/api/enhance/route.ts
echo "route.ts copied"
echo ""
echo "Step 2: npm install"
cd /www/wwwroot/aura-app
/usr/local/bin/node/npm install 2>&1 | tail -5
echo ""
echo "Step 3: npm build"
npm run build 2>&1 | tail -15
echo ""
echo "Step 4: Stop old services"
pkill -f "python main.py" 2>/dev/null || true
pkill -f "next start" 2>/dev/null || true
sleep 2
echo "Services stopped"
echo ""
echo "Step 5: Start backend"
cd /www/wwwroot/aura-app/aura-api
nohup ./venv/bin/python main.py > /www/wwwroot/aura-app/logs/backend.log 2>&1 &
sleep 3
BACKEND=\$(curl -s http://127.0.0.1:8000/models | head -c 80)
echo "Backend: \$BACKEND"
echo ""
echo "Step 6: Start frontend"
cd /www/wwwroot/aura-app
nohup npm run start > /www/wwwroot/aura-app/logs/nextjs.log 2>&1 &
sleep 4
FRONTEND=\$(curl -s http://62.234.49.52/ | head -c 80)
echo "Frontend: \$FRONTEND"
echo ""
echo "ALL DONE"
`;

console.log('Uploading route.ts...');
try {
  execSync('scp -i "' + KEY + '" -o StrictHostKeyChecking=no "G:\\duanmk\\claw_code\\aura-app\\src\\app\\api\\enhance\\route.ts" root@62.234.49.52:/tmp/route.ts', {encoding: 'utf8', timeout: 30000});
  console.log('OK');
} catch(e) { console.log('SCard failed: ' + (e.message||'')); }

console.log('\nRunning build on server...');
const result = run(buildScript, 300000);
console.log(result);
console.log('\n=== COMPLETE ===');
