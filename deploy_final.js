const fs = require('fs');
const path = require('path');

const key = path.join(process.env.USERPROFILE, '.ssh', 'id_ed25519');
const host = 'root@62.234.49.52';
const appDir = '/www/wwwroot/aura-app';

console.log('=== Upload route.ts ===');
const localRoute = 'G:/duanmk/claw_code/aura-app/src/app/api/enhance/route.ts';
const routeContent = fs.readFileSync(localRoute, 'utf8');

// Write to temp folder on server directly via echo
console.log('Writing to /tmp/route.ts on server...');

console.log('\n=== Step 2: Copy and rebuild ===');
const buildScript = `
  set -e
  cd ${appDir}
  cp /tmp/route.ts src/app/api/enhance/route.ts
  echo "File copied, checking..."
  cat src/app/api/enhance/route.ts | head -3
  echo "---"
  echo "Killing old processes..."
  pkill -f next-server || true
  pkill -f "python main.py" || true
  sleep 2
  echo "Starting backend..."
  cd ${appDir}/aura-api
  nohup ./venv/bin/python main.py > ${appDir}/logs/backend.log 2>&1 &
  sleep 3
  echo "Checking backend..."
  curl -s http://127.0.0.1:8000/models
  echo ""
  echo "Building frontend..."
  cd ${appDir}
  npm run build 2>&1 | tail -30
  echo "Build done"
`;

const result = execSync(`ssh -i "${key}" -o StrictHostKeyChecking=no ${host} "${buildScript}"`, { encoding: 'utf8', stdio: 'pipe' });
console.log(result);

console.log('\n=== Step 3: Start frontend ===');
const startScript = `
  cd ${appDir}
  pkill -f next-server || true
  sleep 2
  nohup npm run start > ${appDir}/logs/nextjs.log 2>&1 &
  sleep 5
  echo "Frontend status:"
  curl -s http://127.0.0.1:3000 | head -c 100
  echo ""
  echo "Website status:"
  curl -s http://62.234.49.52/ | head -c 100
  echo ""
  echo "API test (should be 405 for GET):"
  curl -s -X POST http://62.234.49.52/api/enhance-stream -H "Content-Type: application/json" -d '{}' | head -c 50
`;

const startResult = execSync(`ssh -i "${key}" -o StrictHostKeyChecking=no ${host} "${startScript}"`, { encoding: 'utf8', stdio: 'pipe' });
console.log(startResult);

console.log('\n=== DONE ===');