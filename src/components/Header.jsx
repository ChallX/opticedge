import { Activity, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { logout, user } = useAuth();

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
        <Activity size={24} />
        <h1>Visilant</h1>
      </div>
      {user && (
        <button 
          onClick={logout} 
          style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}
        >
          <LogOut size={16} /> Logout
        </button>
      )}
    </header>
  );
};

export default Header;
