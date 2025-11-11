import { useState, useCallback } from 'react';
import {
  InboundItem,
  PackagingItem,
  TimelineItem,
  DocumentStatusItem,
} from '../types/inbound';

export const useDialogs = () => {
  // Main add/edit dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InboundItem | null>(null);

  // Edit item dialog
  const [editItemDialog, setEditItemDialog] = useState<{
    open: boolean;
    type: 'packaging' | 'timeline' | 'documentStatus';
    item: PackagingItem | TimelineItem | DocumentStatusItem | null;
    index: number;
  }>({
    open: false,
    type: 'packaging',
    item: null,
    index: -1,
  });

  const [editItemForm, setEditItemForm] = useState<{
    description: string;
  }>({
    description: '',
  });

  // Action menu states
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedItemForAction, setSelectedItemForAction] =
    useState<InboundItem | null>(null);

  // Calendar menu states
  const [calendarMenuAnchor, setCalendarMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [calendarMenuDate, setCalendarMenuDate] = useState<Date | null>(null);

  // Card menu states
  const [cardMenuAnchor, setCardMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedCardItem, setSelectedCardItem] = useState<InboundItem | null>(
    null
  );

  // Main dialog handlers
  const openAddDialog = useCallback(() => {
    setEditingItem(null);
    setOpenDialog(true);
  }, []);

  const openEditDialog = useCallback((item: InboundItem) => {
    setEditingItem(item);
    setOpenDialog(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingItem(null);
  }, []);

  // Edit item dialog handlers
  const openEditItemDialog = useCallback(
    (
      type: 'packaging' | 'timeline' | 'documentStatus',
      item: PackagingItem | TimelineItem | DocumentStatusItem,
      index: number
    ) => {
      setEditItemDialog({
        open: true,
        type,
        item,
        index,
      });
      setEditItemForm({
        description: item.description || '',
      });
    },
    []
  );

  const closeEditItemDialog = useCallback(() => {
    setEditItemDialog({
      open: false,
      type: 'packaging',
      item: null,
      index: -1,
    });
    setEditItemForm({
      description: '',
    });
  }, []);

  const updateEditItemForm = useCallback((field: string, value: string) => {
    setEditItemForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Action menu handlers
  const openActionMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>, item: InboundItem) => {
      setActionMenuAnchor(event.currentTarget);
      setSelectedItemForAction(item);
    },
    []
  );

  const closeActionMenu = useCallback(() => {
    setActionMenuAnchor(null);
    setSelectedItemForAction(null);
  }, []);

  // Calendar menu handlers
  const openCalendarMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>, date: Date) => {
      setCalendarMenuAnchor(event.currentTarget);
      setCalendarMenuDate(date);
    },
    []
  );

  const closeCalendarMenu = useCallback(() => {
    setCalendarMenuAnchor(null);
    setCalendarMenuDate(null);
  }, []);

  // Card menu handlers
  const openCardMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>, item: InboundItem) => {
      setCardMenuAnchor(event.currentTarget);
      setSelectedCardItem(item);
    },
    []
  );

  const closeCardMenu = useCallback(() => {
    setCardMenuAnchor(null);
    setSelectedCardItem(null);
  }, []);

  return {
    // Main dialog
    openDialog,
    editingItem,
    openAddDialog,
    openEditDialog,
    closeDialog,

    // Edit item dialog
    editItemDialog,
    editItemForm,
    openEditItemDialog,
    closeEditItemDialog,
    updateEditItemForm,

    // Action menu
    actionMenuAnchor,
    selectedItemForAction,
    openActionMenu,
    closeActionMenu,

    // Calendar menu
    calendarMenuAnchor,
    calendarMenuDate,
    openCalendarMenu,
    closeCalendarMenu,

    // Card menu
    cardMenuAnchor,
    selectedCardItem,
    openCardMenu,
    closeCardMenu,
  };
};
