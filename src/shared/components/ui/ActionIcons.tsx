import React from 'react';
import { SvgIconProps } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Visibility as ViewIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

interface ActionIconsProps extends Omit<SvgIconProps, 'children'> {
  name:
    | 'edit'
    | 'delete'
    | 'add'
    | 'refresh'
    | 'search'
    | 'filter'
    | 'more'
    | 'view'
    | 'pdf'
    | 'print';
}

const iconMap = {
  edit: EditIcon,
  delete: DeleteIcon,
  add: AddIcon,
  refresh: RefreshIcon,
  search: SearchIcon,
  filter: FilterIcon,
  more: MoreIcon,
  view: ViewIcon,
  pdf: PdfIcon,
  print: PrintIcon,
};

// Component usage: <ActionIcons name="add" />
const ActionIconsComponent: React.FC<ActionIconsProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name];
  return <IconComponent {...props} />;
};

// Object-style usage: <ActionIcons.add />
export const ActionIcons = Object.assign(ActionIconsComponent, {
  edit: (props: SvgIconProps) => <EditIcon {...props} />,
  delete: (props: SvgIconProps) => <DeleteIcon {...props} />,
  add: (props: SvgIconProps) => <AddIcon {...props} />,
  refresh: (props: SvgIconProps) => <RefreshIcon {...props} />,
  search: (props: SvgIconProps) => <SearchIcon {...props} />,
  filter: (props: SvgIconProps) => <FilterIcon {...props} />,
  more: (props: SvgIconProps) => <MoreIcon {...props} />,
  view: (props: SvgIconProps) => <ViewIcon {...props} />,
  pdf: (props: SvgIconProps) => <PdfIcon {...props} />,
  print: (props: SvgIconProps) => <PrintIcon {...props} />,
});
