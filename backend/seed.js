require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Accommodation = require('./models/Accommodation');
const Reservation = require('./models/Reservation');
const { allSeedListings } = require('./seedData');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Reservation.deleteMany({});
  await Accommodation.deleteMany({});
  await User.deleteMany({});

  const admin = await User.create({
    username: 'Admin Host',
    email: 'admin@example.com',
    password: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'password123', 12),
    role: 'admin'
  });

  await User.create({
    username: 'Demo User',
    email: 'user@example.com',
    password: await bcrypt.hash(process.env.SEED_USER_PASSWORD || 'password123', 12),
    role: 'user'
  });

  const listings = allSeedListings(admin);
  await Accommodation.insertMany(listings);

  console.log(`Seed complete: ${listings.length} listings across 34 locations.`);
  console.log('Each location has 3 stays and each seeded stay has a 5-image gallery.');
  console.log('Drakensberg uses a real Drakensberg, South Africa landscape image.');
  console.log('Admin: admin@example.com');
  console.log('User: user@example.com');
  await mongoose.disconnect();
}

seed().catch(async error => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
