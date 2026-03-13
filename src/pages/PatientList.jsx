import { useState, useEffect } from 'react';
import { Search, Phone, MapPin, FileText, Trash2, Edit } from 'lucide-react';
import { getPatients, updatePatient, deletePatient } from '../utils/localStorage';
import { useAuth } from '../context/AuthContext';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ diagnosis: '', status: '' });
  
  const { user } = useAuth();

  const loadPatients = () => {
    const all = getPatients();
    if (user.role === 'patient') {
      setPatients(all.filter(p => p.createdBy === user.id));
    } else {
      setPatients(all);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [user]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      deletePatient(selectedPatient.id);
      setSelectedPatient(null);
      loadPatients();
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updated = updatePatient(selectedPatient.id, editForm);
    setSelectedPatient(updated);
    setIsEditing(false);
    loadPatients();
  };

  const filteredPatients = patients.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (selectedPatient) {
    return (
      <div className="animate-fade-in pb-20">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button 
            onClick={() => { setSelectedPatient(null); setIsEditing(false); }}
            className="text-primary font-medium flex items-center gap-1"
            style={{ color: 'var(--primary)' }}
          >
            ← Back to List
          </button>
          {user.role === 'admin' && !isEditing && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => { setEditForm({ diagnosis: selectedPatient.diagnosis || '', status: selectedPatient.status }); setIsEditing(true); }}
                className="btn btn-outline" style={{ padding: '8px' }}>
                <Edit size={16} />
              </button>
              <button onClick={handleDelete} className="btn btn-outline" style={{ padding: '8px', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h2 className="text-title">{selectedPatient.name}</h2>
              <p className="text-muted">{selectedPatient.id} • {selectedPatient.age} years old</p>
            </div>
            <span className={`badge ${selectedPatient.status}`}>{selectedPatient.status}</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <button className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '0.875rem' }}>
              <Phone size={16} /> Contact
            </button>
            <button className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '0.875rem' }}>
              <MapPin size={16} /> Locate
            </button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 className="font-bold border-b pb-2 mb-2" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '12px' }}>Screening Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', fontSize: '0.875rem' }}>
              <span className="text-muted">Date:</span>
              <span className="font-medium">{selectedPatient.date}</span>
              
              <span className="text-muted">Symptom:</span>
              <span className="font-medium">{selectedPatient.symptom || 'Not specified'}</span>
              
              <span className="text-muted">Diagnosis:</span>
              <span className="font-medium">{selectedPatient.diagnosis || 'Pending Review'}</span>
            </div>
          </div>

          {isEditing ? (
            <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h4 className="font-bold mb-3">Update Medical Record</h4>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label className="form-label">Diagnosis</label>
                  <input type="text" className="form-control" value={editForm.diagnosis} onChange={e => setEditForm({...editForm, diagnosis: e.target.value})} placeholder="e.g. Normal, Cataract" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)} style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {selectedPatient.status === 'reviewed' || selectedPatient.status === 'urgent' ? (
                <div style={{ background: 'var(--primary-light)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', gap: '8px', color: 'var(--primary-dark)', marginBottom: '8px', fontWeight: '600' }}>
                    <FileText size={20} />
                    <span>Doctor's Plan</span>
                  </div>
                  <p className="text-sm">
                    {selectedPatient.status === 'urgent' 
                      ? 'Immediate referral to secondary hospital required. Patient needs comprehensive exam for suspected glaucoma.' 
                      : selectedPatient.diagnosis?.includes('Normal') 
                        ? 'No immediate concern. Recommend routine follow-up in 12 months.'
                        : 'Refer to local community health center for basic treatment. Follow up in 30 days.'}
                  </p>
                </div>
              ) : (
                <div style={{ background: 'var(--warning-light)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--warning)' }}>A specialist is currently reviewing the images. Please wait for the final diagnosis.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="patient-list">
      <h2 className="text-title" style={{ marginBottom: '16px' }}>{user.role === 'admin' ? 'Patient Records' : 'My Records'}</h2>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <select 
          className="form-control" 
          style={{ width: 'auto' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="card" style={{ marginBottom: 0, cursor: 'pointer' }} onClick={() => setSelectedPatient(patient)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="font-bold text-lg">{patient.name}</p>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>{patient.id}</span>
                  <span>•</span>
                  <span>{patient.age}y</span>
                  <span>•</span>
                  <span>{patient.date}</span>
                </div>
              </div>
              <span className={`badge ${patient.status}`}>{patient.status}</span>
            </div>
          </div>
        ))}
        {filteredPatients.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
            No records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
