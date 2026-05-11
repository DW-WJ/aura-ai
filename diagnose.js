const { spawn } = require('child_process');
const http = require('http');

console.log('=== Next.js Diagnostic Script ===');
console.log('Time:', new Date().toISOString());

// 启动 Next.js
const next = spawn('npm', ['run', 'dev'], {
  cwd: 'G:\\duanmk\\claw_code\\aura-app',
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: false,
  shell: true,
});

let stdout = '';
let stderr = '';

next.stdout.on('data', (data) => {
  const text = data.toString();
  stdout += text;
  process.stdout.write('[next stdout] ' + text);
  
  // 检查是否 Ready
  if (text.includes('Ready in')) {
    console.log('\n>>> Server reported Ready, checking port...');
    
    // 等待几秒后检查端口
    setTimeout(() => {
      const req = http.get('http://localhost:3000', (res) => {
        console.log('>>> HTTP Request succeeded! Status:', res.statusCode);
        // 保持运行
      });
      req.on('error', (e) => {
        console.log('>>> HTTP Request failed:', e.message);
        console.log('>>> Current processes:');
        const ps = spawn('powershell', ['-Command', 'Get-Process node | Select-Object Id,ProcessName']);
      });
    }, 2000);
  }
});

next.stderr.on('data', (data) => {
  const text = data.toString();
  stderr += text;
  process.stderr.write('[next stderr] ' + text);
});

next.on('close', (code) => {
  console.log('\n>>> Process exited with code:', code);
  console.log('>>> Final stdout:', stdout.substring(stdout.length - 500));
});

next.on('error', (err) => {
  console.error('>>> Spawn error:', err);
});

// 30秒后检查
setTimeout(() => {
  console.log('\n=== Final Status ===');
  console.log('Next process running:', !next.killed);
  
  // 检查端口
  const req = http.get('http://localhost:3000', (res) => {
    console.log('Port 3000 is OPEN, status:', res.statusCode);
    process.exit(0);
  });
  req.on('error', (e) => {
    console.log('Port 3000 is CLOSED:', e.message);
    console.log('Stdout collected:', stdout);
    console.log('Stderr collected:', stderr);
    process.exit(1);
  });
}, 30000);
