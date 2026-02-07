// LoginScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Shield, Eye, EyeOff, AlertTriangle, RefreshCw,
  CheckCircle, XCircle, Loader, Lock, Unlock ,BarChart3, Users, Settings, FileText
 } from 'lucide-react';

// Import các component và context cần thiết
import { useAuth } from '../context/AuthContext';
// Các icon từ lucide-react





const LoginScreen = () => {
  const navigate = useNavigate();
  const { login } = useAuth();


  useEffect(() => {
    document.title = 'Đăng nhập - MIA Warehouse';
  }, []);
  // State quản lý form đăng nhập
    const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Hàm xử lý thay đổi input
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user types
  };
  // Hàm xử lý submit
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }    setIsSubmitting(true);
    try {
      console.log('Attempting login with:', { email: formData.email, password: '***' });
      await login(formData.email, formData.password);
      console.log('Login successful');

      // Chuyển hướng đến dashboard sau khi đăng nhập thành công
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setIsSubmitting(false);
    }}, [formData, login, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !isSubmitting) {
        handleSubmit(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSubmit, isSubmitting]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo và branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl">
            <Package className="w-10 h-10 text-white" />
          </div>          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">MIA.vn</h1>
          <p className="text-blue-200"></p>
        </div>

        {/* Form đăng nhập */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Địa chỉ email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Nhập email của bạn"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                  placeholder="Nhập mật khẩu"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  Đang xác thực...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Đăng nhập hệ thống
                </div>
              )}
            </button>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm text-gray-300 mb-4 text-center">Tài khoản demo để test:</p>
            <div className="space-y-2">
              {[
                { role: 'Admin', email: 'admin@mia.vn', color: 'from-red-400 to-pink-400' },
                { role: 'Manager', email: 'manager@mia.vn', color: 'from-green-400 to-blue-400' },
                { role: 'Staff', email: 'staff@mia.vn', color: 'from-yellow-400 to-orange-400' }
              ].map((account) => (
                <div
                  key={account.role}
                  className="bg-white/5 rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => setFormData({ email: account.email, password: '123456' })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${account.color} mr-3`}></div>
                      <div>
                        <span className="text-white text-sm font-medium">{account.role}:</span>
                        <span className="text-gray-300 text-sm ml-2">{account.email}</span>
                      </div>
                    </div>
                    <span className="text-gray-400 text-xs">123456</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
