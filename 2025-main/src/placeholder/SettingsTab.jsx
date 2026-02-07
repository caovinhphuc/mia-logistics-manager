import React from 'react';
import PropTypes from 'prop-types';
import { Settings } from 'lucide-react';
// ==================== SETTINGS TAB COMPONENT ====================




const SettingsTab = ({ themeClasses }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold mb-2">Cài đặt hệ thống</h1>
      <p className={`${themeClasses.text.muted}`}>
        Quản lý cấu hình và thiết lập hệ thống
      </p>
    </div>

    <div className={`p-12 rounded-2xl ${themeClasses.surface} ${themeClasses.border} border text-center`}>
      <Settings size={64} className={`mx-auto mb-4 ${themeClasses.text.muted}`} />
      <h3 className="text-xl font-semibold mb-2">Tính năng đang phát triển</h3>
      <p className={`${themeClasses.text.muted} max-w-md mx-auto`}>
        Panel cài đặt với quản lý người dùng, quyền hạn và cấu hình hệ thống đang được phát triển.
      </p>
    </div>
  </div>
);

// ==================== PROP TYPES ====================
SettingsTab.propTypes = {
  themeClasses: PropTypes.object
};

// ==================== EXPORTS ====================
export default SettingsTab;
