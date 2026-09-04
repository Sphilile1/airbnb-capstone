const express = require('express');
const cors = require('cors');
const path = require('path');

const accommodationRoutes = require('./routes/accommodationRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userRoutes = require('./routes/userRoutes');

/**
 * Build the Express application separately from the database/listener startup.
 * Keeping app creation isolated makes middleware/routes easier to test and reuse.
 */
function createApp() {
  const app = express();
  app.disable('x-powered-by');

  const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    'http://localhost:5173',
    'http://localhost:5174'
  ].filter(Boolean);

  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      const error = new Error('Not allowed by CORS');
      error.status = 403;
      return callback(error);
    }
  }));

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  });

  app.use(express.json({ limit: '2mb' }));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.get('/', (req, res) => res.json({ message: 'Airbnb Clone API is running' }));
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/api/accommodations', accommodationRoutes);
  app.use('/api/reservations', reservationRoutes);
  app.use('/api/users', userRoutes);

  app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

  app.use((err, req, res, next) => {
    console.error(err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Image is too large. Maximum size is 5MB.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Upload a maximum of 5 images.' });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid resource id' });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A record with that value already exists' });
    }
    return res.status(err.status || 500).json({ message: err.message || 'Server error' });
  });

  return app;
}

module.exports = { createApp };
