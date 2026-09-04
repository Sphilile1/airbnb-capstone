const test = require('node:test');
const assert = require('node:assert/strict');
const { imagesForLocation } = require('../destinationImages');
const { locations, allSeedListings } = require('../seedData');
const { calculateReservationTotals } = require('../utils/pricing');

test('every seeded stay has exactly five distinct images', () => {
  for (const location of locations) {
    const usedInLocation = new Set();
    for (let variant = 0; variant < 3; variant++) {
      const images = imagesForLocation(location, variant);
      assert.equal(images.length, 5, `${location} variant ${variant + 1} should have 5 images`);
      assert.equal(new Set(images).size, 5, `${location} variant ${variant + 1} contains duplicate images`);
      for (const image of images) {
        assert.ok(!usedInLocation.has(image), `${location} reuses an image between seeded stays`);
        usedInLocation.add(image);
      }
    }
    assert.equal(usedInLocation.size, 15, `${location} should have 15 different seeded images`);
  }
});

test('seed creates three listings per location', () => {
  const listings = allSeedListings({ username: 'Host' });
  assert.equal(listings.length, locations.length * 3);
  for (const location of locations) {
    assert.equal(listings.filter(item => item.location === location).length, 3);
  }
});

test('weekly discount applies at seven nights', () => {
  const stay = { price: 1000, weeklyDiscount: 300, cleaningFee: 200, serviceFee: 100, occupancyTaxes: 50 };
  const six = calculateReservationTotals(stay, '2026-09-01', '2026-09-07');
  const seven = calculateReservationTotals(stay, '2026-09-01', '2026-09-08');
  assert.equal(six.weeklyDiscount, 0);
  assert.equal(six.total, 6350);
  assert.equal(seven.weeklyDiscount, 300);
  assert.equal(seven.total, 7050);
});
