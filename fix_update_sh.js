const fs = require('fs');
let c = fs.readFileSync('G:/duanmk/claw_code/aura-app/update.sh', 'utf8');

// Fix 1: pkill next-server instead of just "next start"
c = c.replace(
  /pkill -f "next start" 2>\/dev\/null && ok "前端已停止" \|\| warn "前端未在运行"/,
  'pkill -f "next-server" 2>/dev/null\n    pkill -f "next start" 2>/dev/null\n    ok "前端已停止"'
);

// Fix 2: pkill python main.py with better pattern
c = c.replace(
  /pkill -f "python main\.py" 2>\/dev\/null && ok "后端已停止" \|\| warn "后端未在运行"/,
  'pkill -f "python main.py" 2>/dev/null\n    pkill -f "uvicorn.*main:app" 2>/dev/null\n    ok "后端已停止"'
);

fs.writeFileSync('G:/duanmk/claw_code/aura-app/update.sh', c);
console.log('Fixed update.sh');
console.log('--- verifying ---');
let c2 = fs.readFileSync('G:/duanmk/claw_code/aura-app/update.sh', 'utf8');
const idx = c2.indexOf('pkill -f "next-server"');
console.log(c2.slice(idx - 20, idx + 200));
