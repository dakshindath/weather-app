const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authroute = require('./routes/userroute');
const weatherroute = require('./routes/weatherroute');

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());

app.use(express.json());

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

app.use('/auth', authroute);
app.use('/weather', weatherroute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
