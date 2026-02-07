import React from 'react';
import PropTypes from 'prop-types';
import { BarChart3 } from 'lucide-react';

const AnalyticsTab = ({ metrics, data, themeClasses }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold mb-2">Phân tích & Báo cáo</h1>
      <p className={`${themeClasses.text.muted}`}>
        Insights và analytics chi tiết về hiệu suất kho vận
      </p>
    </div>

    <div className={`p-12 rounded-2xl ${themeClasses.surface} ${themeClasses.border} border text-center`}>
      <BarChart3 size={64} className={`mx-auto mb-4 ${themeClasses.text.muted}`} />
      <h3 className="text-xl font-semibold mb-2">Tính năng đang phát triển</h3>
      <p className={`${themeClasses.text.muted} max-w-md mx-auto`}>
        Advanced analytics với biểu đồ tương tác, forecasting và báo cáo tùy chỉnh đang được phát triển.
      </p>
    </div>
  </div>
);

// ==================== PROP TYPES ====================
AnalyticsTab.propTypes = {
  metrics: PropTypes.object,
  data: PropTypes.object,
  themeClasses: PropTypes.object
};

// ==================== EXPORTS ====================
export default AnalyticsTab;
