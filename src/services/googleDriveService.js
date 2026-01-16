import { googleAuthService } from './googleAuthService';
import { logService } from './logService';

const driveLogger = {
  debug: (message, data) => logService.debug('GoogleDriveService', message, data),
  info: (message, data) => logService.info('GoogleDriveService', message, data),
  warn: (message, data) => logService.warn('GoogleDriveService', message, data),
  error: (message, error, data = {}) =>
    logService.error('GoogleDriveService', message, {
      ...data,
      error:
        error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
    }),
};

class GoogleDriveService {
  constructor() {
    this.isConnected = false;
    this.folderId = null;
    this.apiUrl = 'https://www.googleapis.com/drive/v3';
    this.uploadUrl = 'https://www.googleapis.com/upload/drive/v3';
  }

  async initialize() {
    try {
      driveLogger.debug('Initializing Google Drive Service');
      // Service will be connected when folder ID is provided
    } catch (error) {
      driveLogger.error('Google Drive initialization failed', error);
      throw error;
    }
  }

  async connect(folderId) {
    try {
      this.folderId = folderId;

      // Test connection by getting folder info
      const folderInfo = await this.getFolderInfo(folderId);

      this.isConnected = true;
      driveLogger.info('Connected to Drive folder', { folderName: folderInfo.name, folderId });

      return folderInfo;
    } catch (error) {
      driveLogger.error('Failed to connect to Google Drive', error, { folderId });
      throw error;
    }
  }

  async disconnect() {
    this.isConnected = false;
    this.folderId = null;
  }

