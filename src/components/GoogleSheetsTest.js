import { useEffect, useState } from "react";
import { googleSheetsService } from "../services/googleSheetsService";
import "./GoogleSheetsTest.css";

const GoogleSheetsTest = () => {
  const [sheetData, setSheetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sheetName, setSheetName] = useState("Orders");
  const [range, setRange] = useState("A1:Z100");
  const [newData, setNewData] = useState("");
  const [spreadsheetInfo, setSpreadsheetInfo] = useState(null);

  // Đọc dữ liệu từ sheet
  const handleReadSheet = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await googleSheetsService.readSheet(sheetName, range);
      setSheetData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ghi dữ liệu vào sheet
  const handleWriteSheet = async () => {
    if (!newData.trim()) {
      setError("Please enter data to write");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Parse CSV data
      const rows = googleSheetsService.parseCSVData(newData);
      const result = await googleSheetsService.writeSheet(
        sheetName,
        "A1",
        rows,
      );
      console.log("Write result:", result);

      // Refresh data
      await handleReadSheet();
      setNewData("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Thêm dữ liệu vào cuối sheet
  const handleAppendSheet = async () => {
    if (!newData.trim()) {
      setError("Please enter data to append");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const rows = googleSheetsService.parseCSVData(newData);
      const result = await googleSheetsService.appendSheet(sheetName, rows);
      console.log("Append result:", result);

      // Refresh data
      await handleReadSheet();
      setNewData("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Tạo sheet mới
  const handleCreateSheet = async () => {
    const newSheetName = prompt("Enter new sheet name:");
    if (!newSheetName) return;

    setLoading(true);
    setError(null);
    try {
      const result = await googleSheetsService.createSheet(newSheetName);
      console.log("Create sheet result:", result);
      await getSpreadsheetInfo();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Lấy thông tin spreadsheet
  const getSpreadsheetInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await googleSheetsService.getSpreadsheetInfo();
      setSpreadsheetInfo(info);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load spreadsheet info khi component mount
  useEffect(() => {
    getSpreadsheetInfo();
  }, []);

  // Render data table
  const renderDataTable = () => {
    if (!sheetData || !sheetData.values) return null;

    const headers = sheetData.values[0] || [];
    const rows = sheetData.values.slice(1);

    return (
      <div className="data-table">
        <div className="table-header">
          <h3>📊 Sheet Data: {sheetName}</h3>
          <div className="table-stats">
            <span className="stat">
              <strong>{rows.length}</strong> rows
            </span>
            <span className="stat">
              <strong>{headers.length}</strong> columns
            </span>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header || `Col ${index + 1}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((_, cellIndex) => (
                    <td key={cellIndex}>{row[cellIndex] || ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="google-sheets-test">
      <div className="header">
        <h2>📊 Google Sheets Integration</h2>
        <p>Test reading, writing, and managing Google Sheets data</p>
      </div>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Left Panel - Controls & Info */}
        <div className="left-panel">
          {/* Spreadsheet Info */}
          {spreadsheetInfo && (
            <div className="info-panel">
              <h3>📋 Spreadsheet Info</h3>
              <div className="info-content">
                <div className="info-item">
                  <span className="info-label">Title:</span>
                  <span className="info-value">
                    {spreadsheetInfo.properties?.title}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Sheets:</span>
                  <span className="info-value">
                    {spreadsheetInfo.sheets
                      ?.map((s) => s.properties.title)
                      .join(", ") || "None"}
                  </span>
                </div>
              </div>
              <button
                onClick={getSpreadsheetInfo}
                disabled={loading}
                className="refresh-btn"
              >
                🔄 Refresh Info
              </button>
            </div>
          )}

          {/* Controls */}
          <div className="controls">
            <h3>⚙️ Configuration</h3>
            <div className="control-group">
              <label>Sheet Name:</label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="e.g., Orders"
              />
            </div>

            <div className="control-group">
              <label>Range:</label>
              <input
                type="text"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="e.g., A1:Z100"
              />
            </div>

            <div className="action-buttons">
              <button
                onClick={handleReadSheet}
                disabled={loading}
                className="read-btn"
              >
                📖 Read Sheet
              </button>
              <button
                onClick={handleCreateSheet}
                disabled={loading}
                className="create-btn"
              >
                ➕ Create Sheet
              </button>
            </div>
          </div>

          {/* Data Input */}
          <div className="data-input">
            <h3>📝 Add Data</h3>
            <textarea
              value={newData}
              onChange={(e) => setNewData(e.target.value)}
              placeholder="Enter CSV data (comma-separated values, one row per line)"
              rows="4"
            />
            <div className="input-buttons">
              <button
                onClick={handleWriteSheet}
                disabled={loading || !newData.trim()}
                className="write-btn"
              >
                ✏️ Write Data
              </button>
              <button
                onClick={handleAppendSheet}
                disabled={loading || !newData.trim()}
                className="append-btn"
              >
                ➕ Append Data
              </button>
            </div>
            <div className="sample-data">
              <strong>💡 Sample Format:</strong>
              <div className="sample-code">
                <code>date,product,quantity,total</code>
                <br />
                <code>2024-01-01,Laptop,1,15000000</code>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Data Display */}
        <div className="right-panel">
          {/* Loading */}
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Processing...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="error">
              <div className="error-icon">❌</div>
              <div className="error-content">
                <h3>Error occurred</h3>
                <p>{error}</p>
                <button onClick={() => setError(null)} className="dismiss-btn">
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Data Display */}
          {renderDataTable()}

          {/* Empty State */}
          {!loading && !error && !sheetData && (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No data loaded</h3>
              <p>Click "Read Sheet" to load data from your Google Sheet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleSheetsTest;
