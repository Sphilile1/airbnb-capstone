require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Accommodation = require('./models/Accommodation');
const { allSeedListings } = require('./seedData');

const oldSeedTitles = new Set([
  'Modern Apartment in Cape Town',
  'Cozy Sandton Studio',
  'Durban Beachfront Escape'
]);

function isRemoteSeedCandidate(listing) {
  if (!listing) return false;
  const generatedTitle = / Getaway$/.test(listing.title || '');
  const knownTitle = oldSeedTitles.has(listing.title);
  const remoteImages = !listing.images?.length || listing.images.every(img => /^https?:\/\//.test(img));
  return (generatedTitle || knownTitle) && remoteImages;
}

async function ensureAdmin() {
  let admin = await User.findOne({ email: 'admin@example.com' });
  if (admin) return admin;

  admin = await User.create({
    username: 'Admin Host',
    email: 'admin@example.com',
    password: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'password123', 12),
    role: 'admin'
  });
  return admin;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await ensureAdmin();
  const desired = allSeedListings(admin);
  let added = 0;
  let refreshed = 0;
  let migrated = 0;

  for (const data of desired) {
    let listing = await Accommodation.findOne({ seedKey: data.seedKey });

    // Migrate one legacy generated listing per location into the first seeded
    // variant, while leaving user-uploaded/custom listings untouched.
    if (!listing && data.seedKey.endsWith('-1')) {
      const legacy = await Accommodation.findOne({
        location: { $regex: `^${data.location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
      });
      if (isRemoteSeedCandidate(legacy)) {
        listing = legacy;
        migrated++;
      }
    }

    if (listing) {
      Object.assign(listing, data);
      await listing.save();
      refreshed++;
    } else {
      await Accommodation.create(data);
      added++;
    }
  }

  console.log(`Destination seed complete. Added ${added}, refreshed ${refreshed}, migrated ${migrated}.`);
  console.log('Result: 3 seeded stays per location with five-photo galleries.');
  console.log('Custom listings and locally uploaded images are not deleted.');
  await mongoose.disconnect();
}

run().catch(async error => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
