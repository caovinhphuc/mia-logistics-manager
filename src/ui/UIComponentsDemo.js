import { Add, Delete, Edit } from '@mui/icons-material';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { useState } from 'react';

// Import UI components
import { ActionButton, ActionIcons, DataTable, GridView, Icon, ViewIcons } from '../ui';

const UIComponentsDemo = () => {
  const [viewMode, setViewMode] = useState('table');

  // Sample data for demonstration
  const sampleData = [
    {
      id: 1,
      name: 'Sản phẩm A',
      status: 'active',
      category: 'Electronics',
      price: '1,000,000 VND',
    },
    {
      id: 2,
      name: 'Sản phẩm B',
      status: 'inactive',
      category: 'Clothing',
      price: '500,000 VND',
    },
    {
      id: 3,
      name: 'Sản phẩm C',
      status: 'active',
      category: 'Books',
      price: '200,000 VND',
    },
  ];

  const columns = [
    { key: 'name', label: 'Tên sản phẩm' },
    { key: 'category', label: 'Danh mục' },
    { key: 'price', label: 'Giá' },
    { key: 'status', label: 'Trạng thái' },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        UI Components Demo
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Showcase các UI components được tạo mới
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Action Buttons */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Action Buttons
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <ActionButton
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => {
                  /* Add action */
                }}
              >
                Thêm mới
              </ActionButton>

              <ActionButton
                variant="outlined"
                color="secondary"
                startIcon={<Edit />}
                onClick={() => {
                  /* Edit action */
                }}
              >
                Chỉnh sửa
              </ActionButton>

              <ActionButton
                variant="text"
                color="error"
                startIcon={<Delete />}
                onClick={() => {
                  /* Delete action */
                }}
              >
                Xóa
              </ActionButton>

              <ActionButton
                variant="contained"
                color="success"
                size="small"
                onClick={() => {
                  /* Success action */
                }}
              >
                Thành công
              </ActionButton>
            </Box>
          </Paper>
        </Grid>

        {/* Action Icons */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Action Icons
            </Typography>
            <ActionIcons
              onEdit={() => logger.debug('Edit action')}
              onDelete={() => logger.debug('Delete action')}
              onView={() => logger.debug('View action')}
            />
          </Paper>
        </Grid>

        {/* View Icons */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              View Toggle Icons
            </Typography>
            <ViewIcons currentView={viewMode} onViewChange={setViewMode} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Current view: {viewMode}
            </Typography>
          </Paper>
        </Grid>

        {/* Custom Icons */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Custom Icons
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Icon name="edit" color="primary" />
              <Icon name="delete" color="error" />
              <Icon name="visibility" color="success" />
              <Icon name="add" color="secondary" />
            </Box>
          </Paper>
        </Grid>

        {/* Data Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Data Table Component
            </Typography>
            <DataTable
              columns={columns}
              data={sampleData}
              onEdit={(row) => logger.debug('Edit row:', row)}
              onDelete={(row) => logger.debug('Delete row:', row)}
              onRowClick={(row) => logger.debug('Row clicked:', row)}
            />
          </Paper>
        </Grid>

        {/* Grid View */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Grid View Component
            </Typography>
            <GridView
              data={sampleData}
              onEdit={(item) => logger.debug('Edit item:', item)}
              onDelete={(item) => logger.debug('Delete item:', item)}
              onView={(item) => logger.debug('View item:', item)}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UIComponentsDemo;
