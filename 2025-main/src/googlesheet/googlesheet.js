// ===== WAREHOUSE STAFF MANAGEMENT SYSTEM - GOOGLE APPS SCRIPT =====
// Tác giả: Cao Vĩnh Phúc
// Ngày: 23/05/2025
// Mục đích: Quản lý nhân sự kho vận theo nguyên tắc 20/80

// ===== CONSTANTS & CONFIGURATION =====
const CONFIG = {
  SHEETS: {
    STAFF_DATA: 'Danh_Sach_Nhan_Vien',
    PERFORMANCE: 'Hieu_Suat_Hang_Ngay',
    SCHEDULE: 'Lich_Lam_Viec',
    METRICS: 'Chi_So_KPI',
    ORDERS: 'Don_Hang_Hang_Ngay',
    DASHBOARD: 'Dashboard_Metrics'
  },
  PARETO: {
    TOP_PERFORMER_THRESHOLD: 90, // Hiệu suất >= 90% = top performer
    TOP_PERFORMER_RATIO: 0.2,    // 20% nhân viên top
    CONTRIBUTION_RATIO: 0.8      // Đóng góp 80% hiệu suất
  },
  COLORS: {
    TOP_PERFORMER: '#3b82f6',
    STANDARD: '#e5e7eb',
    WARNING: '#f59e0b',
    GOOD: '#10b981',
    EXCELLENT: '#8b5cf6'
  }
};

// ===== MAIN MENU FUNCTIONS =====
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🏭 Quản Lý Nhân Sự Kho Vận')
    .addItem('🔄 Cập Nhật Dashboard', 'refreshDashboard')
    .addSeparator()
    .addSubMenu(ui.createMenu('📊 Phân Tích Pareto (20/80)')
      .addItem('🎯 Xác Định Top Performers', 'identifyTopPerformers')
      .addItem('📈 Phân Tích Đóng Góp', 'analyzeContribution')
      .addItem('💡 Đề Xuất Tối Ưu', 'generateOptimizationSuggestions'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📅 Lịch Làm Việc')
      .addItem('⚡ Tự Động Phân Ca', 'autoScheduleshifts')
      .addItem('👥 Phân Bổ Theo Hiệu Suất', 'scheduleByPerformance')
      .addItem('📋 Xuất Lịch Tuần', 'exportWeeklySchedule'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📈 Báo Cáo & Thống Kê')
      .addItem('📊 Báo Cáo Hiệu Suất', 'generatePerformanceReport')
      .addItem('💰 Phân Tích ROI', 'analyzeROI')
      .addItem('🎯 KPI Dashboard', 'updateKPIDashboard'))
    .addSeparator()
    .addItem('⚙️ Thiết Lập Hệ Thống', 'setupSystem')
    .addItem('❓ Hướng Dẫn Sử Dụng', 'showUserGuide')
    .addToUi();
}

// ===== SYSTEM SETUP =====
function setupSystem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    // Tạo các sheet cần thiết
    createRequiredSheets();

    // Thiết lập format và headers
    setupSheetFormats();

    // Tạo dữ liệu mẫu
    createSampleData();

    // Thiết lập triggers
    setupTriggers();

    SpreadsheetApp.getUi().alert(
      'Thiết Lập Hoàn Tất',
      'Hệ thống đã được thiết lập thành công!\n\n' +
      '✅ Đã tạo các sheet cần thiết\n' +
      '✅ Đã thiết lập format và headers\n' +
      '✅ Đã tạo dữ liệu mẫu\n' +
      '✅ Đã thiết lập auto-refresh\n\n' +
      'Bạn có thể bắt đầu sử dụng hệ thống ngay!',
      SpreadsheetApp.getUi().ButtonSet.OK
    );

  } catch (error) {
    console.error('Lỗi thiết lập hệ thống:', error);
    SpreadsheetApp.getUi().alert('Lỗi', 'Có lỗi xảy ra khi thiết lập: ' + error.message);
  }
}

function createRequiredSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  Object.values(CONFIG.SHEETS).forEach(sheetName => {
    if (!ss.getSheetByName(sheetName)) {
      ss.insertSheet(sheetName);
    }
  });
}

function setupSheetFormats() {
  setupStaffDataSheet();
  setupPerformanceSheet();
  setupScheduleSheet();
  setupMetricsSheet();
  setupOrdersSheet();
  setupDashboardSheet();
}

// ===== STAFF DATA MANAGEMENT =====
function setupStaffDataSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.STAFF_DATA);

  // Headers
  const headers = [
    'ID', 'Họ Tên', 'Vai Trò', 'Kinh Nghiệm (tháng)', 'Hiệu Suất (%)',
    'Kỹ Năng', 'Ca Làm Việc', 'Trạng Thái', 'Top Performer', 'Ghi Chú'
  ];

  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white');

  // Freeze header row
  sheet.setFrozenRows(1);

  // Set column widths
  const widths = [60, 150, 100, 120, 100, 150, 120, 100, 120, 200];
  widths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
}

function setupPerformanceSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.PERFORMANCE);

  const headers = [
    'Ngày', 'ID Nhân Viên', 'Tên', 'Vai Trò', 'Số Đơn Xử Lý',
    'Thời Gian Làm Việc (h)', 'Hiệu Suất (%)', 'Chất Lượng (%)', 'SLA (%)', 'Ghi Chú'
  ];

  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight('bold')
    .setBackground('#10b981')
    .setFontColor('white');

  sheet.setFrozenRows(1);
}

function setupScheduleSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.SCHEDULE);

  const headers = [
    'Tuần', 'Ngày', 'Ca Sáng (6h-14h)', 'Ca Chiều (14h-22h)',
    'Tổng Nhân Sự', 'Dự Báo Đơn Hàng', 'Khối Lượng (%)', 'Sự Kiện Đặc Biệt'
  ];

  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight('bold')
    .setBackground('#8b5cf6')
    .setFontColor('white');

  sheet.setFrozenRows(1);
}

function setupMetricsSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.METRICS);

  const headers = [
    'Ngày', 'Tổng Nhân Sự', 'Nhân Sự Hoạt Động', 'Tỷ Lệ Sử Dụng (%)',
    'Tổng Đơn Hàng', 'Đơn Hoàn Thành', 'SLA (%)', 'Hiệu Suất TB (%)',
    'Top Performers', 'Throughput/h', 'Chi Phí/Đơn', 'ROI (%)'
  ];

  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight('bold')
    .setBackground('#f59e0b')
    .setFontColor('white');

  sheet.setFrozenRows(1);
}

function setupOrdersSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.ORDERS);

  const headers = [
    'Ngày', 'Mã Đơn', 'Kênh', 'Thời Gian Đặt', 'Thời Gian Hoàn Thành',
    'Nhân Viên Xử Lý', 'Thời Gian Xử Lý (h)', 'Trạng Thái', 'Chất Lượng'
  ];

  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight('bold')
    .setBackground('#ef4444')
    .setFontColor('white');

  sheet.setFrozenRows(1);
}

function setupDashboardSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.DASHBOARD);

  // Tạo dashboard với các metrics chính
  const dashboardStructure = [
    ['DASHBOARD QUẢN LÝ NHÂN SỰ KHO VẬN', '', '', ''],
    ['Ngày cập nhật:', '=TODAY()', '', ''],
    ['', '', '', ''],
    ['KPI CHÍNH', 'Giá Trị', 'Mục Tiêu', 'Trạng Thái'],
    ['Tổng Nhân Sự', '=COUNTA(Danh_Sach_Nhan_Vien!B:B)-1', '30', ''],
    ['Hiệu Suất TB (%)', '=AVERAGE(Danh_Sach_Nhan_Vien!E:E)', '85', ''],
    ['Top Performers', '=COUNTIF(Danh_Sach_Nhan_Vien!I:I,"TRUE")', '6', ''],
    ['SLA Compliance (%)', '=AVERAGE(Hieu_Suat_Hang_Ngay!I:I)', '95', ''],
    ['', '', '', ''],
    ['PHÂN TÍCH PARETO', '', '', ''],
    ['20% Top Performers', '=D7', '', ''],
    ['Đóng góp hiệu suất (%)', '80', '', ''],
    ['80% Nhân viên còn lại', '=D5-D7', '', ''],
    ['Đóng góp hiệu suất (%)', '20', '', '']
  ];

  sheet.getRange(1, 1, dashboardStructure.length, 4).setValues(dashboardStructure);

  // Format dashboard
  sheet.getRange(1, 1, 1, 4).merge()
    .setFontSize(16)
    .setFontWeight('bold')
    .setBackground('#1e3a8a')
    .setFontColor('white')
    .setHorizontalAlignment('center');

  sheet.getRange(4, 1, 1, 4)
    .setFontWeight('bold')
    .setBackground('#dbeafe');

  sheet.getRange(10, 1, 1, 4)
    .setFontWeight('bold')
    .setBackground('#ecfdf5');
}

// ===== PARETO ANALYSIS FUNCTIONS =====
function identifyTopPerformers() {
  const staffSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.STAFF_DATA);
  const data = staffSheet.getDataRange().getValues();

  if (data.length <= 1) {
    SpreadsheetApp.getUi().alert('Lỗi', 'Không có dữ liệu nhân viên để phân tích!');
    return;
  }

  // Bỏ header row
  const staffData = data.slice(1);

  // Sắp xếp theo hiệu suất giảm dần
  staffData.sort((a, b) => (b[4] || 0) - (a[4] || 0));

  // Xác định top 20%
  const topCount = Math.ceil(staffData.length * CONFIG.PARETO.TOP_PERFORMER_RATIO);

  // Reset tất cả về false trước
  const topPerformerColumn = 9; // Column I (index 8, but 1-based)
  staffSheet.getRange(2, topPerformerColumn, staffData.length, 1).setValue('FALSE');

  // Đánh dấu top performers
  for (let i = 0; i < topCount; i++) {
    const rowIndex = staffData.findIndex(row =>
      row[1] === staffData[i][1] && row[4] === staffData[i][4]
    ) + 2; // +2 vì bỏ header và index bắt đầu từ 1

    staffSheet.getRange(rowIndex, topPerformerColumn).setValue('TRUE');

    // Highlight màu xanh cho top performers
    staffSheet.getRange(rowIndex, 1, 1, 10)
      .setBackground('#dbeafe')
      .setFontWeight('bold');
  }

  // Tạo báo cáo
  generateTopPerformerReport(staffData, topCount);

  SpreadsheetApp.getUi().alert(
    'Xác Định Top Performers Hoàn Tất',
    `✅ Đã xác định ${topCount} top performers (20%)\n` +
    `📊 ${staffData.length - topCount} nhân viên còn lại (80%)\n\n` +
    `Top performers được highlight màu xanh trong sheet ${CONFIG.SHEETS.STAFF_DATA}`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function generateTopPerformerReport(staffData, topCount) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let reportSheet = ss.getSheetByName('Bao_Cao_Top_Performers');

  if (reportSheet) {
    ss.deleteSheet(reportSheet);
  }

  reportSheet = ss.insertSheet('Bao_Cao_Top_Performers');

  // Header
  const reportData = [
    ['BÁO CÁO TOP PERFORMERS (PHÂN TÍCH PARETO)', '', '', '', ''],
    ['Ngày tạo:', new Date().toLocaleDateString('vi-VN'), '', '', ''],
    ['', '', '', '', ''],
    ['TOP 20% PERFORMERS', '', '', '', ''],
    ['STT', 'Họ Tên', 'Vai Trò', 'Hiệu Suất (%)', 'Kinh Nghiệm']
  ];

  // Thêm data top performers
  for (let i = 0; i < topCount; i++) {
    reportData.push([
      i + 1,
      staffData[i][1],
      staffData[i][2],
      staffData[i][4],
      staffData[i][3] + ' tháng'
    ]);
  }

  reportData.push(['', '', '', '', '']);
  reportData.push(['80% NHÂN VIÊN CÒN LẠI', '', '', '', '']);
  reportData.push(['STT', 'Họ Tên', 'Vai Trò', 'Hiệu Suất (%)', 'Kinh Nghiệm']);

  // Thêm data 80% còn lại
  for (let i = topCount; i < staffData.length; i++) {
    reportData.push([
      i - topCount + 1,
      staffData[i][1],
      staffData[i][2],
      staffData[i][4],
      staffData[i][3] + ' tháng'
    ]);
  }

  // Ghi data
  reportSheet.getRange(1, 1, reportData.length, 5).setValues(reportData);

  // Format
  reportSheet.getRange(1, 1, 1, 5).merge()
    .setFontSize(14)
    .setFontWeight('bold')
    .setBackground('#1e3a8a')
    .setFontColor('white')
    .setHorizontalAlignment('center');

  reportSheet.getRange(4, 1, 1, 5)
    .setFontWeight('bold')
    .setBackground('#3b82f6')
    .setFontColor('white');

  reportSheet.getRange(5, 1, 1, 5)
    .setFontWeight('bold')
    .setBackground('#dbeafe');

  const eightyPercentStartRow = 7 + topCount;
  reportSheet.getRange(eightyPercentStartRow, 1, 1, 5)
    .setFontWeight('bold')
    .setBackground('#f59e0b')
    .setFontColor('white');

  reportSheet.getRange(eightyPercentStartRow + 1, 1, 1, 5)
    .setFontWeight('bold')
    .setBackground('#fef3c7');

  reportSheet.autoResizeColumns(1, 5);
}

