const mongoose = require('mongoose');
const logger = require('./logger');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const genres = require('./routes/genres');
const app = express();


mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log('Could not connect to MongoDB...', err.message));

app.use(express.json());
app.use(helmet());

if (app.get('env') === 'development') {
  app.use(morgan('combined'));
  console.log("Morgan enabled");
}

app.use(logger);

app.use('/api/genres', genres);

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`));