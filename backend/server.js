require('dotenv').config();

const express = require('express');
const connectDB = require('./config/database');
const port =  process.env.PORT || 5000

const app = express();

connectDB();

app.get('/', (req, res) => {
  res.send('Server running');
});

app.listen(port, () => {
  console.log('🚀 Server started on port 5000');
});
