from scripts.login_manager import CompleteLoginManager
import time

login_manager = CompleteLoginManager()
result = login_manager.complete_login_process()
if result['success']:
    driver = result['components']['driver']
    # Không navigate lại, dùng driver đang có
    print(f"URL hiện tại: {driver.current_url}")
    print(f"Title: {driver.title}")
    body = driver.find_element('tag name', 'body').text[:300]
    print(f"Body: {body}")
    with open('/tmp/one_page.html', 'w') as f:
        f.write(driver.page_source)
    print("✅ HTML saved")
    driver.quit()
