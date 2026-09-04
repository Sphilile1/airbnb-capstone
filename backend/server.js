const mongoose = require('mongoose');
require('dotenv').config();
const { createApp } = require('./app');

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const app = createApp();
  return app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
}

module.exports = { startServer };
