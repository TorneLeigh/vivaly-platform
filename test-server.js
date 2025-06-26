const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'https://vivaly.com.au',
    'https://www.vivaly.com.au', 
    'https://vivaly-platform-o2ut.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'API working', timestamp: new Date().toISOString() });
});

app.post('/api/register', (req, res) => {
  res.json({ message: 'Register endpoint working', data: req.body });
});

app.post('/api/login', (req, res) => {
  res.json({ message: 'Login endpoint working', data: req.body });
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
});