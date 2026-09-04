import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/BrandMark';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card polished-auth" onSubmit={submit}>
        <div className="auth-brand"><BrandMark size={38} /><span>airbnb</span></div>
        <div className="auth-heading">
          <p className="eyebrow">Welcome to Airbnb</p>
          <h1>{mode === 'login' ? 'Log in' : 'Create your account'}</h1>
          <p>{mode === 'login' ? 'Log in to manage your trips and reservations.' : 'Create an account to reserve your next stay.'}</p>
        </div>

        {mode === 'register' && (
          <label>Username<input required autoComplete="username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></label>
        )}
        <label>Email<input required autoComplete="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength="6" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>

        {error && <p className="error">{error}</p>}
        <button className="reserve-button auth-submit">{mode === 'login' ? 'Log in' : 'Create account'}</button>
        <div className="auth-switch">
          <span>{mode === 'login' ? 'New to Airbnb?' : 'Already have an account?'}</span>
          <button type="button" className="text-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Create an account' : 'Log in'}
          </button>
        </div>
      </form>
    </section>
  );
}