  async getFolderInfo(folderId) {
    try {
      const headers = await googleAuthService.getAuthHeaders();

      const response = await fetch(`${this.apiUrl}/files/${folderId}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to get folder info: ${response.statusText}`);
      }

      const result = await response.json();
      driveLogger.debug('Fetched folder info', { folderId, name: result?.name });
      return result;
    } catch (error) {
      driveLogger.error('Failed to get folder info', error, { folderId });
      throw error;
    }
  }

  async uploadFile(file, folderId = null, options = {}) {
    try {
      const targetFolderId = folderId || this.folderId;
      if (!targetFolderId) {
        throw new Error('No folder ID specified');
      }

      const headers = await googleAuthService.getAuthHeaders();

      // Create file metadata
      const metadata = {
        name: options.name || file.name,
        parents: [targetFolderId],
        description: options.description || '',
        ...options.metadata,
      };

      const result =
        file.size > 5 * 1024 * 1024
          ? await this.resumableUpload(file, metadata, headers)
          : await this.simpleUpload(file, metadata, headers);
      driveLogger.info('File uploaded successfully', {
        fileName: metadata.name,
        folderId: targetFolderId,
      });
      return result;
    } catch (error) {
      driveLogger.error('Failed to upload file', error, {
        fileName: file?.name,
        folderId,
      });
      throw error;
    }
  }

  async simpleUpload(file, metadata, headers) {
    const formData = new FormData();
    formData.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], {
        type: 'application/json',
      })
    );
    formData.append('file', file);

    const response = await fetch(`${this.uploadUrl}/files?uploadType=multipart`, {
      method: 'POST',
      headers: {
        Authorization: headers.Authorization,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    driveLogger.debug('Simple upload completed', { fileName: metadata.name });
    return result;
  }

  async resumableUpload(file, metadata, headers) {
    // Initiate resumable upload
    const initResponse = await fetch(`${this.uploadUrl}/files?uploadType=resumable`, {
      method: 'POST',
      headers: {
        ...headers,
        'X-Upload-Content-Type': file.type,
        'X-Upload-Content-Length': file.size.toString(),
      },
      body: JSON.stringify(metadata),
    });

    if (!initResponse.ok) {
      throw new Error(`Upload initiation failed: ${initResponse.statusText}`);
    }

    const uploadUrl = initResponse.headers.get('Location');

    // Upload file content
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`File upload failed: ${uploadResponse.statusText}`);
    }

    const result = await uploadResponse.json();
    driveLogger.debug('Resumable upload completed', { fileName: metadata.name });
    return result;
  }

  async downloadFile(fileId) {
    try {
      const headers = await googleAuthService.getAuthHeaders();

      const response = await fetch(`${this.apiUrl}/files/${fileId}?alt=media`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      driveLogger.error('Failed to download file', error, { fileId });
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      const headers = await googleAuthService.getAuthHeaders();

      const response = await fetch(`${this.apiUrl}/files/${fileId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      driveLogger.error('Failed to delete file', error, { fileId });
      throw error;
    }
  }

  async listFiles(folderId = null, options = {}) {
    try {
      const targetFolderId = folderId || this.folderId;
      const headers = await googleAuthService.getAuthHeaders();

      const params = new URLSearchParams({
        q: `'${targetFolderId}' in parents and trashed=false`,
        fields: 'files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink,thumbnailLink)',
        orderBy: options.orderBy || 'modifiedTime desc',
        pageSize: options.pageSize || '100',
        ...options.params,
      });

      const response = await fetch(`${this.apiUrl}/files?${params}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`List files failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to list files:', error);
      throw error;
    }
  }

  async searchFiles(query, options = {}) {
    try {
      const headers = await googleAuthService.getAuthHeaders();

      const params = new URLSearchParams({
        q: query,
        fields: 'files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink,thumbnailLink)',
        orderBy: options.orderBy || 'modifiedTime desc',
        pageSize: options.pageSize || '50',
        ...options.params,
      });

      const response = await fetch(`${this.apiUrl}/files?${params}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to search files:', error);
      throw error;
    }
  }

  async createFolder(name, parentFolderId = null) {
    try {
      const headers = await googleAuthService.getAuthHeaders();
      const targetParent = parentFolderId || this.folderId;

      const metadata = {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [targetParent],
      };

      const response = await fetch(`${this.apiUrl}/files`, {
        method: 'POST',
        headers,
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error(`Folder creation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create folder:', error);
      throw error;
    }
  }

  async moveFile(fileId, newParentId) {
    try {
      const headers = await googleAuthService.getAuthHeaders();

      // Get current parents
      const fileInfo = await fetch(`${this.apiUrl}/files/${fileId}?fields=parents`, {
        headers,
      });

      if (!fileInfo.ok) {
        throw new Error('Failed to get file info');
      }

      const { parents } = await fileInfo.json();
      const previousParents = parents.join(',');

      // Move file
      const response = await fetch(
        `${this.apiUrl}/files/${fileId}?addParents=${newParentId}&removeParents=${previousParents}`,
        {
          method: 'PATCH',
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Move failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to move file:', error);
      throw error;
    }
  }

  async getQuota() {
    try {
      const headers = await googleAuthService.getAuthHeaders();

      const response = await fetch(`${this.apiUrl}/about?fields=storageQuota`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Get quota failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get quota:', error);
      throw error;
    }
  }

  async shareFile(fileId, email, role = 'reader') {
    try {
      const headers = await googleAuthService.getAuthHeaders();

      const permission = {
        type: 'user',
        role,
        emailAddress: email,
      };

      const response = await fetch(`${this.apiUrl}/files/${fileId}/permissions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(permission),
      });

      if (!response.ok) {
        throw new Error(`Share failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to share file:', error);
      throw error;
    }
  }

  async syncFiles() {
    try {
      // Sync logic - could include checking for new files, updates, etc.
      const files = await this.listFiles();
      return {
        success: true,
        fileCount: files.files?.length || 0,
        lastSync: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to sync files:', error);
      throw error;
    }
  }

  // Utility methods for MIA Logistics specific use cases
  async uploadTransportDocument(file, transportId) {
    const folderName = `Transport_${transportId}`;

    // Create transport-specific folder if it doesn't exist
    let transportFolder = await this.searchFiles(
      `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`
    );

    if (!transportFolder.files || transportFolder.files.length === 0) {
      transportFolder = await this.createFolder(folderName);
      return await this.uploadFile(file, transportFolder.id);
    } else {
      return await this.uploadFile(file, transportFolder.files[0].id);
    }
  }

  async uploadWarehouseImage(file, itemCode) {
    const folderName = 'Warehouse_Images';

    // Create warehouse images folder if it doesn't exist
    let imagesFolder = await this.searchFiles(
      `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`
    );

    if (!imagesFolder.files || imagesFolder.files.length === 0) {
      imagesFolder = await this.createFolder(folderName);
    }

    return await this.uploadFile(file, imagesFolder.files[0].id, {
      name: `${itemCode}_${Date.now()}.${file.name.split('.').pop()}`,
      description: `Image for warehouse item: ${itemCode}`,
    });
  }
}

export const googleDriveService = new GoogleDriveService();
