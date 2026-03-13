import { Activity, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPatients } from '../utils/localStorage';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const allPatients = getPatients();
    if (user.role === 'patient') {
      setPatients(allPatients.filter(p => p.createdBy === user.id));
    } else {
      setPatients(allPatients);
    }
  }, [user]);

  const pendingCount = patients.filter(p => p.status === 'pending').length;
  const recentPatients = patients.slice(0, 3); // Get 3 most recent

  return (
    <div className="dashboard">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="text-title">Welcome, {user.name}</h2>
        <p className="text-muted">{user.role === 'admin' ? 'Primary Care Center, Rural District' : 'Patient Portal'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '8px' }}>
            <Activity size={20} />
            <span className="font-medium text-sm">{user.role === 'admin' ? 'Total Screenings' : 'My Screenings'}</span>
          </div>
          <p className="text-title" style={{ fontSize: '2rem' }}>{patients.length}</p>
        </div>
        
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', marginBottom: '8px' }}>
            <Clock size={20} />
            <span className="font-medium text-sm">Pending Review</span>
          </div>
          <p className="text-title" style={{ fontSize: '2rem' }}>{pendingCount}</p>
        </div>
      </div>

      <button className="btn btn-primary" onClick={() => navigate('/screening')} style={{ marginBottom: '32px', padding: '16px' }}>
        <Activity size={20} />
        Start New Screening
      </button>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="font-bold text-lg">Recent Screenings</h3>
          <button className="text-primary text-sm font-medium" onClick={() => navigate('/patients')} style={{ color: 'var(--primary)' }}>
            View All
          </button>
        </div>

        {recentPatients.length === 0 && (
          <p className="text-muted" style={{ textAlign: 'center', padding: '16px' }}>No screenings found.</p>
        )}

        {recentPatients.map((patient) => (
          <div key={patient.id} className="card" onClick={() => navigate('/patients')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="font-bold">{patient.name} ({patient.age}y)</p>
                <p className="text-sm text-muted">ID: {patient.id} • {patient.diagnosis || 'Pending'}</p>
              </div>
              <span className={`badge ${patient.status}`}>{patient.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
