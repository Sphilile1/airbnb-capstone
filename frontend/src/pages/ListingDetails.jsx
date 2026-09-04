import {
  BedDouble, Check, Heart, KeyRound, MapPin, Share2, ShieldCheck,
  Sparkles, Star, Wifi, CookingPot, Car, Waves, Laptop, X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, imageUrl } from '../api';
import { useAuth } from '../context/AuthContext';

function daysBetween(a, b) {
  if (!a || !b) return 0;
  const start = new Date(a);
  const end = new Date(b);
  return Math.max(0, Math.ceil((end - start) / 86400000));
}

const amenityIcons = {
  Wifi,
  Kitchen: CookingPot,
  'Free parking': Car,
  Pool: Waves,
  Workspace: Laptop,
  'Dedicated workspace': Laptop
};

export default function ListingDetails() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [checkIn, setCheckIn] = useState(params.get('when') || '');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(Math.max(1, Number(params.get('guests')) || 1));
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    api(`/api/accommodations/${id}`)
      .then(data => {
        setListing(data);
        setGuests(prev => Math.min(prev, data.guests || prev));
      })
      .catch(err => setMessage(err.message));
  }, [id]);

  const nights = daysBetween(checkIn, checkOut);
  const costs = useMemo(() => {
    if (!listing) return {};
    const subtotal = listing.price * nights;
    const discount = nights >= 7 ? listing.weeklyDiscount : 0;
    const total = subtotal - discount + listing.cleaningFee + listing.serviceFee + listing.occupancyTaxes;
    return { subtotal, discount, total };
  }, [listing, nights]);

  if (!listing) return <section className="section"><p>{message || 'Loading stay…'}</p></section>;

  const images = listing.images?.length ? listing.images : ['/listing-placeholder.svg'];
  const galleryImages = Array.from({ length: 5 }, (_, index) => images[index] || images[index % images.length]);

  const reserve = async () => {
    setMessage('');
    if (!user) return navigate('/login');
    if (nights < 1) return setMessage('Choose valid check-in and check-out dates.');

    try {
      await api('/api/reservations', {
        method: 'POST',
        body: JSON.stringify({ accommodation: listing._id, checkIn, checkOut, guests })
      });
      setMessage('Reservation created successfully. View it from your profile menu.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage('Listing link copied.');
    } catch {
      setMessage('Copy the page address from your browser to share this stay.');
    }
  };

  const rating = Number(listing.rating || 0);
  const reviewScores = [
    ['Cleanliness', Math.min(5, rating + 0.08)],
    ['Accuracy', Math.max(0, rating - 0.02)],
    ['Check-in', Math.min(5, rating + 0.04)],
    ['Communication', Math.min(5, rating + 0.06)],
    ['Location', Math.min(5, rating + 0.03)],
    ['Value', Math.max(0, rating - 0.05)]
  ];

  return (
    <section className="section details-page">
      <div className="details-title-row">
        <div>
          <h1>{listing.title}</h1>
          <p className="details-subtitle">
            <Star size={15} fill="currentColor" /> {rating.toFixed(2)} · <u>{listing.reviews} reviews</u> · <MapPin size={15} /> <u>{listing.location}</u>
          </p>
        </div>
        <div className="details-actions">
          <button type="button" onClick={share}><Share2 size={17} /> Share</button>
          <button type="button" onClick={() => setSaved(v => !v)}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}</button>
        </div>
      </div>

      <div className="gallery">
        <img className="gallery-main" src={imageUrl(galleryImages[0])} alt={listing.title} onError={e => { e.currentTarget.src = '/listing-placeholder.svg'; }} />
        <div className="gallery-small">
          {galleryImages.slice(1).map((src, i) => (
            <img key={`${src}-${i}`} src={imageUrl(src)} alt={`${listing.title} view ${i + 2}`} onError={e => { e.currentTarget.src = '/listing-placeholder.svg'; }} />
          ))}
        </div>
        <button className="show-photos-button" type="button" onClick={() => setShowAllPhotos(true)}>▦ Show all photos</button>
      </div>

      {showAllPhotos && (
        <div className="photo-modal" role="dialog" aria-modal="true" aria-label={`All photos for ${listing.title}`}>
          <div className="photo-modal-toolbar">
            <button type="button" onClick={() => setShowAllPhotos(false)} aria-label="Close photo gallery"><X size={22} /></button>
            <strong>{listing.title}</strong>
          </div>
          <div className="photo-modal-grid">
            {galleryImages.map((src, i) => (
              <img key={`all-${src}-${i}`} src={imageUrl(src)} alt={`${listing.title} photo ${i + 1}`} onError={e => { e.currentTarget.src = '/listing-placeholder.svg'; }} />
            ))}
          </div>
        </div>
      )}

      <div className="details-layout">
        <div className="details-content">
          <div className="host-summary">
            <div>
              <h2>{listing.type} hosted by {listing.host}</h2>
              <p>{listing.guests} guests · {listing.bedrooms} bedrooms · {listing.bathrooms} bathrooms</p>
            </div>
            <div className="host-avatar">{String(listing.host || 'A').charAt(0).toUpperCase()}</div>
          </div>

          <div className="guest-favourite">
            <Sparkles size={25} />
            <strong>Guest favourite</strong>
            <span>One of the most-loved homes in this clone, based on ratings and reliability.</span>
            <b>{rating.toFixed(2)} ★</b>
          </div>

          <div className="listing-highlights">
            {listing.enhancedCleaning && <div><ShieldCheck /><span><strong>Enhanced Clean</strong><small>This host follows enhanced cleaning standards.</small></span></div>}
            {listing.selfCheckIn && <div><KeyRound /><span><strong>Self check-in</strong><small>Check yourself in when you arrive.</small></span></div>}
            <div><Check /><span><strong>Great location</strong><small>Use this stay as a comfortable base for exploring {listing.location}.</small></span></div>
          </div>

          <hr />
          <p className="listing-description">{listing.description}</p>
          <hr />

          <h2>Where you'll sleep</h2>
          <div className="sleep-card"><BedDouble size={30} /><strong>Bedroom</strong><span>Comfortable sleeping space</span></div>

          <h2>What this place offers</h2>
          <div className="amenities amenities-airbnb">
            {listing.amenities?.map(item => {
              const Icon = amenityIcons[item] || Check;
              return <span key={item}><Icon size={20} /> {item}</span>;
            })}
          </div>

          <hr />
          <h2>{nights || 7} nights in {listing.location}</h2>
          <p className="muted">Select your dates in the booking card to update your stay and price instantly.</p>

          <hr />
          <h2 className="reviews-heading"><Star size={25} fill="currentColor" /> {rating.toFixed(2)} · {listing.reviews} reviews</h2>
          <div className="review-grid">
            {reviewScores.map(([label, score]) => (
              <div key={label}><span>{label}</span><strong>{score.toFixed(1)}</strong><i><b style={{ width: `${(score / 5) * 100}%` }} /></i></div>
            ))}
          </div>

          <hr />
          <h2>Meet your host</h2>
          <div className="host-card"><div className="host-avatar large">{String(listing.host || 'A').charAt(0).toUpperCase()}</div><div><strong>{listing.host}</strong><p>Host · Responsive and ready to help with your stay.</p></div></div>

          <hr />
          <h2>Things to know</h2>
          <div className="things-grid">
            <div><strong>House rules</strong><p>No smoking<br />Respect neighbours<br />Follow check-in instructions</p></div>
            <div><strong>Health & safety</strong><p>Follow local safety guidance<br />Smoke alarm information<br />Secure your valuables</p></div>
            <div><strong>Cancellation policy</strong><p>Review your dates before booking. Test reservations can be cancelled from Your reservations.</p></div>
          </div>
        </div>

        <aside className="calculator-card">
          <div className="calculator-price">
            <span><strong>R{Number(listing.price).toLocaleString()}</strong> / night</span>
            <span className="mini-rating">★ {rating.toFixed(2)} · <u>{listing.reviews} reviews</u></span>
          </div>
          <div className="date-grid">
            <label>CHECK-IN<input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} /></label>
            <label>CHECKOUT<input type="date" min={checkIn || undefined} value={checkOut} onChange={e => setCheckOut(e.target.value)} /></label>
          </div>
          <label className="guest-field">GUESTS
            <select value={guests} onChange={e => setGuests(Number(e.target.value))}>
              {Array.from({ length: listing.guests }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
            </select>
          </label>
          <button className="reserve-button" onClick={reserve}>Reserve</button>
          <p className="charge-note">You won't be charged yet</p>

          {nights > 0 && (
            <div className="cost-lines">
              <div><span><u>R{listing.price.toLocaleString()} × {nights} nights</u></span><span>R{costs.subtotal.toLocaleString()}</span></div>
              {costs.discount > 0 && <div className="discount-line"><span><u>Weekly discount</u></span><span>-R{costs.discount.toLocaleString()}</span></div>}
              <div><span><u>Cleaning fee</u></span><span>R{listing.cleaningFee.toLocaleString()}</span></div>
              <div><span><u>Service fee</u></span><span>R{listing.serviceFee.toLocaleString()}</span></div>
              <div><span><u>Occupancy taxes</u></span><span>R{listing.occupancyTaxes.toLocaleString()}</span></div>
              <hr />
              <div className="total"><strong>Total</strong><strong>R{costs.total.toLocaleString()}</strong></div>
            </div>
          )}
          {message && <p className={message.includes('successfully') || message.includes('copied') ? 'success' : 'error'}>{message}</p>}
        </aside>
      </div>
    </section>
  );
}
