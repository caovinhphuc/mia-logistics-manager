import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Menu, X, ChevronLeft, ChevronRight, Search, Bell, Settings,
  User, Package, BarChart3, Users, MapPin, AlertTriangle,
  FileText, History, Calendar, Zap, RefreshCw, Monitor,
  Smartphone, Tablet, Sun, Moon, Maximize, Minimize,
  Home, Building, Truck, Archive, Layers, Target
} from 'lucide-react';

// ==============================================
// 📚 KIỂU DỮ LIỆU CHO DASHBOARD LAYOUT
// ==============================================

/**
 * Định nghĩa các module trong hệ thống kho vận
 * Mỗi module như một "phòng ban" trong tòa nhà dashboard
 */
interface ModuleDashboard {
  id: string;
  ten: string;
  moTa: string;
  bieuTuong: React.ComponentType<any>;
  mauSac: string;
  quyenCanThiet: string[];
  nhom: 'chinh' | 'quan_ly' | 'bao_cao' | 'cai_dat';
  thuTu: number;
  duongDan: string;
  luotTruy: number; // Để tối ưu theo nguyên tắc 80/20
  trangThaiBaoTri: boolean;
}

/**
 * Trạng thái layout của dashboard
 * Kiểm soát cách hiển thị các thành phần
 */
interface TrangThaiLayout {
  sidebar: {
    moRong: boolean;
    thuGon: boolean;
    chiRongPixel: number;
    ghimModule: string[];
  };
  header: {
    chieuCao: number;
    hienThongBao: boolean;
    hienTimKiem: boolean;
    hienMenuNguoiDung: boolean;
  };
  noiDung: {
    moduleHienTai: string;
    trangPhuHienTai: string;
    lichSuDieuHuong: string[];
    cheDoPhanTrang: 'single' | 'tabs' | 'split';
  };
  responsive: {
    loaiThietBi: 'mobile' | 'tablet' | 'desktop' | 'wide';
    kichThuocManHinh: { rong: number; cao: number };
    hienThiCompact: boolean;
  };
  hienThi: {
    cheDo: 'light' | 'dark' | 'auto';
    toZoom: number;
    hienAnimation: boolean;
    hienToolTip: boolean;
  };
}

/**
 * Cấu hình cá nhân hóa dashboard
 * Cho phép người dùng tùy chỉnh theo sở thích
 */
interface CauHinhCaNhan {
  boBucDashboard: {
    moduleYeuThich: string[];
    thuTuModuleTuyChinh: string[];
    hienThiNhanh: boolean;
  };
  thongBao: {
    batThongBaoAm: boolean;
    loaiThongBaoBat: string[];
    tanSuatKiemTra: number;
  };
  hienThi: {
    ngonNgu: 'vi' | 'en';
    dinhDangNgay: string;
    dinhDangTien: string;
    thuongHienCaNhan: boolean;
  };
}

// ==============================================
// 📋 DANH SÁCH CÁC MODULE TRONG HỆ THỐNG
// ==============================================

