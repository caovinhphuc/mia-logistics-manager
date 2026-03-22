function initAuthSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var users = ensureSheet(ss, 'Users');
  var roles = ensureSheet(ss, 'Roles');
  var perms = ensureSheet(ss, 'RolePermissions');

  setHeader(users, ['id','email','passwordHash','fullName','roleId','status','createdAt','updatedAt']);
  setHeader(roles, ['id','name','description']);
  setHeader(perms, ['roleId','resource','action']);

  if (users.getLastRow() < 2) {
    var now = new Date();
    roles.appendRow(['admin','Admin','Super admin']);
    // passwordHash nên tạo ở server bằng bcrypt; tạm để trống để server seed khi cần
    users.appendRow(['u-admin','admin@mia.vn','', 'Administrator','admin','active', now, now]);
    var resources = ['orders','carriers','locations','transfers','transportRequests','settings'];
    for (var i=0;i<resources.length;i++) {
      var r = resources[i];
      perms.appendRow(['admin', r, 'view']);
      perms.appendRow(['admin', r, 'create']);
      perms.appendRow(['admin', r, 'update']);
      perms.appendRow(['admin', r, 'delete']);
    }
  }
}

function ensureSheet(ss, name) {
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

function setHeader(sheet, headers) {
  var range = sheet.getRange(1,1,1,headers.length);
  range.setValues([headers]);
  range.setFontWeight('bold');
}