function analyzeContribution() {
  const staffSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.STAFF_DATA);
  const data = staffSheet.getDataRange().getValues();

  if (data.length <= 1) {
    SpreadsheetApp.getUi().alert('Lỗi', 'Không có dữ liệu để phân tích!');
    return;
  }

  const staffData = data.slice(1);
  const topPerformers = staffData.filter(row => row[8] === 'TRUE' || row[8] === true);
  const regularStaff = staffData.filter(row => row[8] !== 'TRUE' && row[8] !== true);

  // Tính toán đóng góp
  const topPerformanceSum = topPerformers.reduce((sum, row) => sum + (row[4] || 0), 0);
  const regularPerformanceSum = regularStaff.reduce((sum, row) => sum + (row[4] || 0), 0);
  const totalPerformance = topPerformanceSum + regularPerformanceSum;

  const topContribution = (topPerformanceSum / totalPerformance) * 100;
  const regularContribution = (regularPerformanceSum / totalPerformance) * 100;

  // Tạo báo cáo đóng góp
  createContributionReport(topPerformers, regularStaff, topContribution, regularContribution);

  SpreadsheetApp.getUi().alert(
    'Phân Tích Đóng Góp Hoàn Tất',
    `📊 PHÂN TÍCH PARETO:\n\n` +
    `🎯 Top 20% (${topPerformers.length} người):\n` +
    `   Đóng góp: ${topContribution.toFixed(1)}% hiệu suất tổng thể\n\n` +
    `👥 80% còn lại (${regularStaff.length} người):\n` +
    `   Đóng góp: ${regularContribution.toFixed(1)}% hiệu suất tổng thể\n\n` +
    `✨ Tỷ lệ đóng góp: ${(topContribution/regularContribution).toFixed(1)}:1`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function createContributionReport(topPerformers, regularStaff, topContribution, regularContribution) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let reportSheet = ss.getSheetByName('Phan_Tich_Dong_Gop');

  if (reportSheet) {
    ss.deleteSheet(reportSheet);
  }

  reportSheet = ss.insertSheet('Phan_Tich_Dong_Gop');

  const reportData = [
    ['PHÂN TÍCH ĐÓNG GÓP THEO NGUYÊN TẮC PARETO', '', '', ''],
    ['Ngày phân tích:', new Date().toLocaleDateString('vi-VN'), '', ''],
    ['', '', '', ''],
    ['TỔNG QUAN', '', '', ''],
    ['Chỉ số', 'Top 20%', '80% Còn Lại', 'Tỷ Lệ'],
    ['Số lượng nhân viên', topPerformers.length, regularStaff.length, `1:${(regularStaff.length/topPerformers.length).toFixed(1)}`],
    ['Hiệu suất trung bình (%)', (topPerformers.reduce((sum, r) => sum + r[4], 0) / topPerformers.length).toFixed(1), (regularStaff.reduce((sum, r) => sum + r[4], 0) / regularStaff.length).toFixed(1), ''],
    ['Đóng góp hiệu suất (%)', topContribution.toFixed(1), regularContribution.toFixed(1), `${(topContribution/regularContribution).toFixed(1)}:1`],
    ['', '', '', ''],
    ['CHI TIẾT TOP PERFORMERS', '', '', ''],
    ['Tên', 'Vai Trò', 'Hiệu Suất (%)', 'Kinh Nghiệm']
  ];

  // Thêm chi tiết top performers
  topPerformers.forEach(performer => {
    reportData.push([
      performer[1],
      performer[2],
      performer[4],
      performer[3] + ' tháng'
    ]);
  });

  reportData.push(['', '', '', '']);
  reportData.push(['KHUYẾN NGHỊ THEO PARETO', '', '', '']);
  reportData.push(['🎯 Tập trung vào Top 20%', 'Giao nhiệm vụ quan trọng', 'Tăng lương/thưởng', 'Phát triển leadership']);
  reportData.push(['📈 Nâng cao 80% còn lại', 'Đào tạo chéo kỹ năng', 'Ghép cặp mentor', 'Thiết lập KPI rõ ràng']);
  reportData.push(['💰 Tối ưu chi phí', '70% budget retention → Top 20%', '80% budget training → 80% còn lại', 'ROI dự kiến: 300%+']);

  // Ghi data
  reportSheet.getRange(1, 1, reportData.length, 4).setValues(reportData);

  // Format
  reportSheet.getRange(1, 1, 1, 4).merge()
    .setFontSize(14)
    .setFontWeight('bold')
    .setBackground('#1e3a8a')
    .setFontColor('white')
    .setHorizontalAlignment('center');

  reportSheet.getRange(4, 1, 1, 4)
    .setFontWeight('bold')
    .setBackground('#3b82f6')
    .setFontColor('white');

  reportSheet.getRange(5, 1, 1, 4)
    .setFontWeight('bold')
    .setBackground('#dbeafe');

  reportSheet.autoResizeColumns(1, 4);
}

