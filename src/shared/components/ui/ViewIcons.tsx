import React from 'react';
import {
  GridView as GridIcon,
  ViewList as ListIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  CalendarToday as CalendarIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material';

interface ViewIconsProps {
  grid: React.ComponentType;
  list: React.ComponentType;
}

export const ViewIcons: ViewIconsProps = {
  grid: GridIcon,
  list: ListIcon,
};

interface IconProps extends Omit<IconButtonProps, 'children'> {
  name:
    | 'view'
    | 'edit'
    | 'delete'
    | 'add'
    | 'refresh'
    | 'search'
    | 'filter'
    | 'more'
    | 'grid'
    | 'list'
    | 'calendar'
    | 'expand';
}

const iconMap = {
  view: ViewIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  add: AddIcon,
  refresh: RefreshIcon,
  search: SearchIcon,
  filter: FilterIcon,
  more: MoreIcon,
  grid: GridIcon,
  list: ListIcon,
  calendar: CalendarIcon,
  expand: ExpandIcon,
};

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name];
  return <IconComponent {...props} />;
};
