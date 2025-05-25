const express = require('express');
const bodyParser = require('body-parser');
const configRoutes = require('./routes/configRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api', configRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
