const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  accommodation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1 },
  nights: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true, min: 0 },
  weeklyDiscount: { type: Number, default: 0 },
  cleaningFee: { type: Number, default: 0 },
  serviceFee: { type: Number, default: 0 },
  occupancyTaxes: { type: Number, default: 0 },
  total: { type: Number, required: true, min: 0 }
}, { timestamps: true });

reservationSchema.index({ user: 1, createdAt: -1 });
reservationSchema.index({ host: 1, createdAt: -1 });

module.exports = mongoose.model('Reservation', reservationSchema);
