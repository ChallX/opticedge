import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Shield, User } from 'lucide-react';

const Login = () => {
  const [role, setRole] = useState('patient');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const success = login(role, username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Admin: admin/admin, Patient: [any name]/password');
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', background: 'var(--primary)', color: 'white' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={48} />
          </div>
        </div>
        <h1 className="text-title" style={{ color: 'white', fontSize: '2.5rem' }}>Visilant</h1>
        <p style={{ opacity: 0.9 }}>Eye care anywhere.</p>
      </div>

      <div className="card" style={{ color: 'var(--text-main)' }}>
        <h2 className="font-bold text-lg" style={{ marginBottom: '24px', textAlign: 'center' }}>Sign in to continue</h2>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button 
            type="button"
            onClick={() => setRole('patient')}
            className={`btn ${role === 'patient' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
          >
            <User size={18} /> Patient
          </button>
          <button 
            type="button"
            onClick={() => setRole('admin')}
            className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
          >
            <Shield size={18} /> Admin
          </button>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-control" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            {role === 'patient' && (
              <p className="text-xs text-muted" style={{ marginTop: '4px' }}>Hint: Use 'password' for any username.</p>
            )}
            {role === 'admin' && (
              <p className="text-xs text-muted" style={{ marginTop: '4px' }}>Hint: Use 'admin' / 'admin'.</p>
            )}
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
