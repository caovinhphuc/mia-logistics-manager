import React, { useState } from 'react';
import { Settings, Monitor, Smartphone, Tablet, Eye, EyeOff, Info, Lightbulb } from 'lucide-react';
import LayoutConfigManager from '../components/layout/LayoutConfigManager';
import { useLayout } from '../context/LayoutContext';
import { useTheme } from '../hooks/useTheme';

/**
 * Demo component để hướng dẫn sử dụng Layout Configuration Manager
 */
const LayoutConfigDemo = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { themeClasses } = useTheme();
  const { layouts, getPageList } = useLayout();

  const demoSteps = [
    {
      id: 1,
      title: "🎯 Bước 1: Mở Layout Config",
      description: "Click vào nút Settings để mở Layout Configuration Manager",
      action: () => setIsConfigOpen(true),
      buttonText: "Mở Layout Config"
    },
    {
      id: 2,
      title: "📱 Bước 2: Chọn chế độ hiển thị",
      description: "Trong Layout Config, thử chuyển đổi giữa Desktop, Tablet, Mobile",
      icon: <Monitor size={20} />,
      highlight: "view-mode-selector"
    },
    {
      id: 3,
      title: "📋 Bước 3: Chọn trang",
      description: "Chọn một trang từ sidebar bên trái để cấu hình",
      icon: <Settings size={20} />,
      highlight: "page-selector"
    },
    {
      id: 4,
      title: "👁️ Bước 4: Ẩn/hiện widget",
      description: "Toggle các widget bằng cách click nút Hiện/Ẩn",
      icon: <Eye size={20} />,
      highlight: "widget-controls"
    },
    {
      id: 5,
      title: "🔍 Bước 5: Xem trước",
      description: "Kiểm tra bố cục trong phần 'Xem trước bố cục'",
      icon: <Lightbulb size={20} />,
      highlight: "layout-preview"
    }
  ];

  const currentStepData = demoSteps.find(step => step.id === currentStep);

  return (
    <div className={`min-h-screen p-6 ${themeClasses.background}`}>
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className={`mb-8 text-center`}>
          <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-4`}>
            🎛️ Layout Configuration Manager Demo
          </h1>
          <p className={`text-lg ${themeClasses.text.muted} max-w-2xl mx-auto`}>
            Hướng dẫn từng bước cách sử dụng công cụ quản lý bố cục để tùy chỉnh giao diện ứng dụng
          </p>
        </div>

        {/* Demo Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-xl ${themeClasses.surface} ${themeClasses.border} border`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Settings size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className={`text-sm ${themeClasses.text.muted}`}>Tổng số trang</p>
                <p className={`text-xl font-bold ${themeClasses.text.primary}`}>
                  {getPageList().length}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${themeClasses.surface} ${themeClasses.border} border`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Monitor size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className={`text-sm ${themeClasses.text.muted}`}>Chế độ hiển thị</p>
                <p className={`text-xl font-bold ${themeClasses.text.primary}`}>3</p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${themeClasses.surface} ${themeClasses.border} border`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Eye size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className={`text-sm ${themeClasses.text.muted}`}>Widget có thể ẩn</p>
                <p className={`text-xl font-bold ${themeClasses.text.primary}`}>∞</p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${themeClasses.surface} ${themeClasses.border} border`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Lightbulb size={20} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className={`text-sm ${themeClasses.text.muted}`}>Responsive</p>
                <p className={`text-xl font-bold ${themeClasses.text.primary}`}>100%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step by Step Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steps Navigation */}
          <div className={`lg:col-span-1 ${themeClasses.surface} ${themeClasses.border} border rounded-xl p-6`}>
            <h3 className={`text-lg font-bold ${themeClasses.text.primary} mb-4 flex items-center gap-2`}>
              <Info size={20} className="text-blue-500" />
              Các bước thực hiện
            </h3>

            <div className="space-y-3">
              {demoSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    currentStep === step.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500'
                      : `hover:bg-gray-100 dark:hover:bg-gray-700 ${themeClasses.border} border-l-4 border-transparent`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${
                      currentStep === step.id
                        ? 'bg-blue-200 dark:bg-blue-800'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {step.icon || <span className="text-sm font-bold">{index + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${
                        currentStep === step.id
                          ? 'text-blue-700 dark:text-blue-400'
                          : themeClasses.text.primary
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsConfigOpen(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Settings size={16} />
                Mở Layout Config Manager
              </button>
            </div>
          </div>

          {/* Current Step Details */}
          <div className={`lg:col-span-2 ${themeClasses.surface} ${themeClasses.border} border rounded-xl p-6`}>
            <div className="mb-6">
              <h3 className={`text-xl font-bold ${themeClasses.text.primary} mb-2`}>
                {currentStepData?.title}
              </h3>
              <p className={`text-lg ${themeClasses.text.muted}`}>
                {currentStepData?.description}
              </p>
            </div>

            {/* Step specific content */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 ${themeClasses.border} border-blue-200 dark:border-blue-800`}>
                  <h4 className={`font-semibold text-blue-700 dark:text-blue-300 mb-2`}>
                    💡 Mẹo: Tìm nút Layout Config
                  </h4>
                  <p className={`text-blue-600 dark:text-blue-400 text-sm`}>
                    Nút mở Layout Config Manager thường ở góc phải của Header, có icon ⚙️ (Settings)
                    và có hiệu ứng hover đẹp mắt với animation xoay và thay đổi màu sắc.
                  </p>
                </div>

                <button
                  onClick={() => setIsConfigOpen(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3 text-lg"
                >
                  <Settings size={20} />
                  {currentStepData?.buttonText}
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 ${themeClasses.border} border-green-200 dark:border-green-800`}>
                  <h4 className={`font-semibold text-green-700 dark:text-green-300 mb-3`}>
                    📱 Các chế độ hiển thị available:
                  </h4>                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Smartphone size={16} />
                      <span className="text-sm font-medium">Mobile (&lt; 768px)</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Tablet size={16} />
                      <span className="text-sm font-medium">Tablet (768px &minus; 1024px)</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <Monitor size={16} />
                      <span className="text-sm font-medium">Desktop (&gt; 1024px)</span>
                    </div>
                  </div>
                </div>
                <p className={`text-sm ${themeClasses.text.muted}`}>
                  Mỗi chế độ có cấu hình layout riêng biệt và không ảnh hưởng lẫn nhau.
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 ${themeClasses.border} border-purple-200 dark:border-purple-800`}>
                  <h4 className={`font-semibold text-purple-700 dark:text-purple-300 mb-2`}>
                    📋 Danh sách trang có sẵn:
                  </h4>                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {getPageList().slice(0, 6).map(page => (
                      <div key={page.id} className={`p-2 rounded bg-gray-100 dark:bg-gray-700`}>
                        <span className={`font-medium ${themeClasses.text.primary}`}>{page.name}</span>
                        <span className={`block text-xs ${themeClasses.text.muted}`}>{page.path}</span>
                      </div>
                    ))}
                    {getPageList().length > 6 && (
                      <div className={`p-2 rounded ${themeClasses.surface} text-center`}>
                        <span className={`text-sm ${themeClasses.text.muted}`}>...và {getPageList().length - 6} trang khác</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 ${themeClasses.border} border-orange-200 dark:border-orange-800`}>
                  <h4 className={`font-semibold text-orange-700 dark:text-orange-300 mb-3`}>
                    👁️ Widget Control Features:
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-green-600" />
                      <span className={themeClasses.text.primary}>Hiển thị widget (màu xanh lá)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <EyeOff size={16} className="text-gray-500" />
                      <span className={themeClasses.text.primary}>Ẩn widget (màu xám)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings size={16} className="text-blue-600" />
                      <span className={themeClasses.text.primary}>Thông tin vị trí và kích thước</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 ${themeClasses.border} border-indigo-200 dark:border-indigo-800`}>
                  <h4 className={`font-semibold text-indigo-700 dark:text-indigo-300 mb-2`}>
                    🔍 Layout Preview Benefits:
                  </h4>
                  <ul className="text-sm space-y-1 text-indigo-600 dark:text-indigo-400">
                    <li>✅ Xem trước bố cục trước khi áp dụng</li>
                    <li>✅ Kiểm tra vị trí tương đối của các widget</li>
                    <li>✅ Đảm bảo không có xung đột về không gian</li>
                    <li>✅ Tối ưu hóa trải nghiệm người dùng</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${themeClasses.border} ${themeClasses.text.primary} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                  >
                    🔄 Làm lại từ đầu
                  </button>
                  <button
                    onClick={() => setIsConfigOpen(true)}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                  >
                    🎯 Thực hành ngay
                  </button>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? `${themeClasses.text.muted} cursor-not-allowed`
                    : `${themeClasses.text.primary} hover:bg-gray-100 dark:hover:bg-gray-700`
                }`}
              >
                ← Bước trước
              </button>

              <span className={`px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${themeClasses.text.muted} text-sm`}>
                {currentStep} / {demoSteps.length}
              </span>

              <button
                onClick={() => setCurrentStep(Math.min(demoSteps.length, currentStep + 1))}
                disabled={currentStep === demoSteps.length}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === demoSteps.length
                    ? `${themeClasses.text.muted} cursor-not-allowed`
                    : `${themeClasses.text.primary} hover:bg-gray-100 dark:hover:bg-gray-700`
                }`}
              >
                Bước tiếp →
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-12 text-center p-6 rounded-xl ${themeClasses.surface} ${themeClasses.border} border`}>
          <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-2`}>
            🎉 Sẵn sàng sử dụng Layout Configuration Manager?
          </h3>
          <p className={`${themeClasses.text.muted} mb-4`}>
            Bây giờ bạn đã hiểu cách sử dụng các tính năng. Hãy thử ngay!
          </p>
          <button
            onClick={() => setIsConfigOpen(true)}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            🚀 Bắt đầu tùy chỉnh layout ngay
          </button>
        </div>
      </div>

      {/* Layout Configuration Manager */}
      <LayoutConfigManager
        themeClasses={themeClasses}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </div>
  );
};

export default LayoutConfigDemo;
