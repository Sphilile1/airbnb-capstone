const Accommodation = require('../models/Accommodation');

const numericFields = [
  'bedrooms', 'bathrooms', 'guests', 'price',
  'weeklyDiscount', 'cleaningFee', 'serviceFee',
  'occupancyTaxes', 'rating', 'reviews'
];

function normalizePayload(body) {
  const payload = { ...body };

  numericFields.forEach((key) => {
    if (payload[key] !== undefined && payload[key] !== '') {
      payload[key] = Number(payload[key]);
    }
  });

  if (typeof payload.amenities === 'string') {
    payload.amenities = payload.amenities.split(',').map(v => v.trim()).filter(Boolean);
  }
  if (typeof payload.images === 'string') {
    payload.images = payload.images.split(',').map(v => v.trim()).filter(Boolean);
  }

  // Ownership/seed metadata is controlled by the server, never by request data.
  delete payload.seedKey;
  delete payload.host_id;
  delete payload.host;
  delete payload._id;
  delete payload.__v;
  delete payload.createdAt;
  delete payload.updatedAt;
  return payload;
}

function validateListing(payload, partial = false) {
  const required = ['title', 'location', 'description', 'type', 'price', 'guests'];

  if (!partial) {
    for (const key of required) {
      const value = payload[key];
      if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) {
        return 'Please complete all required listing fields';
      }
    }
  } else {
    for (const key of ['title', 'location', 'description', 'type']) {
      if (payload[key] !== undefined && !String(payload[key]).trim()) {
        return `${key[0].toUpperCase()}${key.slice(1)} cannot be empty`;
      }
    }
  }

  const nonNegative = [
    'bedrooms', 'bathrooms', 'price', 'weeklyDiscount',
    'cleaningFee', 'serviceFee', 'occupancyTaxes', 'reviews'
  ];
  for (const key of nonNegative) {
    if (payload[key] !== undefined && (!Number.isFinite(payload[key]) || payload[key] < 0)) {
      return `${key} must be a valid non-negative number`;
    }
  }

  if (payload.guests !== undefined && (!Number.isInteger(payload.guests) || payload.guests < 1)) {
    return 'Guests must be a whole number of at least 1';
  }
  if (payload.bedrooms !== undefined && !Number.isInteger(payload.bedrooms)) {
    return 'Bedrooms must be a whole number';
  }
  if (payload.rating !== undefined && (!Number.isFinite(payload.rating) || payload.rating < 0 || payload.rating > 5)) {
    return 'Rating must be between 0 and 5';
  }
  if (payload.images && (!Array.isArray(payload.images) || payload.images.length > 5)) {
    return 'Upload a maximum of 5 images';
  }

  return null;
}

exports.createAccommodation = async (req, res, next) => {
  try {
    const payload = normalizePayload(req.body);
    if (req.files?.length) payload.images = req.files.map(file => `/uploads/${file.filename}`);

    const validationError = validateListing(payload);
    if (validationError) return res.status(400).json({ message: validationError });

    payload.host_id = req.user.id;
    payload.host = req.user.username || 'Airbnb Host';

    const accommodation = await Accommodation.create(payload);
    return res.status(201).json(accommodation);
  } catch (error) {
    return next(error);
  }
};

exports.getAccommodations = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.location) {
      filter.location = { $regex: req.query.location.trim(), $options: 'i' };
    }
    if (req.query.type) filter.type = req.query.type;
    if (req.query.guests) {
      const guests = Number(req.query.guests);
      if (!Number.isInteger(guests) || guests < 1) return res.status(400).json({ message: 'Guests filter must be at least 1' });
      filter.guests = { $gte: guests };
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        const min = Number(req.query.minPrice);
        if (!Number.isFinite(min) || min < 0) return res.status(400).json({ message: 'Minimum price must be valid' });
        filter.price.$gte = min;
      }
      if (req.query.maxPrice) {
        const max = Number(req.query.maxPrice);
        if (!Number.isFinite(max) || max < 0) return res.status(400).json({ message: 'Maximum price must be valid' });
        filter.price.$lte = max;
      }
    }

    const accommodations = await Accommodation.find(filter)
      .sort({ rating: -1, createdAt: -1 })
      .limit(250)
      .lean();
    return res.json(accommodations);
  } catch (error) {
    return next(error);
  }
};

exports.getAccommodationById = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id).lean();
    if (!accommodation) return res.status(404).json({ message: 'Accommodation not found' });
    return res.json(accommodation);
  } catch (error) {
    return next(error);
  }
};

exports.updateAccommodation = async (req, res, next) => {
  try {
    const current = await Accommodation.findById(req.params.id);
    if (!current) return res.status(404).json({ message: 'Accommodation not found' });

    const isAdmin = req.user.role === 'admin';
    const isOwner = current.host_id?.toString() === req.user.id;
    if (!isAdmin && !isOwner) return res.status(403).json({ message: 'You can only update your own listings' });

    const payload = normalizePayload(req.body);
    if (req.files?.length) payload.images = req.files.map(file => `/uploads/${file.filename}`);

    const validationError = validateListing(payload, true);
    if (validationError) return res.status(400).json({ message: validationError });

    Object.assign(current, payload);
    await current.save();
    return res.json(current);
  } catch (error) {
    return next(error);
  }
};

exports.deleteAccommodation = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) return res.status(404).json({ message: 'Accommodation not found' });

    const isAdmin = req.user.role === 'admin';
    const isOwner = accommodation.host_id?.toString() === req.user.id;
    if (!isAdmin && !isOwner) return res.status(403).json({ message: 'You can only delete your own listings' });

    await accommodation.deleteOne();
    return res.json({ message: 'Accommodation deleted' });
  } catch (error) {
    return next(error);
  }
};

// Exported for lightweight unit tests without requiring a database connection.
exports._internals = { normalizePayload, validateListing };
