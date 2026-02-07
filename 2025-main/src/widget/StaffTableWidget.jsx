// StaffTableWidget.jsx
import React from 'react';
import PropTypes from 'prop-types';
import WidgetWrapper from '../components/layout/WidgetWrapper';
import { Users, CheckCircle, XCircle, Eye, Edit, Trash2, Activity, MapPin, Clock } from 'lucide-react';

const StaffTableWidget = ({ staffData, onViewStaff, themeClasses, searchTerm, filterStatus, filterArea }) => {
  // Lọc dữ liệu nhân viên
  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = searchTerm ? (
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true;

    const matchesStatus = filterStatus === 'all' || staff.status === filterStatus;
    const matchesArea = filterArea === 'all' || staff.area === filterArea;

    return matchesSearch && matchesStatus && matchesArea;
  });

  // Hàm tạo icon và màu sắc cho trạng thái
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} className="text-green-500" />;
      case 'busy': return <Activity size={16} className="text-yellow-500" />;
      case 'offline': return <XCircle size={16} className="text-gray-400" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Sẵn sàng';
      case 'busy': return 'Đang bận';
      case 'offline': return 'Offline';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'busy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'offline': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <WidgetWrapper
      widgetId="staff-table"
      title="Danh sách nhân viên"
      description="Quản lý thông tin chi tiết về nhân viên"
      themeClasses={themeClasses}
      isRefreshable={true}
      isExpandable={true}
    >
      <div className={`rounded-xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${themeClasses.surfaceHover}`}>
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${themeClasses.text.primary}`}>
                  Nhân viên
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${themeClasses.text.primary}`}>
                  Khu vực & Vị trí
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${themeClasses.text.primary}`}>
                  Trạng thái
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${themeClasses.text.primary}`}>
                  Hiệu suất
                </th>
                <th className={`px-6 py-4 text-center text-sm font-semibold ${themeClasses.text.primary}`}>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className={`hover:${themeClasses.surfaceHover} transition-colors`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold`}>
                          {staff.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <p className={`font-semibold ${themeClasses.text.primary}`}>{staff.name}</p>
                          <p className={`text-sm ${themeClasses.text.muted}`}>{staff.role}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className={`${themeClasses.text.muted}`} />
                        <span className={`font-medium ${themeClasses.text.primary}`}>Khu vực {staff.area}</span>
                      </div>
                      {staff.currentOrder && (
                        <p className={`text-sm ${themeClasses.text.muted} mt-1`}>
                          Đang xử lý: {staff.currentOrder}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(staff.status)}
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                          {getStatusText(staff.status)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className={`text-sm font-medium ${
                              staff.efficiency >= 95 ? 'text-green-600 dark:text-green-400' :
                              staff.efficiency >= 90 ? 'text-blue-600 dark:text-blue-400' :
                              staff.efficiency >= 80 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {staff.efficiency}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                staff.efficiency >= 95 ? 'bg-green-500' :
                                staff.efficiency >= 90 ? 'bg-blue-500' :
                                staff.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${staff.efficiency}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onViewStaff(staff)}
                          className={`p-2 rounded-lg ${themeClasses.buttonSecondary} hover:${themeClasses.buttonSecondaryHover} transition-colors`}
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={`p-2 rounded-lg ${themeClasses.buttonSecondary} hover:${themeClasses.buttonSecondaryHover} transition-colors`}
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className={`p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Users size={48} className={`mx-auto mb-4 ${themeClasses.text.muted}`} />
                    <p className={`text-lg font-medium ${themeClasses.text.primary} mb-2`}>
                      Không tìm thấy nhân viên
                    </p>
                    <p className={`${themeClasses.text.muted}`}>
                      Thử điều chỉnh bộ lọc để xem thêm kết quả
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </WidgetWrapper>
  );
};

StaffTableWidget.propTypes = {
  staffData: PropTypes.array.isRequired,
  onViewStaff: PropTypes.func.isRequired,
  themeClasses: PropTypes.object.isRequired,
  searchTerm: PropTypes.string,
  filterStatus: PropTypes.string,
  filterArea: PropTypes.string
};

export default StaffTableWidget;
