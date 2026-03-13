import { NavLink } from 'react-router-dom';
import { Home, Camera, Users } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Home size={24} />
        <span>Dashboard</span>
      </NavLink>
      
      <NavLink 
        to="/screening" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Camera size={24} />
        <span>Screening</span>
      </NavLink>

      <NavLink 
        to="/patients" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Users size={24} />
        <span>Patients</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;
