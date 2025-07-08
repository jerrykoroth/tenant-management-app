const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const tenantRoutes = require('./routes/tenantRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', tenantRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
