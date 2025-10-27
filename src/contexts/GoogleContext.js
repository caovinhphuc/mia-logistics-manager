import { createContext, useContext, useEffect, useReducer } from "react";
import { googleAppsScriptService } from "../services/googleAppsScriptService";
import { googleDriveService } from "../services/googleDriveService";
import { googleSheetsService } from "../services/googleSheetsService";

// Google state structure
const initialState = {
  isInitialized: false,
  isConnected: false,
  loading: false,
  error: null,
  sheets: {
    connected: false,
    spreadsheetId: null,
    lastSync: null,
  },
  drive: {
    connected: false,
    folderId: null,
    quota: null,
  },
  appsScript: {
    connected: false,
    scriptId: null,
    functions: [],
  },
};

// Google actions
const GOOGLE_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  INITIALIZE_SUCCESS: "INITIALIZE_SUCCESS",
  CONNECT_SHEETS: "CONNECT_SHEETS",
  CONNECT_DRIVE: "CONNECT_DRIVE",
  CONNECT_APPS_SCRIPT: "CONNECT_APPS_SCRIPT",
  DISCONNECT: "DISCONNECT",
  UPDATE_SYNC: "UPDATE_SYNC",
};

// Google reducer
const googleReducer = (state, action) => {
  switch (action.type) {
    case GOOGLE_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case GOOGLE_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case GOOGLE_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case GOOGLE_ACTIONS.INITIALIZE_SUCCESS:
      return {
        ...state,
        isInitialized: true,
        isConnected: true,
        loading: false,
        error: null,
      };

    case GOOGLE_ACTIONS.CONNECT_SHEETS:
      return {
        ...state,
        sheets: {
          ...state.sheets,
          connected: true,
          spreadsheetId: action.payload.spreadsheetId,
          lastSync: action.payload.lastSync,
        },
      };

    case GOOGLE_ACTIONS.CONNECT_DRIVE:
      return {
        ...state,
        drive: {
          ...state.drive,
          connected: true,
          folderId: action.payload.folderId,
          quota: action.payload.quota,
        },
      };

    case GOOGLE_ACTIONS.CONNECT_APPS_SCRIPT:
      return {
        ...state,
        appsScript: {
          ...state.appsScript,
          connected: true,
          scriptId: action.payload.scriptId,
          functions: action.payload.functions || [],
        },
      };

    case GOOGLE_ACTIONS.DISCONNECT:
      return {
        ...initialState,
      };

    case GOOGLE_ACTIONS.UPDATE_SYNC:
      return {
        ...state,
        sheets: {
          ...state.sheets,
          lastSync: action.payload,
        },
      };

    default:
      return state;
  }
};

// Create context
const GoogleContext = createContext();

