const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the frontend/build directory
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Redirect all requests to the frontend
app.get('*', (req, res) => {
  res.redirect('http://localhost:3000');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
