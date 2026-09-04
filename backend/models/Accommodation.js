const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  seedKey: { type: String, trim: true, index: true, sparse: true },
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true, trim: true },
  bedrooms: { type: Number, required: true, min: 0 },
  bathrooms: { type: Number, required: true, min: 0 },
  guests: { type: Number, required: true, min: 1 },
  type: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  amenities: [{ type: String, trim: true }],
  images: [{ type: String, trim: true }],
  weeklyDiscount: { type: Number, default: 0, min: 0 },
  cleaningFee: { type: Number, default: 0, min: 0 },
  serviceFee: { type: Number, default: 0, min: 0 },
  occupancyTaxes: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviews: { type: Number, default: 0, min: 0 },
  host: { type: String, default: 'Airbnb Host' },
  host_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  enhancedCleaning: { type: Boolean, default: true },
  selfCheckIn: { type: Boolean, default: true }
}, { timestamps: true });

accommodationSchema.index({ location: 1, price: 1 });

module.exports = mongoose.model('Accommodation', accommodationSchema);
