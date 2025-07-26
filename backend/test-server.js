const express = require('express');
const app = express();

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test server is running',
    timestamp: new Date().toISOString()
  });
});

// Test API endpoint
app.post('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test API endpoint working',
    data: req.body
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 