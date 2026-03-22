#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Login Module - Xử lý đăng nhập và quản lý session
Handles: authentication, session persistence, login validation
"""

import os
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException


class LoginManager:
    """Class xử lý đăng nhập hệ thống"""

    def __init__(self, driver, config, logger, session_manager=None):
        self.driver = driver
        self.config = config
        self.logger = logger
        self.session_manager = session_manager
        self.is_logged_in = False

    def check_existing_session(self):
        """Kiểm tra session hiện tại có còn hợp lệ không"""
        try:
            if not self.session_manager:
                return False

            session_data = self.session_manager.load_session()
            if not session_data:
                return False

            self.logger.info("🔄 Thử sử dụng session đã lưu...")

            # Load cookies vào driver
            self.driver.get(session_data['url'])
            time.sleep(1)

            for cookie in session_data['cookies']:
                try:
                    self.driver.add_cookie(cookie)
                except Exception:
                    continue

            # Refresh trang để áp dụng cookies
            self.driver.refresh()
            time.sleep(2)

            # Kiểm tra đã login chưa
            try:
                WebDriverWait(self.driver, 3).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR,
                        "[data-testid='user-name'], .user-name, .username"))
                )
                self.logger.info("✅ Session hợp lệ - đã đăng nhập từ trước")
                self.is_logged_in = True
                return True
            except TimeoutException:
                self.logger.info("❌ Session hết hạn")
                if self.session_manager:
                    self.session_manager.clear_session()
                return False

        except Exception as e:
            self.logger.error(f"❌ Lỗi kiểm tra session: {e}")
            return False

    def save_current_session(self):
        """Lưu session hiện tại"""
        try:
            if self.driver and self.is_logged_in and self.session_manager:
                cookies = self.driver.get_cookies()
                current_url = self.driver.current_url
                self.session_manager.save_session(cookies, current_url)
                self.logger.info("💾 Đã lưu session")
        except Exception as e:
            self.logger.warning(f"⚠️ Không thể lưu session: {e}")

    def login_to_system(self):
        """Đăng nhập vào hệ thống với session management"""
        try:
            self.logger.info("🔐 Bắt đầu đăng nhập vào hệ thống...")

            # Kiểm tra session hiện tại trước
            if self.check_existing_session():
                return True

            self.logger.info("🔐 Bắt đầu đăng nhập mới...")

            # Get credentials
            username = self.config['credentials']['username'].replace('${ONE_USERNAME}',
                      os.environ.get('ONE_USERNAME', ''))
            password = self.config['credentials']['password'].replace('${ONE_PASSWORD}',
                      os.environ.get('ONE_PASSWORD', ''))

            if not username or not password:
                raise Exception("Thiếu thông tin đăng nhập (username/password)")

            # Truy cập trang đăng nhập (trang chính)
            login_url = self.config['system']['one_url']
            self.driver.get(login_url)
            time.sleep(2)

            # Kiểm tra nhanh đã login chưa
            try:
                WebDriverWait(self.driver, 2).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR,
                        "[data-testid='user-name'], .user-name, .username"))
                )
                self.logger.info("✅ Đã đăng nhập sẵn")
                self.is_logged_in = True
                self.save_current_session()
                return True
            except TimeoutException:
                pass

            # Thực hiện đăng nhập với error handling tốt hơn
            wait = WebDriverWait(self.driver, 10)

            # Tìm username field với fallback
            username_selectors = [
                "input[name='username']",
                "input[name='email']",
                "input[type='text']",
                "#username",
                "#email"
            ]

            username_field = None
            for selector in username_selectors:
                try:
                    username_field = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
                    self.logger.info(f"✅ Tìm thấy username field: {selector}")
                    break
                except TimeoutException:
                    continue

            if not username_field:
                raise Exception("Không tìm thấy trường username")

            # Nhập username
            username_field.clear()
            username_field.send_keys(username)
            self.logger.info("✅ Đã nhập username")

            # Tìm password field
            try:
                password_field = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
                password_field.clear()
                password_field.send_keys(password)
                self.logger.info("✅ Đã nhập password")
            except Exception:
                raise Exception("Không tìm thấy trường password")

            # Tìm và click login button với fallback
            login_selectors = [
                "button[type='submit']",
                ".btn-primary",
                "input[type='submit']",
                ".login-btn",
                "button:contains('Login')",
                "button:contains('Đăng nhập')"
            ]

            login_button = None
            for selector in login_selectors:
                try:
                    login_button = self.driver.find_element(By.CSS_SELECTOR, selector)
                    break
                except Exception:
                    continue

            if not login_button:
                raise Exception("Không tìm thấy nút đăng nhập")

            login_button.click()
            self.logger.info("✅ Đã click nút đăng nhập")

            # Chờ login thành công
            time.sleep(3)

            # Kiểm tra login thành công với nhiều cách
            try:
                WebDriverWait(self.driver, 15).until(
                    EC.any_of(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='user-name'], .user-name, .username")),
                        # EC.url_contains("/so") removed - url stays same
                        EC.url_contains("dashboard"),
                        EC.url_contains("home"),
                        EC.url_changes(login_url),
                        EC.presence_of_element_located((By.CSS_SELECTOR, ".navbar-user, .user-info"))
                    )
                )
                self.logger.info("✅ Đăng nhập thành công")
                self.is_logged_in = True
                self.save_current_session()
                return True

            except TimeoutException:
                # Kiểm tra thêm bằng cách khác
                current_url = self.driver.current_url
                if current_url != login_url and "login" not in current_url.lower():
                    self.logger.info("✅ Đăng nhập thành công (URL changed)")
                    self.is_logged_in = True
                    self.save_current_session()
                    return True
                else:
                    # Check for error messages
                    error_selectors = [
                        ".alert-danger",
                        ".error-message",
                        ".login-error",
                        "[class*='error']"
                    ]

                    for selector in error_selectors:
                        try:
                            error_element = self.driver.find_element(By.CSS_SELECTOR, selector)
                            error_text = error_element.text.strip()
                            if error_text:
                                raise Exception(f"Login error: {error_text}")
                        except:
                            continue

                    raise Exception("Login timeout - không thể xác nhận đăng nhập")

        except Exception as e:
            self.logger.error(f"❌ Lỗi đăng nhập: {e}")
            return False

    def navigate_to_orders_page(self):
        """Điều hướng đến trang danh sách đơn hàng"""
        try:
            self.logger.info("📋 Điều hướng đến trang danh sách đơn hàng...")

            # Điều hướng trực tiếp đến trang đơn hàng
            orders_url = self.config['system'].get('orders_url', f"{self.config['system']['one_url']}/so/index")
            self.driver.get(orders_url)

            # Wait for page elements
            try:
                # Try different page indicators
                wait = WebDriverWait(self.driver, 10)
                wait.until(
                    EC.any_of(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "table, .table")),
                        EC.presence_of_element_located((By.CSS_SELECTOR, ".order-list, .orders")),
                        EC.presence_of_element_located((By.ID, "daterange-btn")),
                        EC.url_contains("/so/")
                    )
                )
                self.logger.info("✅ Đã tải trang đơn hàng thành công")

            except TimeoutException:
                self.logger.warning("⚠️ Trang tải chậm, tiếp tục...")

            time.sleep(1)  # Small delay for stability
            return True

        except Exception as e:
            self.logger.error(f"❌ Lỗi điều hướng đến trang đơn hàng: {e}")
            return False

    def logout(self):
        """Đăng xuất khỏi hệ thống"""
        try:
            if self.session_manager:
                self.session_manager.clear_session()
            self.is_logged_in = False
            self.logger.info("👋 Đã đăng xuất")
        except Exception as e:
            self.logger.warning(f"⚠️ Lỗi đăng xuất: {e}")

    def full_login_process(self):
        """Quy trình đăng nhập hoàn chỉnh"""
        try:
            self.logger.info("🚀 Bắt đầu quy trình đăng nhập hoàn chỉnh...")

            # Step 1: Login to system
            if not self.login_to_system():
                return {
                    'success': False,
                    'error': 'Login failed',
                    'step': 'login'
                }

            # Step 2: Navigate to orders page
            if not self.navigate_to_orders_page():
                return {
                    'success': False,
                    'error': 'Navigation failed',
                    'step': 'navigation'
                }

            self.logger.info("✅ Quy trình đăng nhập hoàn chỉnh thành công")
            return {
                'success': True,
                'is_logged_in': self.is_logged_in,
                'message': 'Login process completed successfully'
            }

        except Exception as e:
            self.logger.error(f"❌ Quy trình đăng nhập thất bại: {e}")
            return {
                'success': False,
                'error': str(e),
                'step': 'unknown'
            }


def login_to_automation_system(driver, config, logger, session_manager=None):
    """Convenience function để đăng nhập"""
    login_manager = LoginManager(driver, config, logger, session_manager)
    return login_manager.full_login_process()
