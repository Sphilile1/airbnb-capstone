import { ImagePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

const empty = {
  title: '', location: '', description: '', bedrooms: 1, bathrooms: 1,
  guests: 1, type: 'Entire apartment', price: '', amenities: '',
  weeklyDiscount: 0, cleaningFee: 0, serviceFee: 0, occupancyTaxes: 0
};

export default function ListingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const editing = Boolean(id);

  useEffect(() => {
    if (!editing) return;
    api(`/api/accommodations/${id}`)
      .then(data => setForm({ ...data, amenities: (data.amenities || []).join(', ') }))
      .catch(err => setError(err.message));
  }, [editing, id]);

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    const required = ['title','location','description','type','price'];
    if (required.some(key => !String(form[key]).trim())) return setError('Please complete all required fields.');
    if (Number(form.price) < 0 || Number(form.guests) < 1 || Number(form.bedrooms) < 0 || Number(form.bathrooms) < 0) return setError('Price and room values must be valid positive numbers.');
    if (images.length > 5) return setError('Upload a maximum of 5 images.');

    try {
      setSaving(true);
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (['_id','__v','createdAt','updatedAt','host_id','images','seedKey'].includes(key)) return;
        body.append(key, value);
      });
      images.forEach(file => body.append('images', file));

      await api(editing ? `/api/accommodations/${id}` : '/api/accommodations', {
        method: editing ? 'PUT' : 'POST', body
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="admin-main">
      <div className="page-heading"><div><p className="eyebrow">{editing ? 'Update' : 'Create'}</p><h1>{editing ? 'Update listing' : 'Create a new listing'}</h1><p className="admin-subtitle">Complete the property details guests need before they book.</p></div></div>

      <form className="admin-card listing-form" onSubmit={submit}>
        <div className="form-grid">
          <label>Title *<input required value={form.title} onChange={e => set('title', e.target.value)} /></label>
          <label>Location *<input required value={form.location} onChange={e => set('location', e.target.value)} /></label>
          <label>Type *<select required value={form.type} onChange={e => set('type', e.target.value)}><option>Entire apartment</option><option>Entire rental unit</option><option>Entire home</option></select></label>
          <label>Price per night (R) *<input required min="0" type="number" value={form.price} onChange={e => set('price', e.target.value)} /></label>
          <label>Bedrooms<input min="0" type="number" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} /></label>
          <label>Bathrooms<input min="0" step="0.5" type="number" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} /></label>
          <label>Guests<input min="1" type="number" value={form.guests} onChange={e => set('guests', e.target.value)} /></label>
          <label>Weekly discount (R)<input min="0" type="number" value={form.weeklyDiscount} onChange={e => set('weeklyDiscount', e.target.value)} /></label>
          <label>Cleaning fee (R)<input min="0" type="number" value={form.cleaningFee} onChange={e => set('cleaningFee', e.target.value)} /></label>
          <label>Service fee (R)<input min="0" type="number" value={form.serviceFee} onChange={e => set('serviceFee', e.target.value)} /></label>
          <label>Occupancy taxes (R)<input min="0" type="number" value={form.occupancyTaxes} onChange={e => set('occupancyTaxes', e.target.value)} /></label>
        </div>

        <label>Description *<textarea required rows="6" value={form.description} onChange={e => set('description', e.target.value)} /></label>
        <label>Amenities <small>Separate items with commas.</small><input value={form.amenities} onChange={e => set('amenities', e.target.value)} placeholder="Wifi, Kitchen, Pool" /></label>
        <label className="image-upload-label"><span><ImagePlus size={20}/> Images</span><small>{editing ? 'Leave empty to keep current images, or choose up to 5 replacements.' : 'Choose up to 5 image files, maximum 5MB each.'}</small>
          <input type="file" accept="image/*" multiple onChange={e => {
            const selected = Array.from(e.target.files);
            if (selected.length > 5) {
              setImages([]);
              setError('Upload a maximum of 5 images.');
              e.target.value = '';
              return;
            }
            setError('');
            setImages(selected);
          }} />
          {images.length > 0 && <small>{images.length} image{images.length === 1 ? '' : 's'} selected.</small>}
        </label>

        {error && <p className="error" role="alert">{error}</p>}
        <div className="form-actions"><button type="button" className="secondary-button" onClick={() => navigate('/')}>Cancel</button><button disabled={saving} className="primary-button">{saving ? 'Saving…' : editing ? 'Save changes' : 'Create listing'}</button></div>
      </form>
    </main>
  );
}
