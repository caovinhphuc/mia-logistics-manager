import React from "react";

import {
  Eye,
  Edit,
   Trash,
   Plus,
  FileText,
  GitBranch,
  Maximize,
  Settings,
} from "lucide-react";
import { useEffect } from "react";




// Styles cho menu ngữ cảnh
const contextMenuStyles = {
  container: {
    position: "absolute",
    zIndex: 50,
    minWidth: "150px",
    backgroundColor: "#1F2937",
    color: "#E5E7EB",
    borderRadius: "0.375rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #374151",
    overflow: "hidden",
  },
  list: {
    padding: "0.25rem 0",
  },
  item: {
    width: "100%",
    textAlign: "left",
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  itemHover: {
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
  },
  divider: {
    borderTop: "1px solid #374151",
    margin: "0.25rem 0",
  },
  dangerItem: {
    color: "#EF4444",
  },
  dangerItemHover: {
    backgroundColor: "#EF4444",
    color: "#FFFFFF",
  },
};

const MenuItem = ({ icon: Icon, label, onClick, danger = false }) => {
  const [isHover, setIsHover] = React.useState(false);

  return (
    <button
      className="context-menu-item"
      style={{
        ...contextMenuStyles.item,
        ...(isHover
          ? danger
            ? contextMenuStyles.dangerItemHover
            : contextMenuStyles.itemHover
          : {}),
        ...(danger && !isHover ? contextMenuStyles.dangerItem : {}),
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Icon size={14} />
      {label}
    </button>
  );
};

const WarehouseContextMenu = ({
  contextMenu,
  contextMenuTarget,
  closeContextMenu,

  // Map actions
  setIsAddingNote,
  setNotePosition,
  setCurrentNote,
  setShowNoteModal,
  clearSelectionTool,
  clearMeasureTool,
  setMeasureMode,
  setSelectionMode,
  setShowSettingsModal,

  // Shelf actions
  handleShelfClick,
  setSelectedLocation,
  setShowOrderDetails,
  setCurrentShelf,
  setCurrentZone,
  setShowShelfModal,
  deleteShelf,

  // Aisle actions
  setCurrentAisle,
  setShowAisleModal,
  deleteAisle,

  // Entrance actions
  setCurrentEntrance,
  setShowEntranceModal,
  deleteEntrance,

  // Packing station actions
  setCurrentPackingStation,
  setShowPackingStationModal,
  deletePackingStation,

  // References
  containerRef,
  offset,
  zoom,
  gridSize,
}) => {
  if (!contextMenu) return null;

  return (
    <div
      style={{
        ...contextMenuStyles.container,
        left: `${contextMenu.x}px`,
        top: `${contextMenu.y}px`,
      }}
    >
      <ul style={contextMenuStyles.list}>
        {contextMenu.type === "map" && (
          <>
            <li>
              <MenuItem
                icon={FileText}
                label="Thêm ghi chú"
                onClick={() => {
                  // Tính toán vị trí grid
                  const rect = containerRef.current.getBoundingClientRect();
                  const x = (contextMenu.x - offset.x) / zoom;
                  const y = (contextMenu.y - offset.y) / zoom;
                  const gridX = Math.floor(x / gridSize);
                  const gridY = Math.floor(y / gridSize);

                  // Thêm ghi chú mới
                  setIsAddingNote(true);
                  setNotePosition({ x: gridX, y: gridY });
                  setCurrentNote(null);
                  setShowNoteModal(true);
                  closeContextMenu();
                }}
              />
            </li>
            <li>
              <MenuItem
                icon={GitBranch}
                label="Đo khoảng cách"
                onClick={() => {
                  // Chuyển sang chế độ đo khoảng cách
                  clearSelectionTool();
                  setIsAddingNote(false);
                  setMeasureMode(true);
                  closeContextMenu();
                }}
              />
            </li>
            <li>
              <MenuItem
                icon={Maximize}
                label="Chọn vùng"
                onClick={() => {
                  // Chuyển sang chế độ vùng chọn
                  clearMeasureTool();
                  setIsAddingNote(false);
                  setSelectionMode(true);
                  closeContextMenu();
                }}
              />
            </li>
            <li style={contextMenuStyles.divider}></li>
            <li>
              <MenuItem
                icon={Settings}
                label="Cài đặt kho"
                onClick={() => {
                  // Mở modal cài đặt kho
                  setShowSettingsModal(true);
                  closeContextMenu();
                }}
              />
            </li>
          </>
        )}

        {contextMenu.type === "shelf" && contextMenuTarget && (
          <>
            <li>
              <MenuItem
                icon={Eye}
                label="Xem chi tiết"
                onClick={() => {
                  // Chọn kệ
                  const { shelf, zone } = contextMenuTarget;
                  handleShelfClick(shelf, zone);
                  setSelectedLocation({ shelf, zone });
                  setShowOrderDetails(true);
                  closeContextMenu();
                }}
              />
            </li>
            <li>
              <MenuItem
                icon={Edit}
                label="Chỉnh sửa kệ"
                onClick={() => {
                  // Chỉnh sửa kệ
                  const { shelf, zone } = contextMenuTarget;
                  setCurrentShelf(shelf);
                  setCurrentZone(zone);
                  setShowShelfModal(true);
                  closeContextMenu();
                }}
              />
            </li>
            <li style={contextMenuStyles.divider}></li>
            <li>
              <MenuItem
                icon={Trash}
                label="Xóa kệ"
                danger
                onClick={() => {
                  // Xóa kệ
                  const { shelf, zone } = contextMenuTarget;
                  if (
                    window.confirm(`Bạn có chắc muốn xóa kệ ${shelf.name}?`)
                  ) {
                    deleteShelf(zone.id, shelf.id);
                  }
                  closeContextMenu();
                }}
              />
            </li>
          </>
        )}

        {contextMenu.type === "aisle" && contextMenuTarget && (
          <>
            <li>
              <MenuItem
                icon={Edit}
                label="Chỉnh sửa lối đi"
                onClick={() => {
                  // Chỉnh sửa lối đi
                  setCurrentAisle(contextMenuTarget);
                  setShowAisleModal(true);
                  closeContextMenu();
                }}
              />
            </li>
            <li style={contextMenuStyles.divider}></li>
            <li>
              <MenuItem
                icon={Trash}
                label="Xóa lối đi"
                danger
                onClick={() => {
                  // Xóa lối đi
                  if (
                    window.confirm(
                      `Bạn có chắc muốn xóa lối đi ${contextMenuTarget.id}?`
                    )
                  ) {
                    deleteAisle(contextMenuTarget.id);
                  }
                  closeContextMenu();
                }}
              />
            </li>
          </>
        )}

        {contextMenu.type === "entrance" && contextMenuTarget && (
          <>
            <li>
              <MenuItem
                icon={Edit}
                label="Chỉnh sửa cổng"
                onClick={() => {
                  // Chỉnh sửa cổng
                  setCurrentEntrance(contextMenuTarget);
                  setShowEntranceModal(true);
                  closeContextMenu();
                }}
              />
            </li>
            <li style={contextMenuStyles.divider}></li>
            <li>
              <MenuItem
                icon={Trash}
                label="Xóa cổng"
                danger
                onClick={() => {
                  // Xóa cổng
                  if (
                    window.confirm(
                      `Bạn có chắc muốn xóa cổng ${contextMenuTarget.name}?`
                    )
                  ) {
                    deleteEntrance(contextMenuTarget.id);
                  }
                  closeContextMenu();
                }}
              />
            </li>
          </>
        )}

        {contextMenu.type === "packing" && contextMenuTarget && (
          <>
            <li>
              <MenuItem
                icon={Edit}
                label="Chỉnh sửa trạm"
                onClick={() => {
                  // Chỉnh sửa trạm đóng gói
                  setCurrentPackingStation(contextMenuTarget);
                  setShowPackingStationModal(true);
                  closeContextMenu();
                }}
              />
            </li>
            <li style={contextMenuStyles.divider}></li>
            <li>
              <MenuItem
                icon={Trash}
                label="Xóa trạm"
                danger
                onClick={() => {
                  // Xóa trạm đóng gói
                  if (
                    window.confirm(
                      `Bạn có chắc muốn xóa trạm đóng gói ${contextMenuTarget.name}?`
                    )
                  ) {
                    deletePackingStation(contextMenuTarget.id);
                  }
                  closeContextMenu();
                }}
              />
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default WarehouseContextMenu;
