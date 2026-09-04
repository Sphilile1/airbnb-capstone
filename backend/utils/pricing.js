function daysBetween(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.ceil((end - start) / 86400000);
}

function calculateReservationTotals(accommodation, checkIn, checkOut) {
  const nights = daysBetween(checkIn, checkOut);
  if (nights < 1) {
    const error = new Error('Check-out must be after check-in');
    error.status = 400;
    throw error;
  }

  const subtotal = accommodation.price * nights;
  const weeklyDiscount = nights >= 7 ? accommodation.weeklyDiscount : 0;
  const cleaningFee = accommodation.cleaningFee || 0;
  const serviceFee = accommodation.serviceFee || 0;
  const occupancyTaxes = accommodation.occupancyTaxes || 0;
  const total = subtotal - weeklyDiscount + cleaningFee + serviceFee + occupancyTaxes;

  return {
    nights,
    subtotal,
    weeklyDiscount,
    cleaningFee,
    serviceFee,
    occupancyTaxes,
    total
  };
}

module.exports = { daysBetween, calculateReservationTotals };
