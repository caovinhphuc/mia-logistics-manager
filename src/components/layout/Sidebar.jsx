// Sidebar Component
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <a href="/dashboard" className="nav-link">
              📊 Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a href="/users" className="nav-link">
              👥 Users
            </a>
          </li>
          <li className="nav-item">
            <a href="/transport" className="nav-link">
              🚚 Transport
            </a>
          </li>
          <li className="nav-item">
            <a href="/warehouse" className="nav-link">
              📦 Warehouse
            </a>
          </li>
          <li className="nav-item">
            <a href="/settings" className="nav-link">
              ⚙️ Settings
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
