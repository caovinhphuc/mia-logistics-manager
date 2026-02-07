// StaffTab.jsx
import React from 'react';
import PropTypes from 'prop-types';
// ==================== KPI CARD COMPONENT ====================
import { TrendingUp } from 'lucide-react';

const KPICard = ({ title, value, subtitle, change, trend, icon: Icon, gradient, themeClasses }) => (
  <div className={`p-3 lg:p-6 rounded-xl lg:rounded-2xl ${themeClasses.surface} ${themeClasses.border} border shadow-sm hover:shadow-md transition-all duration-200 group`}>
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className={`text-xs lg:text-sm font-medium ${themeClasses.text.muted} mb-1 truncate`}>{title}</p>
        <p className="text-xl lg:text-3xl font-bold mb-1 truncate">{value}</p>
        <p className={`text-xs ${themeClasses.text.muted} truncate`}>{subtitle}</p>

        <div className="flex items-center mt-2 lg:mt-3">
          <div className={`flex items-center px-1.5 lg:px-2 py-0.5 lg:py-1 rounded lg:rounded-lg ${
            trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            <TrendingUp size={10} className={`lg:w-3 lg:h-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
            <span className="text-xs font-medium ml-1">{change}</span>
          </div>
        </div>
      </div>

      <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-gradient-to-r ${gradient} opacity-20 group-hover:opacity-30 transition-opacity flex-shrink-0`}>
        <Icon size={16} className="lg:w-6 lg:h-6 text-white" />
      </div>
    </div>
  </div>
);

// ==================== EXPORTS ====================
export default KPICard;
