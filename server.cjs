// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/api/saveFormData', (req, res) => {
  const formData = req.body;
  const filePath = path.join(__dirname, 'formData.json');

  fs.writeFile(filePath, JSON.stringify(formData, null, 2), (err) => {
    if (err) {
      console.error('Error writing file', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json({ message: 'Form data saved successfully' });
  });
});

app.get('/api/getFormData', (req, res) => {
  const filePath = path.join(__dirname, 'formData.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
