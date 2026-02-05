// Common Main Layout Component (Fallback)
import '../layout/MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">MIA Logistics Manager</h1>
        </div>
      </header>
      <div className="main-layout-body">
        <main className="main-layout-content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
