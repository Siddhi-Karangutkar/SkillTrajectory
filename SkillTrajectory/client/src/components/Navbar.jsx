import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import AnimatedLogo from './AnimatedLogo';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'My Dashboard', path: '/dashboard' },
  {
    label: 'Profile',
    dropdown: [
      { label: 'Create Profile', path: '/profile/create' },
      { label: 'Edit Skills', path: '/profile/edit-skills' },
      { label: 'Skill Levels', path: '/profile/skill-levels' }
    ]
  },
  {
    label: 'Career Path',
    dropdown: [
      { label: 'Role Recommendations', path: '/career/recommendations' },
      { label: 'Career Timeline', path: '/career/timeline' },
      { label: 'Sector Transitions', path: '/career/transitions' },
      { label: 'Career Simulator', path: '/career/simulator' },
      { label: 'Job Openings', path: '/career/jobs' },
      { label: 'Skill Wastage', path: '/career/skill-wastage' }
    ]
  },
  {
    label: 'Learning Path',
    dropdown: [
      { label: 'Skill Gap Analysis', path: '/learning/gap-analysis' },
      { label: 'Recommended Courses', path: '/learning/courses' },
      { label: 'Learning Duration', path: '/learning/duration' },
      { label: 'i Interview', path: '/learning/interview' }
    ]
  },
  {
    label: 'Market Analytics',
    dropdown: [
      { label: 'Skill Demand Trends', path: '/dashboard/trends' },
      { label: 'Skill Decay', path: '/dashboard/decay' },
      { label: 'Fairness Metrics', path: '/dashboard/fairness' }
    ]
  },
  { label: 'Community Hub', path: '/community' }
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  const handleDropdownTrigger = (label, isMobile) => {
    if (isMobile) {
      if (activeDropdown === label) {
        setActiveDropdown(null);
      } else {
        setActiveDropdown(label);
      }
    }
  };

  const handleMouseEnter = (label) => {
    if (window.innerWidth > 968) {
      setActiveDropdown(label);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 968) {
      setActiveDropdown(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="brand-logo">
          <AnimatedLogo />
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu desktop-menu">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`nav-item ${item.dropdown ? 'has-dropdown' : ''}`}
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              {item.path ? (
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={`nav-link ${activeDropdown === item.label ? 'active' : ''}`}>
                  {item.label}
                </span>
              )}

              {item.dropdown && (
                <div className={`dropdown-menu ${activeDropdown === item.label ? 'show' : ''}`}>
                  {item.dropdown.map((subItem) => (
                    <Link key={subItem.label} to={subItem.path} className="dropdown-item">
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="nav-actions desktop-actions">
          {user ? (
            <>
              <span className="user-welcome">
                Welcome, <strong>{user.username}</strong>
              </span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline mr-2">Login</Link>
              <Link to="/signup" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="mobile-nav-group">
                <div
                  className="mobile-nav-header"
                  onClick={() => handleDropdownTrigger(item.label, true)}
                >
                  {item.path ? (
                    <Link to={item.path} className="mobile-nav-link">{item.label}</Link>
                  ) : (
                    <span className="mobile-nav-link">{item.label}</span>
                  )}
                  {item.dropdown && (
                    <span className={`arrow ${activeDropdown === item.label ? 'up' : 'down'}`}>▼</span>
                  )}
                </div>

                {item.dropdown && (
                  <div className={`mobile-dropdown ${activeDropdown === item.label ? 'open' : ''}`}>
                    {item.dropdown.map((subItem) => (
                      <Link key={subItem.label} to={subItem.path} className="mobile-sub-link">
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mobile-actions">
              {user ? (
                <>
                  <div className="mobile-welcome" style={{ padding: '0 8px', marginBottom: '16px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    Logged in as <strong>{user.username}</strong>
                  </div>
                  <button onClick={handleLogout} className="btn btn-outline full-width">Logout</button>
                </>
              ) : (
                <Link to="/signup" className="btn btn-primary full-width">Get Started</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