const DANH_SACH_MODULE = [
  // Các module được sử dụng thường xuyên nhất, theo nguyên tắc 80/20
  // Mục tiêu là 80% người dùng sẽ sử dụng 20% các module này
  // Nhóm chính - Các module được sử dụng hàng ngày (80% thời gian)

  {
    id: 'tong-quan',
    ten: 'Tổng Quan',
    moTa: 'Dashboard tổng quan hiệu suất kho vận',
    bieuTuong: Home,
    mauSac: '#3b82f6',
    quyenCanThiet: ['xem_dashboard_tong_quan'],
    nhom: 'chinh',
    thuTu: 1,
    duongDan: '/dashboard',
    luotTruy: 850, // Module được dùng nhiều nhất
    trangThaiBaoTri: false
  },
  {
    id: 'don-hang',
    ten: 'Quản Lý Đơn Hàng',
    moTa: 'Theo dõi và xử lý đơn hàng theo SLA',
    bieuTuong: Package,
    mauSac: '#10b981',
    quyenCanThiet: ['quan_ly_don_hang'],
    nhom: 'chinh',
    thuTu: 2,
    duongDan: '/orders',
    luotTruy: 720, // Module quan trọng thứ 2
    trangThaiBaoTri: false
  },
  {
    id: 'kho-hang',
    ten: 'Bản Đồ Kho',
    moTa: 'Quản lý vị trí và tối ưu picking',
    bieuTuong: MapPin,
    mauSac: '#8b5cf6',
    quyenCanThiet: ['quan_ly_kho'],
    nhom: 'chinh',
    thuTu: 3,
    duongDan: '/warehouse',
    luotTruy: 450,
    trangThaiBaoTri: false
  },
  {
    id: 'nhan-su',
    ten: 'Quản Lý Nhân Sự',
    moTa: 'Phân ca và theo dõi hiệu suất nhân viên',
    bieuTuong: Users,
    mauSac: '#f59e0b',
    quyenCanThiet: ['quan_ly_nhan_vien'],
    nhom: 'quan_ly',
    thuTu: 4,
    duongDan: '/staff',
    luotTruy: 380,
    trangThaiBaoTri: false
  },

  // Nhóm quản lý - Modules cho quản lý cấp cao
  {
    id: 'canh-bao',
    ten: 'Cảnh Báo & SLA',
    moTa: 'Giám sát cảnh báo và vi phạm SLA',
    bieuTuong: AlertTriangle,
    mauSac: '#ef4444',
    quyenCanThiet: ['xem_canh_bao'],
    nhom: 'quan_ly',
    thuTu: 5,
    duongDan: '/alerts',
    luotTruy: 320,
    trangThaiBaoTri: false
  },
  {
    id: 'picking',
    ten: 'Tối Ưu Picking',
    moTa: 'Hệ thống picking thông minh theo 80/20',
    bieuTuong: Target,
    mauSac: '#06b6d4',
    quyenCanThiet: ['toi_uu_picking'],
    nhom: 'quan_ly',
    thuTu: 6,
    duongDan: '/picking',
    luotTruy: 280,
    trangThaiBaoTri: false
  },

  // Nhóm báo cáo - Analytics và reporting
  {
    id: 'bao-cao',
    ten: 'Báo Cáo & Phân Tích',
    moTa: 'Báo cáo hiệu suất và phân tích dữ liệu',
    bieuTuong: BarChart3,
    mauSac: '#84cc16',
    quyenCanThiet: ['xem_bao_cao'],
    nhom: 'bao_cao',
    thuTu: 7,
    duongDan: '/reports',
    luotTruy: 150,
    trangThaiBaoTri: false
  },
  {
    id: 'lich-su',
    ten: 'Lịch Sử Hoạt Động',
    moTa: 'Theo dõi lịch sử các thao tác hệ thống',
    bieuTuong: History,
    mauSac: '#6b7280',
    quyenCanThiet: ['xem_lich_su'],
    nhom: 'bao_cao',
    thuTu: 8,
    duongDan: '/history',
    luotTruy: 120,
    trangThaiBaoTri: false
  },

  // Nhóm cài đặt - System configuration
  {
    id: 'cai-dat',
    ten: 'Cài Đặt Hệ Thống',
    moTa: 'Cấu hình hệ thống và tùy chỉnh',
    bieuTuong: Settings,
    mauSac: '#64748b',
    quyenCanThiet: ['cau_hinh_he_thong'],
    nhom: 'cai_dat',
    thuTu: 9,
    duongDan: '/settings',
    luotTruy: 80,
    trangThaiBaoTri: false
  }
].sort((a, b) => b.luotTruy - a.luotTruy) as ModuleDashboard[]; // Sắp xếp theo nguyên tắc 80/20

// ==============================================
// 🎨 CONTEXT VÀ HOOKS CHO LAYOUT
// ==============================================

/**
 * Context quản lý trạng thái layout toàn cục
 * Đây như "trung tâm điều khiển" cho toàn bộ giao diện
 */
interface BoCungCapLayout {
  trangThai: TrangThaiLayout;
  capNhatLayout: (capNhat: Partial<TrangThaiLayout>) => void;
  chuyenModule: (moduleId: string) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  moduleKhaDung: ModuleDashboard[];
  moduleHienTai: ModuleDashboard | null;
}

