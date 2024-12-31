const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');

const addressRoutes = require('./routes/addressRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/addresses', addressRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
