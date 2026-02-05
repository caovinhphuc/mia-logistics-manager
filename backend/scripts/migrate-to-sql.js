// backend/scripts/migrate-to-sql.js
const migrateSheet = async (sheetName, tableName) => {
  const rows = await sheetsService.getRows(sheetName);
  await sqlService.bulkInsert(tableName, rows);
};
  for (const [sheetName, tableName] of Object.entries(sheetTableMap)) {
    await migrateSheet(sheetName, tableName);
  }
};

// src/services/user/permissionService.js
roleId,
        permissionId,
      });
      throw error;
    }
  }

  /**
   * Assign permission to role
   */
  async assignPermissionToRole(roleId, permissionId) {
    try {
      logService.debug('PermissionService', 'Assigning permission to role', {
        roleId,
        permissionId,
      });

      const exists = await this.checkPermissionForRole(roleId, permissionId);
      if (exists) {
        logService.info('PermissionService', 'Permission already assigned to role', {
          roleId,
          permissionId,
        });
        return true;
      }

      await db.query('INSERT INTO RolePermissions (roleId, permissionId) VALUES (?, ?)', {
        replacements: [roleId, permissionId],
      });

      return true;
    } catch (error) {
      logService.error('PermissionService', 'Failed to assign permission to role', {
        error,
        roleId,
        permissionId,
      });
      throw error;
    }
  }