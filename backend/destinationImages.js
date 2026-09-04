const scenicImages = {
  'Cape Town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1400&q=82',
  'Johannesburg': 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?auto=format&fit=crop&w=1400&q=82',
  'Durban': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=82',
  'Pretoria': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1400&q=82',
  'Phoenix': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=82',
  'Hot Springs': 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=1400&q=82',
  'Los Angeles': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=1400&q=82',
  'San Diego': 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1400&q=82',
  'San Francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=82',
  'Barcelona': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1400&q=82',
  'Prague': 'https://images.unsplash.com/photo-1519671282429-b44660ead0a7?auto=format&fit=crop&w=1400&q=82',
  'Washington': 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=1400&q=82',

  // Real Drakensberg, South Africa image (Pexels photo 33702535).
  'Drakensberg': 'https://images.pexels.com/photos/33702535/pexels-photo-33702535.jpeg?auto=compress&cs=tinysrgb&w=1400&h=950&fit=crop',

  'Knysna': 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1400&q=82',
  'Clarens': 'https://images.unsplash.com/photo-1443632864897-14973fa006cf?auto=format&fit=crop&w=1400&q=82',
  'Hermanus': 'https://images.unsplash.com/photo-1498623116890-37e912163d5d?auto=format&fit=crop&w=1400&q=82',
  'Sabie': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=82',
  'Cederberg': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=82',
  'Hazyview': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=82',
  'Storms River': 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=1400&q=82',
  'Dullstroom': 'https://images.unsplash.com/photo-1497436072909-f5e4be1713c0?auto=format&fit=crop&w=1400&q=82',
  'Underberg': 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1400&q=82',
  'Magaliesburg': 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=82',
  'Graskop': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=82',
  'Haenertsburg': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=82',
  'Hogsback': 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1400&q=82',
  'Montagu': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=82',
  'Citrusdal': 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1400&q=82',
  'Umhlanga': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=82',
  'Ballito': 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=82',
  'Plett': 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1400&q=82',
  'Jeffreys Bay': 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=1400&q=82',
  'Port Alfred': 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=1400&q=82',
  'Margate': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=82'
};

// A deliberately large pool of separate apartment/home photos.
// The gallery generator shuffles this pool per location, so the four secondary
// gallery photos are not the same from destination to destination.
const propertyPhotoIds = [
  34590984, 7031715, 7511695, 33893215, 26571207, 6920437, 38645242, 33636638,
  6265833, 6636296, 7511693, 7534270,
  6903157, 34574606, 30767888, 6782479, 19980080, 7535012, 6934170, 28853343,
  17735412, 7060826, 6489093, 27164976, 6588581, 8082562, 7546276, 6980671,
  39017609, 35229095, 7587775, 6438756, 6394612, 7511702,
  6636298, 7214167, 19991829, 6903156, 18254582, 20653867, 7167067, 13722860,
  7545787, 7005269,
  34590980, 6587900, 7005460, 7534564, 7214169, 19608781, 21297769, 6301171,
  32696572, 7045906, 7045908, 6585741,
  18907003, 7534275, 6764827, 29953440, 19899071, 19277901, 6588599, 7534274,
  9976125, 7534296, 7214166, 10117724
];

const propertyUrl = id =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400&h=950&fit=crop`;

function hashString(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffledPropertyIds(location) {
  const items = [...propertyPhotoIds];
  const random = seededRandom(hashString(location));
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/**
 * Returns five different images for a listing.
 * For each location, variants 0, 1 and 2 consume separate parts of a
 * location-specific shuffled photo pool, so the three seeded stays do not
 * reuse one another's apartment photos.
 */
function imagesForLocation(location, variant = 0) {
  const pool = shuffledPropertyIds(location);

  if (variant === 0) {
    return [
      scenicImages[location] || propertyUrl(pool[0]),
      ...pool.slice(0, 4).map(propertyUrl)
    ];
  }

  const start = 4 + ((variant - 1) * 5);
  return pool.slice(start, start + 5).map(propertyUrl);
}

module.exports = {
  scenicImages,
  propertyPhotoIds,
  propertyUrl,
  imagesForLocation
};
