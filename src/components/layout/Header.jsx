// Header Component
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">MIA Logistics Manager</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span>User Account</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
