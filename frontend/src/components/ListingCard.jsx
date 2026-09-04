import { Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { imageUrl } from '../api';

export default function ListingCard({ listing, horizontal = false }) {
  const location = useLocation();
  const amenities = (listing.amenities || []).slice(0, 4);
  const query = location.search || '';

  return (
    <Link className={`listing-card ${horizontal ? 'listing-card-horizontal' : ''}`} to={`/listings/${listing._id}${query}`}>
      <div className="listing-image-wrap">
        <img
          src={imageUrl(listing.images?.[0])}
          alt={listing.title}
          onError={e => { e.currentTarget.src = '/listing-placeholder.svg'; }}
        />
        <Heart className="listing-heart" size={24} aria-hidden="true" />
      </div>
      <div className="listing-card-body">
        <div>
          <div className="listing-card-top">
            <span className="muted">{listing.type} in {listing.location}</span>
            <span className="listing-rating">★ {Number(listing.rating || 0).toFixed(2)}</span>
          </div>
          <h2 className="listing-title">{listing.title}</h2>
          <div className="listing-divider" />
          <p className="muted">
            {listing.guests} guests · {listing.bedrooms} bedrooms · {listing.bathrooms} bathrooms
          </p>
          {amenities.length > 0 && <p className="muted amenities-line">{amenities.join(' · ')}</p>}
        </div>
        <div className="listing-price">
          <strong>R{Number(listing.price).toLocaleString()}</strong> <span>/ night</span>
          {listing.reviews ? <small>{listing.reviews} reviews</small> : null}
        </div>
      </div>
    </Link>
  );
}
