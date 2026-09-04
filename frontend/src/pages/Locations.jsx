import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import ListingCard from '../components/ListingCard';

const titleCase = (value = '') =>
  value.trim().replace(/\b\w/g, char => char.toUpperCase());

export default function Locations() {
  const [params, setParams] = useSearchParams();
  const location = params.get('location') || '';
  const guests = params.get('guests') || '';
  const type = params.get('type') || '';
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError('');
    setLoading(true);
    const query = new URLSearchParams();
    if (location) query.set('location', location);
    if (guests) query.set('guests', guests);
    if (type) query.set('type', type);

    api(`/api/accommodations?${query.toString()}`)
      .then(setListings)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [location, guests, type]);

  const prettyLocation = useMemo(() => titleCase(location), [location]);
  const countLabel = `${listings.length} ${listings.length === 1 ? 'stay' : 'stays'}`;

  const setType = value => {
    const next = new URLSearchParams(params);
    if (value) next.set('type', value);
    else next.delete('type');
    setParams(next);
  };

  return (
    <section className="section location-page">
      <p className="results-count">{loading ? 'Finding stays…' : countLabel}</p>
      <h1>{location ? `Stays in ${prettyLocation}` : 'Explore stays'}</h1>
      <p className="results-subtitle">
        {location ? `Places to stay in ${prettyLocation}` : 'Find a place that feels right for your trip.'}
      </p>

      <div className="location-filter-bar" aria-label="Stay filters">
        <span className="filter-label"><SlidersHorizontal size={17} /> Filters</span>
        {['', 'Entire apartment', 'Entire rental unit', 'Entire home'].map(value => (
          <button
            type="button"
            key={value || 'all'}
            className={type === value ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setType(value)}
          >
            {value || 'Any type'}
          </button>
        ))}
        {guests && <span className="filter-summary">{guests} guest{Number(guests) === 1 ? '' : 's'}</span>}
      </div>

      {error && <p className="error">{error}</p>}
      <div className="location-results">
        {listings.map(listing => <ListingCard key={listing._id} listing={listing} horizontal />)}
      </div>

      {!loading && !error && listings.length === 0 && (
        <div className="empty-state">
          <h2>No stays found</h2>
          <p>Try another destination or remove one of the filters above.</p>
        </div>
      )}
    </section>
  );
}
