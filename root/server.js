const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'publics')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
