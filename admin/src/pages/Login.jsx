import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/BrandMark';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@example.com', password: 'password123' });
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" />;

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password) return setError('Enter your email and password.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');

    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="admin-login-page">
      <form className="admin-card login-card polished-admin-login" onSubmit={submit}>
        <div className="admin-login-brand"><BrandMark size={38}/><span>airbnb admin</span></div>
        <div className="admin-login-icon"><LockKeyhole size={24}/></div>
        <div><p className="eyebrow">Host tools</p><h1>Welcome back</h1><p className="login-copy">Sign in to manage property listings and reservations.</p></div>
        <label>Email
          <input required autoComplete="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/>
        </label>
        <label>Password
          <input required autoComplete="current-password" minLength="6" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/>
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="primary-button">Log in</button>
      </form>
    </main>
  );
}
