const { spawn } = require('child_process');

// Spawn the server script
const server = spawn('node', ['cors-server.js']);

// Handle stdout
server.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

// Handle stderr
server.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

// Handle process exit
server.on('close', (code) => {
    console.log(`CORS server process exited with code ${code}`);
});