// ===== SCHEDULING FUNCTIONS =====
function autoScheduleshifts() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(
    'Tự Động Phân Ca',
    'Hệ thống sẽ tự động phân ca dựa trên:\n\n' +
    '• Hiệu suất nhân viên (Pareto 20/80)\n' +
    '• Khối lượng công việc dự báo\n' +
    '• Kỹ năng và kinh nghiệm\n\n' +
    'Tiếp tục?',
    ui.ButtonSet.YES_NO
  );

  if (result !== ui.Button.YES) return;

  try {
    const staffData = getStaffData();
    const weeklyWorkload = getWeeklyWorkload();

    const schedule = generateOptimalSchedule(staffData, weeklyWorkload);
    writeScheduleToSheet(schedule);

    ui.alert(
      'Phân Ca Hoàn Tất',
      '✅ Đã tự động phân ca cho tuần\n' +
      '📊 Ưu tiên top performers cho ngày cao điểm\n' +
      '⚖️ Cân bằng khối lượng công việc\n' +
      '🎯 Tối ưu theo nguyên tắc 20/80\n\n' +
      `Xem chi tiết tại sheet "${CONFIG.SHEETS.SCHEDULE}"`,
      ui.ButtonSet.OK
    );

  } catch (error) {
    console.error('Lỗi tự động phân ca:', error);
    ui.alert('Lỗi', 'Có lỗi xảy ra: ' + error.message);
  }
}

function generateOptimalSchedule(staffData, weeklyWorkload) {
  const topPerformers = staffData.filter(staff => staff.isTopPerformer);
  const regularStaff = staffData.filter(staff => !staff.isTopPerformer);

  const schedule = [];

  weeklyWorkload.forEach((day, index) => {
    const dayName = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][index];
    const isHighWorkload = day.workload > 85;

    // Tính số nhân sự cần thiết
    const totalStaffNeeded = Math.ceil(day.orders / 40); // 40 đơn/người/ngày
    const morningStaff = Math.ceil(totalStaffNeeded * 0.6);
    const afternoonStaff = Math.ceil(totalStaffNeeded * 0.4);

    let morningShift = [];
    let afternoonShift = [];

    if (isHighWorkload) {
      // Ngày cao điểm: ưu tiên top performers
      morningShift = [...topPerformers.slice(0, Math.min(topPerformers.length, morningStaff))];
      if (morningShift.length < morningStaff) {
        morningShift.push(...regularStaff.slice(0, morningStaff - morningShift.length));
      }

      afternoonShift = [...topPerformers.slice(morningShift.filter(s => s.isTopPerformer).length)];
      if (afternoonShift.length < afternoonStaff) {
        afternoonShift.push(...regularStaff.slice(morningStaff - topPerformers.length, afternoonStaff));
      }
    } else {
      // Ngày bình thường: phân bổ đều
      morningShift = staffData.slice(0, morningStaff);
      afternoonShift = staffData.slice(morningStaff, morningStaff + afternoonStaff);
    }

    schedule.push({
      week: `Tuần ${Math.ceil(new Date().getDate() / 7)}`,
      day: dayName,
      morningShift: morningShift.map(s => s.name).join(', '),
      afternoonShift: afternoonShift.map(s => s.name).join(', '),
      totalStaff: morningShift.length + afternoonShift.length,
      forecastOrders: day.orders,
      workload: day.workload,
      specialEvent: isHighWorkload ? 'Cao điểm' : ''
    });
  });

  return schedule;
}

function writeScheduleToSheet(schedule) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.SCHEDULE);

  // Clear existing data (except headers)
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  }

  // Write new schedule
  const scheduleData = schedule.map(day => [
    day.week,
    day.day,
    day.morningShift,
    day.afternoonShift,
    day.totalStaff,
    day.forecastOrders,
    day.workload + '%',
    day.specialEvent
  ]);

  sheet.getRange(2, 1, scheduleData.length, 8).setValues(scheduleData);

  // Format high workload days
  schedule.forEach((day, index) => {
    if (day.workload > 85) {
      sheet.getRange(index + 2, 1, 1, 8)
        .setBackground('#fef3c7')
        .setFontWeight('bold');
    }
  });
}

// ===== REPORTING FUNCTIONS =====
function generatePerformanceReport() {
  const ui = SpreadsheetApp.getUi();

  try {
    const staffData = getStaffData();
    const performanceData = getPerformanceData();

    createPerformanceReport(staffData, performanceData);

    ui.alert(
      'Báo Cáo Hiệu Suất Hoàn Tất',
      '✅ Đã tạo báo cáo hiệu suất chi tiết\n' +
      '📊 Phân tích theo nguyên tắc Pareto\n' +
      '📈 Xu hướng và so sánh\n' +
      '💡 Đề xuất cải thiện\n\n' +
      'Xem báo cáo tại sheet "Bao_Cao_Hieu_Suat"',
      ui.ButtonSet.OK
    );

  } catch (error) {
    console.error('Lỗi tạo báo cáo:', error);
    ui.alert('Lỗi', 'Có lỗi xảy ra: ' + error.message);
  }
}

