require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/db');

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`RMS backend listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start RMS backend', error);
    process.exit(1);
  });
