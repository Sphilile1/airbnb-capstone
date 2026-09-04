const { imagesForLocation } = require('./destinationImages');

const locations = [
  'Cape Town', 'Johannesburg', 'Durban', 'Pretoria',
  'Phoenix', 'Hot Springs', 'Los Angeles', 'San Diego', 'San Francisco', 'Barcelona', 'Prague', 'Washington',
  'Drakensberg', 'Knysna', 'Clarens', 'Hermanus', 'Sabie', 'Cederberg', 'Hazyview', 'Storms River',
  'Dullstroom', 'Underberg', 'Magaliesburg', 'Graskop', 'Haenertsburg', 'Hogsback', 'Montagu', 'Citrusdal',
  'Umhlanga', 'Ballito', 'Plett', 'Jeffreys Bay', 'Port Alfred', 'Margate'
];

const templates = [
  {
    label: 'Modern Apartment',
    type: 'Entire apartment',
    amenities: ['Wifi', 'Kitchen', 'Free parking', 'Workspace', 'Air conditioning']
  },
  {
    label: 'Stylish Loft',
    type: 'Entire rental unit',
    amenities: ['Wifi', 'Kitchen', 'Dedicated workspace', 'Washer', 'Smart TV']
  },
  {
    label: 'Cozy Retreat',
    type: 'Entire home',
    amenities: ['Wifi', 'Kitchen', 'Free parking', 'Patio', 'Pool']
  }
];

function makeListing(location, locationIndex, variant, host) {
  const template = templates[variant];
  const priceSteps = [950, 1100, 1250, 1450, 1650, 1850, 2100, 2350];
  const basePrice = priceSteps[(locationIndex + variant * 2) % priceSteps.length];
  const price = basePrice + variant * 180;
  const bedrooms = 1 + ((locationIndex + variant) % 3);
  const bathrooms = 1 + ((locationIndex + variant) % 2);
  const guests = Math.max(2, bedrooms * 2);

  return {
    seedKey: `${location.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${variant + 1}`,
    title: `${template.label} in ${location}`,
    location,
    description: `A polished ${template.label.toLowerCase()} with comfortable interiors, thoughtful amenities and a convenient base for exploring ${location}.`,
    bedrooms,
    bathrooms,
    guests,
    type: template.type,
    price,
    amenities: template.amenities,
    images: imagesForLocation(location, variant),
    weeklyDiscount: Math.round(price * 0.25),
    cleaningFee: 220 + ((locationIndex + variant) % 4) * 45,
    serviceFee: 170 + ((locationIndex + variant) % 4) * 35,
    occupancyTaxes: 110 + ((locationIndex + variant) % 5) * 25,
    rating: Number((4.62 + ((locationIndex * 3 + variant) % 34) / 100).toFixed(2)),
    reviews: 28 + locationIndex * 5 + variant * 17,
    host: host?.username || 'Airbnb Host',
    host_id: host?._id,
    enhancedCleaning: true,
    selfCheckIn: variant !== 2
  };
}

function allSeedListings(host) {
  return locations.flatMap((location, locationIndex) =>
    templates.map((_, variant) => makeListing(location, locationIndex, variant, host))
  );
}

module.exports = { locations, templates, makeListing, allSeedListings };
