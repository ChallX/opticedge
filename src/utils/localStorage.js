export const initMockData = () => {
  if (!localStorage.getItem('visilant_patients')) {
    const mockPatients = [
      { id: 'VS-8892', name: 'Aarav Patel', age: 45, status: 'pending', date: '2023-10-24', symptom: 'Blurry Vision', risk: 'high', createdBy: 'patient1', phone: '+91 98765 43210', location: 'Village Block A, Near Primary School' },
      { id: 'VS-8891', name: 'Mira Singh', age: 62, status: 'reviewed', date: '2023-10-24', diagnosis: 'Normal', risk: 'low', createdBy: 'patient2', phone: '+91 98765 43211', location: 'Village Block B, Sector 4' },
      { id: 'VS-8890', name: 'Rajesh Kumar', age: 55, status: 'urgent', date: '2023-10-23', diagnosis: 'Glaucoma Risk', risk: 'high', createdBy: 'admin', phone: '+91 98765 43212', location: 'Village Block C, Near Water Tower' },
      { id: 'VS-8889', name: 'Sunita Devi', age: 38, status: 'reviewed', date: '2023-10-21', diagnosis: 'Cataract (Early)', risk: 'medium', createdBy: 'admin', phone: '+91 98765 43213', location: 'Village Block A, Main Road' },
      { id: 'VS-8888', name: 'Kabir Das', age: 71, status: 'reviewed', date: '2023-10-20', diagnosis: 'Normal', risk: 'low', createdBy: 'patient1', phone: '+91 98765 43214', location: 'Village Block D' },
    ];
    // Force reset for this demonstration so existing users see the new fields immediately
    localStorage.setItem('visilant_patients', JSON.stringify(mockPatients));
  }
};

export const getPatients = () => {
  return JSON.parse(localStorage.getItem('visilant_patients') || '[]');
};

export const savePatient = (patient) => {
  const patients = getPatients();
  const id = `VS-${Math.floor(Math.random() * 9000) + 1000}`;
  const newPatient = {
    ...patient,
    id,
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
  };
  patients.unshift(newPatient); // Add to beginning
  localStorage.setItem('visilant_patients', JSON.stringify(patients));
  return newPatient;
};

export const updatePatient = (id, updates) => {
  const patients = getPatients();
  const index = patients.findIndex(p => p.id === id);
  if (index !== -1) {
    patients[index] = { ...patients[index], ...updates };
    localStorage.setItem('visilant_patients', JSON.stringify(patients));
    return patients[index];
  }
  return null;
};

export const deletePatient = (id) => {
  const patients = getPatients();
  const filtered = patients.filter(p => p.id !== id);
  localStorage.setItem('visilant_patients', JSON.stringify(filtered));
};

export const getUserByCredentials = (role, username, password) => {
  // Simple mock authentication
  if (role === 'admin' && username === 'admin' && password === 'admin') {
    return { id: 'admin1', username: 'admin', role: 'admin', name: 'Dr. Sharma' };
  }
  if (role === 'patient' && username && password === 'password') {
    return { id: username, username, role: 'patient', name: username };
  }
  return null;
};