const ContextLayout = createContext<BoCungCapLayout | null>(null);

/**
 * Hook để sử dụng layout context một cách an toàn
 */
function useSuDungLayout(): BoCungCapLayout {
  const context = useContext(ContextLayout);
  if (!context) {
    throw new Error('useSuDungLayout phải được sử dụng bên trong NhaCungCapLayout');
  }
  return context;
}

/**
 * Hook phát hiện kích thước màn hình và loại thiết bị
 * Sử dụng để tự động điều chỉnh layout
 */
function usePhatHienThietBi() {
  const [thongTinThietBi, setThongTinThietBi] = useState({
    loai: 'desktop' as 'mobile' | 'tablet' | 'desktop' | 'wide',
    kichThuoc: { rong: window.innerWidth, cao: window.innerHeight },
    laMobile: false,
    laTablet: false
  });

  useEffect(() => {
    const capNhatThongTin = () => {
      const rong = window.innerWidth;
      const cao = window.innerHeight;

      let loaiThietBi: 'mobile' | 'tablet' | 'desktop' | 'wide';
      let laMobile = false;
      let laTablet = false;

      if (rong < 640) {
        loaiThietBi = 'mobile';
        laMobile = true;
      } else if (rong < 1024) {
        loaiThietBi = 'tablet';
        laTablet = true;
      } else if (rong < 1920) {
        loaiThietBi = 'desktop';
      } else {
        loaiThietBi = 'wide';
      }

      setThongTinThietBi({
        loai: loaiThietBi,
        kichThuoc: { rong, cao },
        laMobile,
        laTablet
      });
    };

    // Sử dụng debounce để tối ưu performance
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(capNhatThongTin, 150);
    };

    capNhatThongTin();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return thongTinThietBi;
}

/**
 * Provider quản lý toàn bộ layout state
 * Đây như "bộ não" điều khiển cách dashboard hiển thị
 */
function NhaCungCapLayout({ children }: { children: React.ReactNode }) {
  const thongTinThietBi = usePhatHienThietBi();

  // Khởi tạo trạng thái layout với các giá trị thông minh
  const [trangThai, setTrangThai] = useState<TrangThaiLayout>(() => {
    // Đọc cài đặt đã lưu từ localStorage
    const caiDatDaLuu = localStorage.getItem('mia_layout_settings');
    const caiDatMacDinh: TrangThaiLayout = {
      sidebar: {
        moRong: !thongTinThietBi.laMobile, // Tự động thu gọn trên mobile
        thuGon: false,
        chiRongPixel: 280,
        ghimModule: ['tong-quan', 'don-hang'] // Ghim 2 module quan trọng nhất
      },
      header: {
        chieuCao: 64,
        hienThongBao: false,
        hienTimKiem: false,
        hienMenuNguoiDung: false
      },
      noiDung: {
        moduleHienTai: 'tong-quan',
        trangPhuHienTai: '',
        lichSuDieuHuong: ['tong-quan'],
        cheDoPhanTrang: 'single'
      },
      responsive: {
        loaiThietBi: thongTinThietBi.loai,
        kichThuocManHinh: thongTinThietBi.kichThuoc,
        hienThiCompact: thongTinThietBi.laMobile
      },
      hienThi: {
        cheDo: 'dark', // Mặc định dark mode cho kho vận (ít mỏi mắt)
        toZoom: 1,
        hienAnimation: !thongTinThietBi.laMobile, // Tắt animation trên mobile để tiết kiệm pin
        hienToolTip: !thongTinThietBi.laMobile
      }
    };

    if (caiDatDaLuu) {
      try {
        const caiDatParsed = JSON.parse(caiDatDaLuu);
        return { ...caiDatMacDinh, ...caiDatParsed };
      } catch {
        return caiDatMacDinh;
      }
    }

    return caiDatMacDinh;
  });

  // Tự động cập nhật responsive settings khi thiết bị thay đổi
  useEffect(() => {
    setTrangThai(prev => ({
      ...prev,
      responsive: {
        loaiThietBi: thongTinThietBi.loai,
        kichThuocManHinh: thongTinThietBi.kichThuoc,
        hienThiCompact: thongTinThietBi.laMobile
      },
      sidebar: {
        ...prev.sidebar,
        moRong: thongTinThietBi.laMobile ? false : prev.sidebar.moRong
      }
    }));
  }, [thongTinThietBi]);

  // Lưu cài đặt vào localStorage khi có thay đổi
  useEffect(() => {
    const caiDatCanLuu = {
      sidebar: trangThai.sidebar,
      hienThi: trangThai.hienThi,
      noiDung: {
        moduleHienTai: trangThai.noiDung.moduleHienTai,
        cheDoPhanTrang: trangThai.noiDung.cheDoPhanTrang
      }
    };
    localStorage.setItem('mia_layout_settings', JSON.stringify(caiDatCanLuu));
  }, [trangThai]);

  /**
   * Hàm cập nhật layout state một cách an toàn
   */
  const capNhatLayout = useCallback((capNhat: Partial<TrangThaiLayout>) => {
    setTrangThai(prev => {
      // Deep merge để tránh mất dữ liệu
      const trangThaiMoi = { ...prev };
      Object.keys(capNhat).forEach(key => {
        if (typeof capNhat[key as keyof TrangThaiLayout] === 'object') {
          trangThaiMoi[key as keyof TrangThaiLayout] = {
            ...prev[key as keyof TrangThaiLayout],
            ...capNhat[key as keyof TrangThaiLayout]
          } as any;
        } else {
          (trangThaiMoi as any)[key] = capNhat[key as keyof TrangThaiLayout];
        }
      });
      return trangThaiMoi;
    });
  }, []);

  /**
   * Chuyển đổi module với animation mượt mà
   */
  const chuyenModule = useCallback((moduleId: string) => {
    const module = DANH_SACH_MODULE.find(m => m.id === moduleId);
    if (!module) return;

    setTrangThai(prev => ({
      ...prev,
      noiDung: {
        ...prev.noiDung,
        moduleHienTai: moduleId,
        lichSuDieuHuong: [moduleId, ...prev.noiDung.lichSuDieuHuong.filter(id => id !== moduleId)].slice(0, 10)
      }
    }));

    // Cập nhật lượt truy cập cho analytics
    const index = DANH_SACH_MODULE.findIndex(m => m.id === moduleId);
    if (index !== -1) {
      DANH_SACH_MODULE[index].luotTruy++;
    }
  }, []);

  /**
   * Toggle sidebar với logic thông minh
   */
  const toggleSidebar = useCallback(() => {
    capNhatLayout({
      sidebar: {
        ...trangThai.sidebar,
        moRong: !trangThai.sidebar.moRong
      }
    });
  }, [trangThai.sidebar, capNhatLayout]);

  /**
   * Toggle theme với smooth transition
   */
  const toggleTheme = useCallback(() => {
    const cheMoi = trangThai.hienThi.cheDo === 'dark' ? 'light' : 'dark';
    capNhatLayout({
      hienThi: {
        ...trangThai.hienThi,
        cheDo: cheMoi
      }
    });
  }, [trangThai.hienThi.cheDo, capNhatLayout]);

  // Lọc modules theo quyền hạn của người dùng (tích hợp với authentication)
  const moduleKhaDung = useMemo(() => {
    // Trong thực tế sẽ kiểm tra quyền từ user context
    // Hiện tại return tất cả để demo
    return DANH_SACH_MODULE.filter(module => !module.trangThaiBaoTri);
  }, []);

  const moduleHienTai = useMemo(() => {
    return moduleKhaDung.find(m => m.id === trangThai.noiDung.moduleHienTai) || null;
  }, [moduleKhaDung, trangThai.noiDung.moduleHienTai]);

  const giaTri = useMemo(() => ({
    trangThai,
    capNhatLayout,
    chuyenModule,
    toggleSidebar,
    toggleTheme,
    moduleKhaDung,
    moduleHienTai
  }), [trangThai, capNhatLayout, chuyenModule, toggleSidebar, toggleTheme, moduleKhaDung, moduleHienTai]);

  return (
    <ContextLayout.Provider value={giaTri}>
      {children}
    </ContextLayout.Provider>
  );
}

// ==============================================
// 🧩 COMPONENTS LAYOUT CHÍNH
// ==============================================

/**
 * Component Header - Thanh điều hướng trên cùng
 * Như "bảng điều khiển" của phi công
 */
function HeaderDashboard() {
  const { trangThai, toggleSidebar, toggleTheme, chuyenModule } = useSuDungLayout();
  const [timKiem, setTimKiem] = useState('');
  const [hienGoiY, setHienGoiY] = useState(false);

  // Tạo các gợi ý tìm kiếm thông minh dựa trên lượt truy cập
  const goiYTimKiem = useMemo(() => {
    if (!timKiem) return [];

    return DANH_SACH_MODULE
      .filter(module =>
        module.ten.toLowerCase().includes(timKiem.toLowerCase()) ||
        module.moTa.toLowerCase().includes(timKiem.toLowerCase())
      )
      .sort((a, b) => b.luotTruy - a.luotTruy) // Ưu tiên modules được dùng nhiều
      .slice(0, 5);
  }, [timKiem]);

  const cssClass = useMemo(() => ({
    container: `h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between shadow-sm transition-all duration-200`,
    searchContainer: `flex-1 max-w-lg mx-8 relative`,
    searchInput: `w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`,
    actionButton: `p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 relative`
  }), []);

  return (
    <header className={cssClass.container}>
      {/* Phần trái - Logo và toggle sidebar */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className={cssClass.actionButton}
          title="Đóng/Mở sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden md:flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">MIA Warehouse</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">SLA Management System</p>
          </div>
        </div>
      </div>

      {/* Phần giữa - Tìm kiếm thông minh */}
      <div className={cssClass.searchContainer}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm modules, báo cáo, đơn hàng..."
            value={timKiem}
            onChange={(e) => setTimKiem(e.target.value)}
            onFocus={() => setHienGoiY(true)}
            onBlur={() => setTimeout(() => setHienGoiY(false), 200)}
            className={cssClass.searchInput}
          />

          {/* Dropdown gợi ý tìm kiếm */}
          {hienGoiY && goiYTimKiem.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2">Modules phù hợp:</p>
                {goiYTimKiem.map(module => (
                  <button
                    key={module.id}
                    onClick={() => {
                      chuyenModule(module.id);
                      setTimKiem('');
                      setHienGoiY(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center space-x-3"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ backgroundColor: module.mauSac + '20' }}>
                      <module.bieuTuong className="w-4 h-4" style={{ color: module.mauSac }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{module.ten}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{module.moTa}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Phần phải - Actions và user menu */}
      <div className="flex items-center space-x-2">
        {/* Hiển thị thiết bị hiện tại */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {trangThai.responsive.loaiThietBi === 'mobile' && <Smartphone className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
          {trangThai.responsive.loaiThietBi === 'tablet' && <Tablet className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
          {(trangThai.responsive.loaiThietBi === 'desktop' || trangThai.responsive.loaiThietBi === 'wide') && <Monitor className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
          <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            {trangThai.responsive.kichThuocManHinh.rong} × {trangThai.responsive.kichThuocManHinh.cao}
          </span>
        </div>

        {/* Làm mới */}
        <button className={cssClass.actionButton} title="Làm mới dữ liệu">
          <RefreshCw className="w-5 h-5" />
        </button>

        {/* Toggle theme */}
        <button
          onClick={toggleTheme}
          className={cssClass.actionButton}
          title={`Chuyển sang ${trangThai.hienThi.cheDo === 'dark' ? 'sáng' : 'tối'}`}
        >
          {trangThai.hienThi.cheDo === 'dark' ?
            <Sun className="w-5 h-5" /> :
            <Moon className="w-5 h-5" />
          }
        </button>

        {/* Thông báo */}
        <button className={`${cssClass.actionButton} relative`} title="Thông báo">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* User menu */}
        <button className={cssClass.actionButton} title="Menu người dùng">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

/**
 * Component Sidebar - Menu điều hướng bên trái
 * Như "bản đồ" giúp điều hướng trong tòa nhà
 */
function SidebarDashboard() {
  const { trangThai, moduleKhaDung, moduleHienTai, chuyenModule } = useSuDungLayout();

  // Nhóm modules theo loại để hiển thị có tổ chức
  const modulesTheoNhom = useMemo(() => {
    const nhomMap = moduleKhaDung.reduce((acc, module) => {
      if (!acc[module.nhom]) {
        acc[module.nhom] = [];
      }
      acc[module.nhom].push(module);
      return acc;
    }, {} as Record<string, ModuleDashboard[]>);

    // Sắp xếp theo lượt truy cập trong từng nhóm (80/20 principle)
    Object.keys(nhomMap).forEach(nhom => {
      nhomMap[nhom].sort((a, b) => b.luotTruy - a.luotTruy);
    });

    return nhomMap;
  }, [moduleKhaDung]);

  const tenNhom = {
    'chinh': 'Chức Năng Chính',
    'quan_ly': 'Quản Lý',
    'bao_cao': 'Báo Cáo',
    'cai_dat': 'Cài Đặt'
  };

  const cssClass = useMemo(() => ({
    container: `${
      trangThai.sidebar.moRong ? 'w-80' : 'w-16'
    } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col shadow-lg`,
    moduleButton: (isActive: boolean) => `
      w-full flex items-center px-4 py-3 text-left transition-all duration-200 group relative
      ${isActive
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-500'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
      }
    `,
    nhomHeader: `px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${!trangThai.sidebar.moRong ? 'hidden' : ''}`
  }), [trangThai.sidebar.moRong]);

  return (
    <aside className={cssClass.container}>
      {/* Phần trên - Modules chính */}
      <div className="flex-1 py-6 overflow-y-auto">
        {Object.entries(modulesTheoNhom).map(([nhom, modules]) => (
          <div key={nhom} className="mb-6">
            <h3 className={cssClass.nhomHeader}>
              {tenNhom[nhom as keyof typeof tenNhom]}
            </h3>

            <div className="space-y-1">
              {modules.map(module => {
                const isActive = moduleHienTai?.id === module.id;
                const IconComponent = module.bieuTuong;

                return (
                  <button
                    key={module.id}
                    onClick={() => chuyenModule(module.id)}
                    className={cssClass.moduleButton(isActive)}
                    title={!trangThai.sidebar.moRong ? module.ten : undefined}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        isActive ? 'shadow-lg' : 'group-hover:shadow-md'
                      }`}
                      style={{
                        backgroundColor: isActive ? module.mauSac + '20' : 'transparent'
                      }}
                    >
                      <IconComponent
                        className="w-5 h-5 transition-all duration-200"
                        style={{ color: isActive ? module.mauSac : undefined }}
                      />
                    </div>

                    {trangThai.sidebar.moRong && (
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{module.ten}</span>
                          {module.luotTruy > 500 && (
                            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
                              Hot
                            </span>
                          )}
                        </div>
                        <p className="text-xs opacity-70 truncate mt-0.5">{module.moTa}</p>
                      </div>
                    )}

                    {/* Indicator cho active state */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Phần dưới - Thông tin hệ thống */}
      {trangThai.sidebar.moRong && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Phiên bản:</span>
              <span className="font-mono">v2.0.1</span>
            </div>
            <div className="flex justify-between">
              <span>Modules:</span>
              <span>{moduleKhaDung.length} hoạt động</span>
            </div>
            <div className="flex justify-between">
              <span>Thiết bị:</span>
              <span className="capitalize">{trangThai.responsive.loaiThietBi}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

/**
 * Component Main Content - Khu vực hiển thị nội dung chính
 * Như "sân khấu" nơi các module thể hiện
 */
function NoiDungChinh({ children }: { children: React.ReactNode }) {
  const { trangThai, moduleHienTai } = useSuDungLayout();

  const cssClass = useMemo(() => ({
    container: `flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 transition-all duration-200`,
    content: `h-full overflow-y-auto p-6`,
    breadcrumb: `flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6`,
    moduleHeader: `mb-8`
  }), []);

  return (
    <main className={cssClass.container}>
      <div className={cssClass.content}>
        {/* Breadcrumb điều hướng */}
        <div className={cssClass.breadcrumb}>
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">
            {moduleHienTai?.ten || 'Đang tải...'}
          </span>
        </div>

        {/* Header của module */}
        {moduleHienTai && (
          <div className={cssClass.moduleHeader}>
            <div className="flex items-center space-x-4 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: moduleHienTai.mauSac + '20' }}
              >
                <moduleHienTai.bieuTuong
                  className="w-6 h-6"
                  style={{ color: moduleHienTai.mauSac }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {moduleHienTai.ten}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {moduleHienTai.moTa}
                </p>
              </div>
            </div>

            {/* Thống kê nhanh về module */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Lượt truy cập</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {moduleHienTai.luotTruy.toLocaleString()}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Độ ưu tiên</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      #{moduleHienTai.thuTu}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Trạng thái</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      Hoạt động
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nội dung module */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-96">
          {children}
        </div>
      </div>
    </main>
  );
}

// ==============================================
// 🧪 COMPONENT DEMO HOÀN CHỈNH
// ==============================================

/**
 * Layout Dashboard hoàn chỉnh
 * Kết hợp tất cả components thành một hệ thống thống nhất
 */
function DashboardHoanChinh() {
  return (
    <NhaCungCapLayout>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <HeaderDashboard />

        <div className="flex flex-1 overflow-hidden">
          <SidebarDashboard />

          <NoiDungChinh>
            <DemoNoiDungModule />
          </NoiDungChinh>
        </div>
      </div>
    </NhaCungCapLayout>
  );
}

/**
 * Demo content cho module hiện tại
 * Hiển thị placeholder content tương ứng với module được chọn
 */
function DemoNoiDungModule() {
  const { moduleHienTai } = useSuDungLayout();

  if (!moduleHienTai) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải module...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Demo cards cho từng module */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Tính năng chính
          </h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
            Module {moduleHienTai.ten} cung cấp các chức năng quan trọng cho hệ thống kho vận.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">85%</span>
            <div className="text-right">
              <p className="text-xs text-blue-600 dark:text-blue-400">Hiệu suất</p>
              <p className="text-xs text-blue-500 dark:text-blue-500">Tuần này</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
            Thống kê theo thời gian thực
          </h3>
          <p className="text-green-700 dark:text-green-300 text-sm mb-4">
            Dữ liệu được cập nhật liên tục để đảm bảo độ chính xác cao nhất.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">1,247</span>
            <div className="text-right">
              <p className="text-xs text-green-600 dark:text-green-400">Đơn hàng</p>
              <p className="text-xs text-green-500 dark:text-green-500">Hôm nay</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
            Tối ưu theo 80/20
          </h3>
          <p className="text-purple-700 dark:text-purple-300 text-sm mb-4">
            Áp dụng nguyên tắc Pareto để tối ưu hóa hiệu suất làm việc.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">320%</span>
            <div className="text-right">
              <p className="text-xs text-purple-600 dark:text-purple-400">ROI</p>
              <p className="text-xs text-purple-500 dark:text-purple-500">So với trước</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo content specific cho module */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          🎯 Nội dung đặc thù cho module: {moduleHienTai.ten}
        </h3>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300">
            Đây là khu vực sẽ hiển thị nội dung cụ thể của module <strong>{moduleHienTai.ten}</strong>.
            Trong giai đoạn tiếp theo, chúng ta sẽ phát triển chi tiết từng module với các tính năng đặc trưng:
          </p>

          <ul className="text-gray-700 dark:text-gray-300 mt-4">
            <li>Dashboard tương tác với biểu đồ thời gian thực</li>
            <li>Bảng dữ liệu với khả năng lọc và sắp xếp nâng cao</li>
            <li>Form nhập liệu với validation thông minh</li>
            <li>Báo cáo xuất dữ liệu với nhiều định dạng</li>
            <li>Tích hợp API và synchronization tự động</li>
          </ul>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              💡 <strong>Tip:</strong> Module này được truy cập <strong>{moduleHienTai.luotTruy.toLocaleString()}</strong> lần,
              thuộc top {Math.ceil((moduleHienTai.thuTu / DANH_SACH_MODULE.length) * 100)}% modules được sử dụng nhiều nhất.
              Đây là dấu hiệu cho thấy tầm quan trọng trong quy trình làm việc 80/20.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHoanChinh;
