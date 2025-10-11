import { Delete, Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";

interface GridViewItem {
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string;
  status?: string;
  description?: string;
  [key: string]: any;
}

interface GridViewProps {
  items: GridViewItem[];
  onEdit?: (item: GridViewItem) => void;
  onDelete?: (item: GridViewItem) => void;
  renderCustomContent?: (item: GridViewItem) => React.ReactNode;
}

const GridView: React.FC<GridViewProps> = ({
  items,
  onEdit,
  onDelete,
  renderCustomContent,
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "hoạt động":
        return "success";
      case "inactive":
      case "không hoạt động":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" alignItems="center" mb={1}>
                {item.avatar && (
                  <Avatar
                    sx={{ mr: 1, bgcolor: "transparent", fontSize: "1.5rem" }}
                  >
                    {item.avatar}
                  </Avatar>
                )}
                <Box flexGrow={1}>
                  <Typography variant="h6" component="div" noWrap>
                    {item.title}
                  </Typography>
                  {item.subtitle && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {item.subtitle}
                    </Typography>
                  )}
                </Box>
              </Box>

              {item.status && (
                <Box mb={1}>
                  <Chip
                    label={
                      item.status === "active" ? "Hoạt động" : "Không hoạt động"
                    }
                    color={getStatusColor(item.status)}
                    size="small"
                  />
                </Box>
              )}

              {item.description && (
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              )}

              {renderCustomContent && renderCustomContent(item)}
            </CardContent>

            {(onEdit || onDelete) && (
              <CardActions>
                {onEdit && (
                  <IconButton
                    size="small"
                    onClick={() => onEdit(item)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                )}
                {onDelete && (
                  <IconButton
                    size="small"
                    onClick={() => onDelete(item)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                )}
              </CardActions>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default GridView;
export type { GridViewItem };
