const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');
const { calculateReservationTotals } = require('../utils/pricing');

async function reservationPayload(accommodation, checkIn, checkOut, guests) {
  const guestCount = Number(guests);
  if (!Number.isInteger(guestCount) || guestCount < 1) {
    const error = new Error('Guest count must be at least 1');
    error.status = 400;
    throw error;
  }
  if (guestCount > accommodation.guests) {
    const error = new Error(`This stay allows a maximum of ${accommodation.guests} guests`);
    error.status = 400;
    throw error;
  }

  const totals = calculateReservationTotals(accommodation, checkIn, checkOut);
  return {
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    guests: guestCount,
    ...totals
  };
}

exports.createReservation = async (req, res, next) => {
  try {
    const { accommodation: accommodationId, checkIn, checkOut, guests } = req.body;
    if (!accommodationId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: 'Accommodation, dates and guest count are required' });
    }

    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) return res.status(404).json({ message: 'Accommodation not found' });

    const pricing = await reservationPayload(accommodation, checkIn, checkOut, guests);
    const reservation = await Reservation.create({
      accommodation: accommodation._id,
      user: req.user.id,
      host: accommodation.host_id || undefined,
      ...pricing
    });

    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
};

exports.getReservationsByUser = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('accommodation')
      .sort({ createdAt: -1 })
      .lean();
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

exports.getReservationsByHost = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { host: req.user.id };
    const reservations = await Reservation.find(filter)
      .populate('accommodation')
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .lean();
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

exports.updateReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    const isOwner = reservation.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not allowed to update this reservation' });

    const accommodation = await Accommodation.findById(reservation.accommodation);
    if (!accommodation) return res.status(404).json({ message: 'Accommodation not found' });

    const pricing = await reservationPayload(
      accommodation,
      req.body.checkIn || reservation.checkIn,
      req.body.checkOut || reservation.checkOut,
      req.body.guests || reservation.guests
    );

    Object.assign(reservation, pricing);
    await reservation.save();
    res.json(reservation);
  } catch (error) {
    next(error);
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    const isOwner = reservation.user.toString() === req.user.id;
    const isHost = reservation.host?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isHost && !isAdmin) {
      return res.status(403).json({ message: 'Not allowed to delete this reservation' });
    }

    await reservation.deleteOne();
    res.json({ message: 'Reservation deleted' });
  } catch (error) {
    next(error);
  }
};
