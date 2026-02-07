//AlertsTab.jsx
import React from 'react';
import { AlertTriangle, Bell, Clock } from 'lucide-react';
import PropTypes from 'prop-types';

// Mock data for alerts
const alerts = [
  {
    type: "urgent",
    title: "Đơn hàng P1 sắp trễ hạn",
    message: "Đơn #DH2025001 còn 15 phút để quá hạn SLA",
    time: "2 phút trước"
  },
  {
    type: "warning",
    title: "Tồn kho thấp",
    message: "Vali Larita 28L chỉ còn 3 sản phẩm",
    time: "5 phút trước"
  },
  {
    type: "info",
    title: "Hiệu suất nhân viên",
    message: "Lê Văn C đạt 85% hiệu suất trong ca này",
    time: "10 phút trước"
  },
  {
    type: "warning",
    title: "Khu vực kho quá tải",
    message: "Khu vực A có 15 đơn chờ xử lý",
    time: "15 phút trước"
  }
];

const AlertsTab = ({ themeClasses, darkMode }) => (    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`lg:col-span-2 p-4 rounded-lg border ${themeClasses.surface} ${themeClasses.border}`}>
          <h3 className={`text-lg font-medium mb-4 ${themeClasses.text.primary}`}>Cấu hình cảnh báo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className={`text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                Ngưỡng cảnh báo thời gian
              </h4>
              <div className="space-y-3">
                <div>
                  <label className={`text-sm block mb-1 ${themeClasses.text.secondary}`}>
                    Cảnh báo khẩn cấp (phút)
                  </label>
                  <input
                    type="number"
                    className={`w-full p-2 rounded ${themeClasses.input}`}
                    defaultValue="30"
                  />
                  <p className={`text-xs mt-1 ${themeClasses.text.muted}`}>
                    Cảnh báo khi đơn hàng còn ít hơn số phút này để hoàn thành
                  </p>
                </div>
                <div>
                  <label className={`text-sm block mb-1 ${themeClasses.text.secondary}`}>
                    Cảnh báo thông thường (phút)
                  </label>
                  <input
                    type="number"
                    className={`w-full p-2 rounded ${themeClasses.input}`}
                    defaultValue="120"
                  />
                  <p className={`text-xs mt-1 ${themeClasses.text.muted}`}>
                    Cảnh báo khi đơn hàng còn ít hơn số phút này để hoàn thành
                  </p>
                </div>
              </div>

              <h4 className={`text-sm font-medium mb-2 mt-4 ${themeClasses.text.primary}`}>
                Tần suất kiểm tra
              </h4>
              <div>
                <select className={`w-full p-2 rounded ${themeClasses.input}`}>
                  <option>Mỗi 5 phút</option>
                  <option>Mỗi 10 phút</option>
                  <option>Mỗi 15 phút</option>
                  <option>Mỗi 30 phút</option>
                </select>
                <p className={`text-xs mt-1 ${themeClasses.text.muted}`}>
                  Hệ thống sẽ tự động kiểm tra đơn hàng sắp trễ hạn với tần suất
                  này
                </p>
              </div>
            </div>

            <div>
              <h4 className={`text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                Kích hoạt cảnh báo khi
              </h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className={`text-sm ${themeClasses.text.secondary}`}>Đơn trễ hạn SLA</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className={`text-sm ${themeClasses.text.secondary}`}>Tồn kho thấp</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className={`text-sm ${themeClasses.text.secondary}`}>Hiệu suất nhân viên thấp</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className={`text-sm ${themeClasses.text.secondary}`}>Khu vực kho quá tải</span>
                </label>
              </div>

              <h4 className={`text-sm font-medium mb-2 mt-4 ${themeClasses.text.primary}`}>
                Nhận thông báo qua
              </h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className={`text-sm ${themeClasses.text.secondary}`}>Dashboard</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className={`text-sm ${themeClasses.text.secondary}`}>Email</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className={`text-sm ${themeClasses.text.secondary}`}>Telegram</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors">
              Lưu cấu hình
            </button>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${themeClasses.surface} ${themeClasses.border}`}>
          <h3 className={`text-lg font-medium mb-4 ${themeClasses.text.primary}`}>Cảnh báo hoạt động</h3>          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  alert.type === "urgent"
                    ? "bg-red-500/10 border-l-4 border-red-500"
                    : alert.type === "warning"
                    ? "bg-yellow-500/10 border-l-4 border-yellow-500"
                    : "bg-blue-500/10 border-l-4 border-blue-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    {alert.type === "urgent" ? (
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
                    ) : alert.type === "warning" ? (
                      <Bell className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
                    ) : (
                      <Clock className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-medium text-sm ${themeClasses.text.primary}`}>{alert.title}</p>
                      <p className={`text-xs mt-1 ${themeClasses.text.muted}`}>{alert.message}</p>
                    </div>
                  </div>
                  <span className={`text-xs ${themeClasses.text.muted}`}>{alert.time}</span>
                </div>
                <div className="mt-2 flex justify-end space-x-2">
                  <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Xử lý
                  </button>
                  <button className={`text-xs hover:opacity-75 transition-colors ${themeClasses.text.muted}`}>
                    Bỏ qua
                  </button>
                </div>
              </div>
            ))}
            <button className={`w-full py-2 rounded text-sm transition-colors ${themeClasses.surfaceHover} ${themeClasses.text.secondary} ${themeClasses.border} border`}>
              Tải thêm cảnh báo
            </button>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg border ${themeClasses.surface} ${themeClasses.border}`}>
        <h3 className={`text-lg font-medium mb-4 ${themeClasses.text.primary}`}>Đề xuất tối ưu theo SLA</h3>        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-blue-500/10 border-l-4 border-blue-500">
            <h4 className="font-medium text-blue-400 mb-2">
              Tối ưu bố trí kho
            </h4>
            <p className={`text-sm mb-2 ${themeClasses.text.secondary}`}>
              Dựa trên dữ liệu 30 ngày qua, các khu vực sau nên được sắp xếp lại
              để tối ưu hiệu suất lấy hàng:
            </p>
            <ul className={`text-sm list-disc pl-5 space-y-1 ${themeClasses.text.secondary}`}>
              <li>
                Di chuyển Vali Larita size M từ A5 → A3 (gần khu vực lấy hàng
                chính)
              </li>
              <li>
                Tập trung phụ kiện Mia Tag tại B2 (25% đơn hàng có sản phẩm này)
              </li>
              <li>Tạo khu vực riêng cho đơn có hàng mix Vali + Phụ kiện</li>
            </ul>
            <div className="mt-2 flex justify-end">
              <button className={`px-3 py-1 rounded text-xs transition-colors ${themeClasses.surfaceHover} ${themeClasses.text.secondary} ${themeClasses.border} border`}>
                Xem chi tiết
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-green-500/10 border-l-4 border-green-500">
            <h4 className="font-medium text-green-400 mb-2">Tối ưu nhân sự</h4>
            <p className={`text-sm mb-2 ${themeClasses.text.secondary}`}>
              Khuyến nghị điều chỉnh lịch ca làm việc để đáp ứng tốt hơn SLA
              trong những thời điểm cao điểm:
            </p>
            <ul className={`text-sm list-disc pl-5 space-y-1 ${themeClasses.text.secondary}`}>
              <li>Tăng 1 nhân viên vào khung giờ 14:00-17:00 (đơn tăng 25%)</li>
              <li>
                Bố trí nhân viên hiệu suất cao xử lý đơn P1 trong khung giờ
                9:00-11:00
              </li>
              <li>
                Điều chuyển Lê Văn C để hỗ trợ xử lý đơn khu vực A (hiệu suất
                45%)
              </li>
            </ul>
            <div className="mt-2 flex justify-end">
              <button className={`px-3 py-1 rounded text-xs transition-colors ${themeClasses.surfaceHover} ${themeClasses.text.secondary} ${themeClasses.border} border`}>
                Xem chi tiết
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-purple-500/10 border-l-4 border-purple-500">
            <h4 className="font-medium text-purple-400 mb-2">
              Tối ưu quy trình xử lý đơn
            </h4>
            <p className={`text-sm mb-2 ${themeClasses.text.secondary}`}>
              Áp dụng các chiến lược sau để tối ưu quy trình xử lý đơn hàng:
            </p>
            <ul className={`text-sm list-disc pl-5 space-y-1 ${themeClasses.text.secondary}`}>
              <li>
                Gom nhóm đơn Shopee trước 10:00 để xử lý cùng lúc (giảm 30% thời
                gian)
              </li>
              <li>
                Xử lý đơn 1 sản phẩm trước để giải phóng nhanh backlog (15 đơn)
              </li>
              <li>
                Tạo batch processing cho đơn cùng loại sản phẩm (Vali 28L, Mia
                Tag)
              </li>
            </ul>
            <div className="mt-2 flex justify-end">
              <button className={`px-3 py-1 rounded text-xs transition-colors ${themeClasses.surfaceHover} ${themeClasses.text.secondary} ${themeClasses.border} border`}>
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
);

// PropTypes
AlertsTab.propTypes = {
  themeClasses: PropTypes.shape({
    background: PropTypes.string,
    surface: PropTypes.string,
    surfaceHover: PropTypes.string,
    border: PropTypes.string,
    text: PropTypes.shape({
      primary: PropTypes.string,
      secondary: PropTypes.string,
      muted: PropTypes.string
    }),
    input: PropTypes.string
  }).isRequired,
  darkMode: PropTypes.bool
};

AlertsTab.defaultProps = {
  darkMode: false
};

export default AlertsTab;
