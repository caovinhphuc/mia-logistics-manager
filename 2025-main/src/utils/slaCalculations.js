// Hàm phân loại đơn hàng theo SLA
function categorizeOrdersBySLA() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Đơn hàng");
  const data = sheet.getDataRange().getValues();
  const headerRow = data[0];

  // Xác định vị trí các cột
  const dateIndex = headerRow.indexOf("Ngày đặt");
  const platformIndex = headerRow.indexOf("Sàn TMĐT");
  const slaIndex = headerRow.indexOf("SLA");

  // Xử lý từng đơn hàng
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const orderDate = new Date(row[dateIndex]);
    const platform = row[platformIndex];
    const now = new Date();

    // Tính SLA theo công thức đã cung cấp
    let slaCategory = calculateSLA(orderDate, platform, now);

    // Cập nhật SLA vào bảng
    sheet.getRange(i + 1, slaIndex + 1).setValue(slaCategory);
  }
}

// Hàm tính SLA cho từng đơn hàng
function calculateSLA(orderDate, platform, now) {
  const hoursDiff = (now - orderDate) / (1000 * 60 * 60);

  if (platform.toLowerCase().includes("shopee") && platform.toLowerCase().includes("express") || hoursDiff < 2) {
    return "P1 - Gấp 🚀";
  } else if (hoursDiff < 4) {
    return "P2 - Cảnh báo ⚠️";
  } else if (hoursDiff < 8) {
    return "P3 - Bình thường ✅";
  } else {
    return "P4 - Chờ xử lý 🕒";
  }
}

// Hàm chính để chạy phân loại