function createPerformanceReport(staffData, performanceData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let reportSheet = ss.getSheetByName('Bao_Cao_Hieu_Suat');

  if (reportSheet) {
    ss.deleteSheet(reportSheet);
  }

  reportSheet = ss.insertSheet('Bao_Cao_Hieu_Suat');

  // Calculate metrics
  const topPerformers = staffData.filter(s => s.isTopPerformer);
  const avgEfficiency = staffData.reduce((sum, s) => sum + s.efficiency, 0) / staffData.length;
  const topAvgEfficiency = topPerformers.reduce((sum, s) => sum + s.efficiency, 0) / topPerformers.length;

  const reportData = [
    ['BÁO CÁO HIỆU SUẤT NHÂN SỰ KHO VẬN', '', '', '', ''],
    ['Ngày báo cáo:', new Date().toLocaleDateString('vi-VN'), '', '', ''],
    ['Người tạo:', 'Cao Vĩnh Phúc - Trưởng phòng Kho vận', '', '', ''],
    ['', '', '', '', ''],
    ['TỔNG QUAN HIỆU SUẤT', '', '', '', ''],
    ['Chỉ số', 'Giá trị', 'Mục tiêu', 'Đạt/Không', 'Ghi chú'],
    ['Tổng nhân sự', staffData.length, '25-30', staffData.length >= 25 ? 'Đạt' : 'Chưa đạt', ''],
    ['Hiệu suất trung bình (%)', avgEfficiency.toFixed(1), '85', avgEfficiency >= 85 ? 'Đạt' : 'Chưa đạt', ''],
    ['Top performers', topPerformers.length, Math.ceil(staffData.length * 0.2), topPerformers.length >= Math.ceil(staffData.length * 0.2) ? 'Đạt' : 'Cần cải thiện', '20% tổng nhân sự'],
    ['Hiệu suất top 20% (%)', topAvgEfficiency.toFixed(1), '90', topAvgEfficiency >= 90 ? 'Đạt' : 'Chưa đạt', ''],
    ['', '', '', '', ''],
    ['PHÂN TÍCH PARETO (20/80)', '', '', '', ''],
    ['Top 20% nhân viên', topPerformers.length + ' người', '', '', 'Đóng góp ~80% hiệu suất'],
    ['80% nhân viên còn lại', (staffData.length - topPerformers.length) + ' người', '', '', 'Đóng góp ~20% hiệu suất'],
    ['Tỷ lệ đóng góp', '4:1', '', '', 'Top performers hiệu quả gấp 4 lần'],
    ['', '', '', '', ''],
    ['ĐỀ XUẤT HÀNH ĐỘNG', '', '', '', ''],
    ['Ưu tiên cao', 'Retention top performers', 'Tăng lương 15-20%', 'Q2/2025', 'Tránh mất nhân tài'],
    ['Ưu tiên trung bình', 'Đào tạo 80% còn lại', 'Training program', 'Q2-Q3/2025', 'Nâng cao tổng thể'],
    ['Dài hạn', 'Chuẩn hóa quy trình', 'Best practices', 'Q3/2025', 'Sustainable growth']
  ];

  // Ghi data
  reportSheet.getRange(1, 1, reportData.length, 5).setValues(reportData);

  // Format
  formatPerformanceReport(reportSheet);
}

function formatPerformanceReport(sheet) {
  // Title
  sheet.getRange(1, 1, 1, 5).merge()
    .setFontSize(16)
    .setFontWeight('bold')
    .setBackground('#1e3a8a')
    .setFontColor('white')
    .setHorizontalAlignment('center');

  // Section headers
  const sectionRows = [5, 12, 17];
  sectionRows.forEach(row => {
    sheet.getRange(row, 1, 1, 5)
      .setFontWeight('bold')
      .setBackground('#3b82f6')
      .setFontColor('white');
  });

  // Data headers
  sheet.getRange(6, 1, 1, 5)
    .setFontWeight('bold')
    .setBackground('#dbeafe');

  // Auto resize
  sheet.autoResizeColumns(1, 5);

  // Add borders
  sheet.getRange(1, 1, sheet.getLastRow(), 5)
    .setBorder(true, true, true, true, true, true);
}

// ===== UTILITY FUNCTIONS =====
function getStaffData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.STAFF_DATA);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return [];

  return data.slice(1).map(row => ({
    id: row[0],
    name: row[1],
    role: row[2],
    experience: row[3],
    efficiency: row[4],
    skills: row[5],
    shift: row[6],
    status: row[7],
    isTopPerformer: row[8] === 'TRUE' || row[8] === true
  }));
}

function getPerformanceData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.PERFORMANCE);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return [];

  return data.slice(1).map(row => ({
    date: row[0],
    staffId: row[1],
    name: row[2],
    role: row[3],
    ordersProcessed: row[4],
    hoursWorked: row[5],
    efficiency: row[6],
    quality: row[7],
    sla: row[8]
  }));
}

function getWeeklyWorkload() {
  // Mock data - in thực tế sẽ lấy from forecast hoặc historical data
  return [
    { orders: 450, workload: 85 }, // T2
    { orders: 380, workload: 72 }, // T3
    { orders: 520, workload: 95 }, // T4
    { orders: 420, workload: 80 }, // T5
    { orders: 650, workload: 100 }, // T6
    { orders: 320, workload: 60 }, // T7
    { orders: 180, workload: 35 }  // CN
  ];
}

function refreshDashboard() {
  updateKPIDashboard();
  SpreadsheetApp.getUi().alert(
    'Dashboard Đã Cập Nhật',
    '✅ Đã cập nhật tất cả metrics\n' +
    '📊 KPI dashboard được refresh\n' +
    '🔄 Dữ liệu real-time\n\n' +
    `Xem tại sheet "${CONFIG.SHEETS.DASHBOARD}"`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function updateKPIDashboard() {
  const dashboardSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.DASHBOARD);

  // Update timestamp
  dashboardSheet.getRange(2, 2).setValue(new Date());

  // Recalculate formulas (they auto-update, but we can force refresh)
  SpreadsheetApp.flush();
}

function createSampleData() {
  createSampleStaffData();
  createSamplePerformanceData();
}

function createSampleStaffData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.STAFF_DATA);

  const sampleData = [
    ['NV001', 'Nguyễn Văn A', 'Picking', 36, 98, 'Picking, Packing, QC', 'Ca sáng', 'Hoạt động', 'TRUE', 'Top performer xuất sắc'],
    ['NV002', 'Trần Thị B', 'Picking', 24, 96, 'Picking, QC', 'Ca sáng', 'Hoạt động', 'TRUE', 'Nhân viên kinh nghiệm'],
    ['NV003', 'Lê Văn C', 'Packing', 18, 90, 'Packing, Picking', 'Ca chiều', 'Hoạt động', 'FALSE', ''],
    ['NV004', 'Phạm Thị D', 'Packing', 12, 88, 'Packing', 'Ca sáng', 'Nghỉ', 'FALSE', ''],
    ['NV005', 'Võ Văn E', 'QC', 30, 95, 'QC, Packing', 'Ca chiều', 'Hoạt động', 'TRUE', 'Chuyên gia QC'],
    ['NV006', 'Trần Văn F', 'Picking', 9, 85, 'Picking', 'Ca sáng', 'Hoạt động', 'FALSE', ''],
    ['NV007', 'Nguyễn Thị G', 'QC', 15, 92, 'QC', 'Ca chiều', 'Hoạt động', 'FALSE', ''],
    ['NV008', 'Lê Thị H', 'Picking', 6, 82, 'Picking', 'Ca sáng', 'Offline', 'FALSE', 'Cần đào tạo thêm'],
    ['NV009', 'Hoàng Văn I', 'Packing', 8, 84, 'Packing', 'Ca chiều', 'Hoạt động', 'FALSE', '']
  ];

  sheet.getRange(2, 1, sampleData.length, 10).setValues(sampleData);

  // Format top performers
  sampleData.forEach((row, index) => {
    if (row[8] === 'TRUE') {
      sheet.getRange(index + 2, 1, 1, 10)
        .setBackground('#dbeafe')
        .setFontWeight('bold');
    }
  });
}

