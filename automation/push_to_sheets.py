import json, glob
import gspread
from google.oauth2.service_account import Credentials

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
creds = Credentials.from_service_account_file('config/service_account.json', scopes=SCOPES)
gc = gspread.authorize(creds)

SHEET_ID = '17xjOqmZFMYT_Tt78_BARbwMYhDEyGcODNwxYbxNSWG8'
sh = gc.open_by_key(SHEET_ID)

# Load all march data
all_orders = []
for f in sorted(glob.glob('data/march_2026_enhanced_page_*.json')):
    with open(f) as fp:
        d = json.load(fp)
        all_orders.extend(d['orders'])

print(f"📊 Total orders: {len(all_orders)}")

# Map columns
headers = ['ID','Mã đơn','Kênh','Trạng thái','Đóng gói','Giao hàng','Thu tiền','Vận chuyển','Giá trị','Kho','Nhân viên','Ngày tạo']
rows = [headers]
for o in all_orders:
    rows.append([
        o.get('col_2',''), o.get('col_3',''), o.get('col_5',''),
        o.get('col_7',''), o.get('col_9',''), o.get('col_10',''),
        o.get('col_11',''), o.get('col_13',''), o.get('col_16',''),
        o.get('col_21',''), o.get('col_22',''), o.get('col_20','')
    ])

# Write to sheet
try:
    ws = sh.worksheet('Orders_March_2026')
except:
    ws = sh.add_worksheet('Orders_March_2026', rows=25000, cols=20)

ws.clear()
ws.update('A1', rows)
print(f"✅ Pushed {len(rows)-1} orders to Google Sheets!")
