// Main Layout Component
import Header from './Header';
import './MainLayout.css';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <div className="main-layout-body">
        <Sidebar />
        <main className="main-layout-content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
