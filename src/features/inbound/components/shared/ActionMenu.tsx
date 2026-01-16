import React from 'react';
import { IconButton, Menu } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

interface Action {
  label: string;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'error';
}

interface ActionMenuProps {
  item?: unknown;
  onAction?: (action: string, item: unknown) => void;
  actions?: Action[];
  showAddCalendar?: boolean;
}

export default function ActionMenu({
  onAction: _onAction,
  showAddCalendar: _showAddCalendar = false,
}: ActionMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {/* Menu items can be added here */}
      </Menu>
    </>
  );
}
