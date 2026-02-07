import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Container, Paper, Tab, Tabs, Typography } from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Computer as ComputerIcon,
  Api as ApiIcon,
  BugReport as BugReportIcon,
  IntegrationInstructions as IntegrationIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';

// Import settings components
import GeneralSettings from './GeneralSettings';
import SecuritySettings from './SecuritySettings';
import SystemSettings from './SystemSettings';
import ApiIntegration from './ApiIntegration';
import ApiDiagnostics from './ApiDiagnostics';
import ApiIntegrationManager from './ApiIntegrationManager';
import GoogleApiStatusContent from './GoogleApiStatusContent';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>
  );
}

const TAB_KEYS = ['general', 'security', 'system', 'google', 'api', 'api-manager', 'diagnostics'];

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tabIndexFromUrl = TAB_KEYS.indexOf(tabParam);
  const initialIndex = tabIndexFromUrl >= 0 ? tabIndexFromUrl : 0;
  const [activeTab, setActiveTab] = useState(initialIndex);

  useEffect(() => {
    if (tabIndexFromUrl >= 0) setActiveTab(tabIndexFromUrl);
  }, [tabIndexFromUrl]);

  const handleTabChange = (e, newValue) => {
    setActiveTab(newValue);
    setSearchParams({ tab: TAB_KEYS[newValue] });
  };

  const tabs = [
    {
      label: 'Cài đặt chung',
      icon: <SettingsIcon />,
      component: <GeneralSettings />,
    },
    {
      label: 'Bảo mật',
      icon: <SecurityIcon />,
      component: <SecuritySettings />,
    },
    {
      label: 'Hệ thống',
      icon: <ComputerIcon />,
      component: <SystemSettings />,
    },
    {
      label: 'Google API',
      icon: <GoogleIcon />,
      component: (
        <Box>
          <GoogleApiStatusContent />
        </Box>
      ),
    },
    {
      label: 'Tích hợp API',
      icon: <ApiIcon />,
      component: <ApiIntegration />,
    },
    {
      label: 'Quản lý API',
      icon: <IntegrationIcon />,
      component: <ApiIntegrationManager />,
    },
    {
      label: 'Chẩn đoán',
      icon: <BugReportIcon />,
      component: <ApiDiagnostics />,
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
            Cài đặt hệ thống
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý cấu hình và thiết lập cho hệ thống MIA Logistics Manager
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minHeight: 72,
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
                sx={{
                  '& .MuiTab-iconWrapper': {
                    marginRight: 1,
                  },
                }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Paper sx={{ p: 3 }}>
          {tabs.map((tab, index) => (
            <TabPanel key={index} value={activeTab} index={index}>
              {tab.component}
            </TabPanel>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};

export default Settings;