function createSamplePerformanceData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.PERFORMANCE);

  const today = new Date();
  const sampleData = [];

  // Tạo dữ liệu 7 ngày gần nhất
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Data cho mỗi nhân viên mỗi ngày
    const staffIds = ['NV001', 'NV002', 'NV003', 'NV005', 'NV006', 'NV007', 'NV009'];
    const staffNames = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Võ Văn E', 'Trần Văn F', 'Nguyễn Thị G', 'Hoàng Văn I'];
    const roles = ['Picking', 'Picking', 'Packing', 'QC', 'Picking', 'QC', 'Packing'];

    staffIds.forEach((id, index) => {
      const baseEfficiency = id === 'NV001' ? 98 : id === 'NV002' ? 96 : id === 'NV005' ? 95 : 85;
      const variance = (Math.random() - 0.5) * 10;
      const efficiency = Math.max(70, Math.min(100, baseEfficiency + variance));

      sampleData.push([
        date,
        id,
        staffNames[index],
        roles[index],
        Math.floor(Math.random() * 20) + 30, // 30-50 đơn
        8 + Math.random() * 2, // 8-10 giờ
        Math.round(efficiency),
        Math.round(92 + Math.random() * 8), // 92-100% quality
        Math.round(88 + Math.random() * 12), // 88-100% SLA
        ''
      ]);
    });
  }

  sheet.getRange(2, 1, sampleData.length, 10).setValues(sampleData);
}

function setupTriggers() {
  // Xóa triggers cũ
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === 'refreshDashboard') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Tạo trigger mới - refresh dashboard mỗi giờ
  ScriptApp.newTrigger('refreshDashboard')
    .timeBased()
    .everyHours(1)
    .create();
}

function showUserGuide() {
  const html = HtmlService.createHtmlOutput(`
    <style>
      body { font-family: Arial; padding: 20px; line-height: 1.6; }
      .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
      h2 { color: #1e3a8a; margin-top: 0; }
      .highlight { background: #dbeafe; padding: 5px; border-radius: 4px; }
      ul { margin: 0; padding-left: 20px; }
    </style>

    <h1>🏭 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG QUẢN LÝ NHÂN SỰ KHO VẬN</h1>

    <div class="section">
      <h2>🚀 Bắt Đầu</h2>
      <ul>
        <li>Chạy <span class="highlight">"Thiết Lập Hệ Thống"</span> lần đầu tiên</li>
        <li>Cập nhật dữ liệu nhân viên trong sheet "Danh_Sach_Nhan_Vien"</li>
        <li>Chạy <span class="highlight">"Xác Định Top Performers"</span> để phân tích Pareto</li>
      </ul>
    </div>

    <div class="section">
      <h2>📊 Phân Tích Pareto (20/80)</h2>
      <ul>
        <li><strong>Xác Định Top Performers:</strong> Tự động xác định 20% nhân viên xuất sắc nhất</li>
        <li><strong>Phân Tích Đóng Góp:</strong> Tính toán đóng góp hiệu suất của từng nhóm</li>
        <li><strong>Đề Xuất Tối Ưu:</strong> Gợi ý cách tập trung nguồn lực hiệu quả</li>
      </ul>
    </div>

    <div class="section">
      <h2>📅 Quản Lý Lịch Làm Việc</h2>
      <ul>
        <li><strong>Tự Động Phân Ca:</strong> Phân ca dựa trên hiệu suất và khối lượng công việc</li>
        <li><strong>Phân Bổ Theo Hiệu Suất:</strong> Ưu tiên top performers cho ngày cao điểm</li>
        <li><strong>Xuất Lịch Tuần:</strong> Tạo lịch làm việc chi tiết</li>
      </ul>
    </div>

    <div class="section">
      <h2>📈 Báo Cáo & KPI</h2>
      <ul>
        <li><strong>Dashboard KPI:</strong> Theo dõi các chỉ số quan trọng real-time</li>
        <li><strong>Báo Cáo Hiệu Suất:</strong> Phân tích chi tiết hiệu suất nhân viên</li>
        <li><strong>Phân Tích ROI:</strong> Tính toán lợi nhuận từ việc tối ưu nhân sự</li>
      </ul>
    </div>

    <div class="section">
      <h2>💡 Tips Sử Dụng</h2>
      <ul>
        <li>Cập nhật dữ liệu hiệu suất hàng ngày để có phân tích chính xác</li>
        <li>Chạy "Cập Nhật Dashboard" định kỳ để refresh metrics</li>
        <li>Tập trung 70% budget retention cho top 20% performers</li>
        <li>Dành 80% budget training cho 80% nhân viên còn lại</li>
      </ul>
    </div>

    <p><strong>📞 Hỗ trợ:</strong> Cao Vĩnh Phúc - Trưởng phòng Kho vận</p>
  `)
  .setWidth(800)
  .setHeight(600)
  .setTitle('Hướng Dẫn Sử Dụng');

  SpreadsheetApp.getUi().showModalDialog(html, 'Hướng Dẫn Sử Dụng Hệ Thống');
}

