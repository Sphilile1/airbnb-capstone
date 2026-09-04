import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Reservations() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    api('/api/reservations/user').then(setRows).catch(err => setError(err.message));
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  if (!user) return <section className="section"><p>Please <Link to="/login">log in</Link> to view reservations.</p></section>;

  const remove = async id => {
    if (!confirm('Cancel this reservation?')) return;
    try {
      await api(`/api/reservations/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="section">
      <h1>Your reservations</h1>
      {error && <p className="error">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Stay</th><th>Location</th><th>Dates</th><th>Guests</th><th>Total</th><th></th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id}>
                <td>{r.accommodation?.title}</td>
                <td>{r.accommodation?.location}</td>
                <td>{new Date(r.checkIn).toLocaleDateString()} – {new Date(r.checkOut).toLocaleDateString()}</td>
                <td>{r.guests}</td>
                <td>R{r.total.toLocaleString()}</td>
                <td><button className="danger-button" onClick={() => remove(r._id)}>Cancel</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