// Google provider component
export const GoogleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(googleReducer, initialState);

  // Initialize Google services on mount
  useEffect(() => {
    initializeGoogleServices();
  }, []);

  const initializeGoogleServices = async () => {
    try {
      dispatch({ type: GOOGLE_ACTIONS.SET_LOADING, payload: true });

      // Initialize Google APIs
      await Promise.all([
        googleSheetsService.initialize(),
        googleDriveService.initialize(),
        googleAppsScriptService.initialize(),
      ]);

      dispatch({ type: GOOGLE_ACTIONS.INITIALIZE_SUCCESS });

      // Auto-connect if credentials are available
      await autoConnect();
    } catch (error) {
      console.error("Google services initialization error:", error);
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const autoConnect = async () => {
    try {
      // Temporarily disable Google Sheets connection
      // const spreadsheetId = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID;
      // if (spreadsheetId) {
      //   await connectSheets(spreadsheetId);
      // }
      // Try to connect to existing drive folder
      // Temporarily disable Google Drive connection
      // const folderId = process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID;
      // if (folderId) {
      //   await connectDrive(folderId);
      // }
      // Try to connect to Apps Script - temporarily disabled
      // const scriptId = process.env.REACT_APP_GOOGLE_APPS_SCRIPT_ID;
      // if (scriptId) {
      //   await connectAppsScript(scriptId);
      // }
    } catch (error) {
      console.warn("Auto-connect failed:", error.message);
    }
  };

  const connectSheets = async (spreadsheetId) => {
    try {
      dispatch({ type: GOOGLE_ACTIONS.SET_LOADING, payload: true });

      const result = await googleSheetsService.connect(spreadsheetId);

      dispatch({
        type: GOOGLE_ACTIONS.CONNECT_SHEETS,
        payload: {
          spreadsheetId,
          lastSync: new Date().toISOString(),
        },
      });

      return result;
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const connectDrive = async (folderId) => {
    try {
      dispatch({ type: GOOGLE_ACTIONS.SET_LOADING, payload: true });

      const result = await googleDriveService.connect(folderId);
      const quota = await googleDriveService.getQuota();

      dispatch({
        type: GOOGLE_ACTIONS.CONNECT_DRIVE,
        payload: {
          folderId,
          quota,
        },
      });

      return result;
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const connectAppsScript = async (scriptId) => {
    try {
      // Temporarily disable Apps Script connection to avoid errors
      console.log("🔧 Google Apps Script connection disabled for now");
      return { success: false, message: "Apps Script disabled" };
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await Promise.all([
        googleSheetsService.disconnect(),
        googleDriveService.disconnect(),
        googleAppsScriptService.disconnect(),
      ]);

      dispatch({ type: GOOGLE_ACTIONS.DISCONNECT });
    } catch (error) {
      console.error("Disconnect error:", error);
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Sheets operations
  const getSheetsData = async (sheetName, range) => {
    try {
      return await googleSheetsService.getValues(sheetName, range);
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateSheetsData = async (sheetName, range, values) => {
    try {
      const result = await googleSheetsService.updateValues(
        sheetName,
        range,
        values,
      );
      dispatch({
        type: GOOGLE_ACTIONS.UPDATE_SYNC,
        payload: new Date().toISOString(),
      });
      return result;
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const appendSheetsData = async (sheetName, values) => {
    try {
      const result = await googleSheetsService.appendValues(sheetName, values);
      dispatch({
        type: GOOGLE_ACTIONS.UPDATE_SYNC,
        payload: new Date().toISOString(),
      });
      return result;
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Drive operations
  const uploadFile = async (file, folderId = null) => {
    try {
      return await googleDriveService.uploadFile(
        file,
        folderId || state.drive.folderId,
      );
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const downloadFile = async (fileId) => {
    try {
      return await googleDriveService.downloadFile(fileId);
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const deleteFile = async (fileId) => {
    try {
      return await googleDriveService.deleteFile(fileId);
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const listFiles = async (folderId = null) => {
    try {
      return await googleDriveService.listFiles(
        folderId || state.drive.folderId,
      );
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Apps Script operations
  const runScript = async (functionName, parameters = []) => {
    try {
      return await googleAppsScriptService.runFunction(
        functionName,
        parameters,
      );
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const calculateDistance = async (origin, destination) => {
    try {
      return await runScript("calculateDistance", [origin, destination]);
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const optimizeRoute = async (waypoints) => {
    try {
      return await runScript("optimizeRoute", [waypoints]);
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const geocodeAddress = async (address) => {
    try {
      return await runScript("geocodeAddress", [address]);
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Sync operations
  const syncAllData = async () => {
    try {
      dispatch({ type: GOOGLE_ACTIONS.SET_LOADING, payload: true });

      const results = await Promise.allSettled([
        googleSheetsService.syncData(),
        googleDriveService.syncFiles(),
      ]);

      dispatch({
        type: GOOGLE_ACTIONS.UPDATE_SYNC,
        payload: new Date().toISOString(),
      });
      dispatch({ type: GOOGLE_ACTIONS.SET_LOADING, payload: false });

      return results;
    } catch (error) {
      dispatch({ type: GOOGLE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const contextValue = {
    // State
    ...state,

    // Connection methods
    connectSheets,
    connectDrive,
    connectAppsScript,
    disconnect,

    // Sheets operations
    getSheetsData,
    updateSheetsData,
    appendSheetsData,

    // Drive operations
    uploadFile,
    downloadFile,
    deleteFile,
    listFiles,

    // Apps Script operations
    runScript,
    calculateDistance,
    optimizeRoute,
    geocodeAddress,

    // Sync operations
    syncAllData,

    // Utilities
    clearError: () => dispatch({ type: GOOGLE_ACTIONS.CLEAR_ERROR }),
    reinitialize: initializeGoogleServices,
  };

  return (
    <GoogleContext.Provider value={contextValue}>
      {children}
    </GoogleContext.Provider>
  );
};

// Custom hook to use Google context
export const useGoogle = () => {
  const context = useContext(GoogleContext);
  if (!context) {
    throw new Error("useGoogle must be used within a GoogleProvider");
  }
  return context;
};

export default GoogleContext;
