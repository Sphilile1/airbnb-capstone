const test = require('node:test');
const assert = require('node:assert/strict');
const { _internals } = require('../controllers/accommodationController');

const { normalizePayload, validateListing } = _internals;

test('listing payload normalizes numeric and comma-separated fields', () => {
  const payload = normalizePayload({
    title: 'Stay', location: 'Knysna', description: 'Test', type: 'Entire home',
    price: '1250', guests: '4', amenities: 'Wifi, Kitchen, Pool',
    host: 'Injected Host', host_id: 'bad-owner', seedKey: 'bad-seed'
  });
  assert.equal(payload.price, 1250);
  assert.equal(payload.guests, 4);
  assert.deepEqual(payload.amenities, ['Wifi', 'Kitchen', 'Pool']);
  assert.equal(payload.host, undefined);
  assert.equal(payload.host_id, undefined);
  assert.equal(payload.seedKey, undefined);
});

test('listing validation rejects invalid required and numeric values', () => {
  assert.match(validateListing({}), /required listing fields/);
  assert.match(validateListing({ title:'A', location:'B', description:'C', type:'Entire home', price:-1, guests:2 }), /price/i);
  assert.match(validateListing({ title:'A', location:'B', description:'C', type:'Entire home', price:100, guests:0 }), /Guests/i);
  assert.match(validateListing({ title:'A', location:'B', description:'C', type:'Entire home', price:100, guests:2, rating:6 }), /Rating/i);
});

test('listing validation accepts a valid listing', () => {
  const message = validateListing({
    title:'Knysna Lagoon Apartment', location:'Knysna', description:'Comfortable stay',
    type:'Entire apartment', price:1450, guests:4, bedrooms:2, bathrooms:2,
    weeklyDiscount:300, cleaningFee:250, serviceFee:180, occupancyTaxes:120,
    images:['a','b','c','d','e']
  });
  assert.equal(message, null);
});