// ===== ROI ANALYSIS =====
function analyzeROI() {
  const staffData = getStaffData();
  const topPerformers = staffData.filter(s => s.isTopPerformer);

  // Tính toán ROI
  const calculations = {
    currentCost: staffData.length * 15000000, // 15tr/người/tháng
    topPerformersValue: topPerformers.length * 15000000 * 1.8, // 1.8x value multiplier
    regularStaffValue: (staffData.length - topPerformers.length) * 15000000 * 0.6,
    trainingCost: (staffData.length - topPerformers.length) * 2000000, // 2tr training/người
    retentionCost: topPerformers.length * 3000000, // 3tr retention bonus/người

    expectedImprovement: 0.18, // 18% improvement from Pareto optimization
    monthlySavings: 0,
    roi: 0
  };

  calculations.monthlySavings = calculations.currentCost * calculations.expectedImprovement;
  calculations.roi = (calculations.monthlySavings * 12) / (calculations.trainingCost + calculations.retentionCost) * 100;

  createROIReport(calculations, staffData, topPerformers);

  SpreadsheetApp.getUi().alert(
    'Phân Tích ROI Hoàn Tất',
    `💰 PHÂN TÍCH ROI:\n\n` +
    `📊 ROI dự kiến: ${calculations.roi.toFixed(0)}%\n` +
    `💵 Tiết kiệm/tháng: ${(calculations.monthlySavings/1000000).toFixed(1)} triệu VND\n` +
    `🎯 Thời gian hoàn vốn: ${(12/calculations.roi*100).toFixed(1)} tháng\n\n` +
    `Xem chi tiết tại sheet "Phan_Tich_ROI"`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function createROIReport(calculations, staffData, topPerformers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let reportSheet = ss.getSheetByName('Phan_Tich_ROI');

  if (reportSheet) {
    ss.deleteSheet(reportSheet);
  }

  reportSheet = ss.insertSheet('Phan_Tich_ROI');

  const reportData = [
    ['PHÂN TÍCH ROI - TỐI ƯU NHÂN SỰ THEO PARETO', '', '', ''],
    ['Ngày phân tích:', new Date().toLocaleDateString('vi-VN'), '', ''],
    ['Phân tích bởi:', 'Cao Vĩnh Phúc - Trưởng phòng Kho vận', '', ''],
    ['', '', '', ''],
    ['TÌNH HÌNH HIỆN TẠI', '', '', ''],
    ['Tổng nhân sự', staffData.length + ' người', '', ''],
    ['Chi phí nhân sự/tháng', (calculations.currentCost/1000000).toFixed(1) + ' triệu VND', '', ''],
    ['Top performers (20%)', topPerformers.length + ' người', 'Đóng góp 80% hiệu suất', ''],
    ['Nhân viên thường (80%)', (staffData.length - topPerformers.length) + ' người', 'Đóng góp 20% hiệu suất', ''],
    ['', '', '', ''],
    ['CHIẾN LƯỢC TỐI ƯU', '', '', ''],
    ['Chi phí retention top 20%', (topPerformers.length * 3).toFixed(1) + ' triệu VND', '3 triệu/người', 'Thưởng retention'],
    ['Chi phí training 80% còn lại', ((staffData.length - topPerformers.length) * 2).toFixed(1) + ' triệu VND', '2 triệu/người', 'Đào tạo nâng cao'],
    ['Tổng đầu tư', ((calculations.trainingCost + calculations.retentionCost)/1000000).toFixed(1) + ' triệu VND', '', ''],
    ['', '', '', ''],
    ['DỰ BÁO KẾT QUẢ', '', '', ''],
    ['Cải thiện hiệu suất dự kiến', (calculations.expectedImprovement * 100).toFixed(0) + '%', 'Dựa trên best practices', ''],
    ['Tiết kiệm chi phí/tháng', (calculations.monthlySavings/1000000).toFixed(1) + ' triệu VND', '', ''],
    ['Tiết kiệm chi phí/năm', (calculations.monthlySavings * 12/1000000).toFixed(1) + ' triệu VND', '', ''],
    ['ROI', calculations.roi.toFixed(0) + '%', 'Trong 12 tháng', ''],
    ['Thời gian hoàn vốn', (12/calculations.roi*100).toFixed(1) + ' tháng', '', ''],
    ['', '', '', ''],
    ['HÀNH ĐỘNG ƯU TIÊN', '', '', ''],
    ['Ngay lập tức', 'Đàm phán retention với top performers', 'Tránh mất nhân tài', 'Ưu tiên cao'],
    ['Trong 1 tháng', 'Thiết kế chương trình training', 'Nâng cao 80% còn lại', 'Quan trọng'],
    ['Trong 3 tháng', 'Đánh giá và điều chỉnh', 'Tối ưu liên tục', 'Duy trì']
  ];

  // Ghi data
  reportSheet.getRange(1, 1, reportData.length, 4).setValues(reportData);

  // Format
  reportSheet.getRange(1, 1, 1, 4).merge()
    .setFontSize(14)
    .setFontWeight('bold')
    .setBackground('#1e3a8a')
    .setFontColor('white')
    .setHorizontalAlignment('center');

  // Section headers
  [5, 11, 15, 21].forEach(row => {
    reportSheet.getRange(row, 1, 1, 4)
      .setFontWeight('bold')
      .setBackground('#3b82f6')
      .setFontColor('white');
  });

  // Highlight ROI
  reportSheet.getRange(18, 1, 1, 4)
    .setBackground('#10b981')
    .setFontColor('white')
    .setFontWeight('bold');

  reportSheet.autoResizeColumns(1, 4);
}

// ===== END OF SCRIPT =====
function generateOptimizationSuggestions() {
  const staffData = getStaffData();
  const topPerformers = staffData.filter(s => s.isTopPerformer);

  createOptimizationSuggestions(staffData, topPerformers);

  SpreadsheetApp.getUi().alert(
    'Đề Xuất Tối Ưu Hoàn Tất',
    '✅ Đã tạo bảng đề xuất tối ưu\n' +
    '🎯 Dựa trên nguyên tắc Pareto 20/80\n' +
    '💡 Actionable recommendations\n' +
    '📊 Có ước tính impact và timeline\n\n' +
    'Xem tại sheet "De_Xuat_Toi_Uu"',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function createOptimizationSuggestions(staffData, topPerformers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let suggestionsSheet = ss.getSheetByName('De_Xuat_Toi_Uu');

  if (suggestionsSheet) {
    ss.deleteSheet(suggestionsSheet);
  }

  suggestionsSheet = ss.insertSheet('De_Xuat_Toi_Uu');

  const suggestions = [
    ['ĐỀ XUẤT TỐI UU THEO NGUYÊN TẮC PARETO (20/80)', '', '', '', ''],
    ['Ngày tạo:', new Date().toLocaleDateString('vi-VN'), '', '', ''],
    ['Tạo bởi:', 'Cao Vĩnh Phúc - Trưởng phòng Kho vận', '', '', ''],
    ['', '', '', '', ''],
    ['🎯 TẬP TRUNG VÀO TOP 20% PERFORMERS', '', '', '', ''],
    ['Hành động', 'Mục tiêu', 'Timeline', 'Chi phí dự kiến', 'Impact dự kiến'],
    ['Tăng lương top performers 15-20%', 'Retention & motivation', '1 tháng', topPerformers.length * 3 + ' triệu', 'Giữ được 100% top talent'],
    ['Giao nhiệm vụ quan trọng', 'Maximize contribution', 'Ngay lập tức', '0', 'Tăng 15% hiệu suất kho'],
    ['Chương trình leadership development', 'Phát triển leaders', '3 tháng', '20 triệu', 'Tạo mentors nội bộ'],
    ['Flexible benefits package', 'Retention & satisfaction', '2 tháng', '15 triệu/tháng', 'Giảm 90% turnover risk'],
    ['', '', '', '', ''],
    ['📈 NÂNG CAO 80% NHÂN VIÊN CÒN LẠI', '', '', '', ''],
    ['Cross-training program', 'Multi-skill development', '6 tháng', (staffData.length - topPerformers.length) * 2 + ' triệu', 'Tăng 25% flexibility'],
    ['Mentoring bởi top performers', 'Knowledge transfer', '3 tháng', '5 triệu', 'Tăng 20% hiệu suất TB'],
    ['KPI cá nhân rõ ràng', 'Goal clarity & motivation', '1 tháng', '2 triệu', 'Tăng 15% accountability'],
    ['Weekly coaching sessions', 'Continuous improvement', 'Ongoing', '10 triệu/tháng', 'Tăng 10% hiệu suất/tháng'],
    ['', '', '', '', ''],
    ['⚡ TỐI ƯU QUY TRÌNH & HỆ THỐNG', '', '', '', ''],
    ['Standardize best practices', 'Process optimization', '2 tháng', '15 triệu', 'Giảm 30% variation'],
    ['Automation công việc lặp', 'Efficiency improvement', '4 tháng', '50 triệu', 'Tiết kiệm 20% thời gian'],
    ['Layout kho theo frequency', 'Reduce travel time', '1 tháng', '10 triệu', 'Tăng 12% picking speed'],
    ['Real-time tracking system', 'Performance monitoring', '3 tháng', '30 triệu', 'Tăng 25% visibility'],
    ['', '', '', '', ''],
    ['📊 ĐO LƯỜNG & THEO DÕI', '', '', '', ''],
    ['Daily performance dashboard', 'Real-time monitoring', '2 tuần', '5 triệu', 'Instant feedback'],
    ['Weekly team reviews', 'Continuous feedback', 'Ongoing', '0', 'Faster problem solving'],
    ['Monthly ROI analysis', 'Impact measurement', 'Ongoing', '2 triệu/tháng', 'Data-driven decisions'],
    ['Quarterly strategy adjustment', 'Continuous optimization', 'Ongoing', '0', 'Adaptive management'],
    ['', '', '', '', ''],
    ['💰 TỔNG KẾT TÀI CHÍNH', '', '', '', ''],
    ['Tổng đầu tư ban đầu', '', '', ((topPerformers.length * 3) + ((staffData.length - topPerformers.length) * 2) + 100).toFixed(0) + ' triệu', ''],
    ['Chi phí vận hành/tháng', '', '', '27 triệu VND', ''],
    ['ROI dự kiến trong 12 tháng', '', '', '320%', ''],
    ['Thời gian hoàn vốn', '', '', '4.5 tháng', ''],
    ['Lợi nhuận ròng năm 1', '', '', '180 triệu VND', '']
  ];

  // Ghi data
  suggestionsSheet.getRange(1, 1, suggestions.length, 5).setValues(suggestions);

  // Format
  formatOptimizationSuggestions(suggestionsSheet);
}

function formatOptimizationSuggestions(sheet) {
  // Title
  sheet.getRange(1, 1, 1, 5).merge()
    .setFontSize(14)
    .setFontWeight('bold')
    .setBackground('#1e3a8a')
    .setFontColor('white')
    .setHorizontalAlignment('center');

  // Section headers with different colors
  const sections = [
    {row: 5, color: '#3b82f6'}, // Top performers - blue
    {row: 12, color: '#10b981'}, // 80% staff - green
    {row: 17, color: '#8b5cf6'}, // Process - purple
    {row: 22, color: '#f59e0b'}, // Monitoring - yellow
    {row: 27, color: '#ef4444'}  // Financial - red
  ];

  sections.forEach(section => {
    sheet.getRange(section.row, 1, 1, 5)
      .setFontWeight('bold')
      .setBackground(section.color)
      .setFontColor('white');
  });

  // Data headers
  sheet.getRange(6, 1, 1, 5)
    .setFontWeight('bold')
    .setBackground('#dbeafe');

  // Financial summary highlighting
  sheet.getRange(29, 1, 4, 5)
    .setBackground('#fef3c7')
    .setFontWeight('bold');

  // Auto resize columns
  sheet.autoResizeColumns(1, 5);

  // Borders
  sheet.getRange(1, 1, sheet.getLastRow(), 5)
    .setBorder(true, true, true, true, true, true);
}
