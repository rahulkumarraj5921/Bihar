const net = require('net');
const client = net.connect({port: 27017, host: 'localhost'}, () => {
    console.log('Connected to MongoDB!');
    process.exit(0);
});
client.on('error', (err) => {
    console.error('Failed to connect:', err.message);
    process.exit(1);
});
setTimeout(() => {
    console.error('Connection timeout');
    process.exit(1);
}, 2000);
