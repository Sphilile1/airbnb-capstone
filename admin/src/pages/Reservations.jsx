import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Reservations() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    return api('/api/reservations/host')
      .then(setRows)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async id => {
    if (!confirm('Cancel this reservation?')) return;
    try {
      await api(`/api/reservations/${id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="admin-main">
      <div className="page-heading"><div><p className="eyebrow">Bookings</p><h1>Reservations</h1><p className="admin-subtitle">Review guest stays and manage test reservations.</p></div></div>
      {error && <p className="error" role="alert">{error}</p>}
      {loading ? <div className="empty-state">Loading reservations…</div> : (
        <div className="admin-card table-card">
          <table>
            <thead><tr><th>Guest</th><th>Listing</th><th>Dates</th><th>Guests</th><th>Total</th><th></th></tr></thead>
            <tbody>
              {rows.map(row => (
                <tr key={row._id}>
                  <td><strong>{row.user?.username || 'Guest'}</strong><br/><small>{row.user?.email || ''}</small></td>
                  <td>{row.accommodation?.title || 'Deleted listing'}</td>
                  <td>{new Date(row.checkIn).toLocaleDateString()} – {new Date(row.checkOut).toLocaleDateString()}</td>
                  <td>{row.guests}</td>
                  <td><strong>R{Number(row.total || 0).toLocaleString()}</strong></td>
                  <td><button className="admin-danger-button" onClick={() => remove(row._id)}>Cancel</button></td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan="6">No reservations yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
