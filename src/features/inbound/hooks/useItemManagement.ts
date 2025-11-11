import { useState, useCallback } from 'react';
import {
  PackagingItem,
  TimelineItem,
  DocumentStatusItem,
  InboundItem,
} from '../types/inbound';

export const useItemManagement = () => {
  // Packaging items
  const [packagingItems, setPackagingItems] = useState<PackagingItem[]>([]);
  const [newPackagingItem, setNewPackagingItem] = useState<PackagingItem>({
    id: '',
    type: '2PCS/SET',
    quantity: 0,
    description: '',
  });

  // Timeline items
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [newTimelineItem, setNewTimelineItem] = useState<TimelineItem>({
    id: '',
    name: '',
    estimatedDate: '',
    date: '',
    status: 'pending',
    description: '',
  });

  // Document status items
  const [documentStatusItems, setDocumentStatusItems] = useState<
    DocumentStatusItem[]
  >([]);
  const [newDocumentStatusItem, setNewDocumentStatusItem] =
    useState<DocumentStatusItem>({
      id: '',
      name: '',
      date: '',
      status: 'pending',
      description: '',
    });

  // Packaging item handlers
  const addPackagingItem = useCallback(() => {
    if (newPackagingItem.type && newPackagingItem.quantity > 0) {
      const item: PackagingItem = {
        ...newPackagingItem,
        id: `packaging_${Date.now()}`,
      };
      setPackagingItems((prev) => [...prev, item]);
      setNewPackagingItem({
        id: '',
        type: '2PCS/SET',
        quantity: 0,
        description: '',
      });
    }
  }, [newPackagingItem]);

  const updatePackagingItem = useCallback(
    (index: number, field: keyof PackagingItem, value: unknown) => {
      setPackagingItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    },
    []
  );

  const deletePackagingItem = useCallback((index: number) => {
    setPackagingItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const setNewPackagingItemField = useCallback(
    (field: keyof PackagingItem, value: unknown) => {
      setNewPackagingItem((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Timeline item handlers
  const addTimelineItem = useCallback(() => {
    if (
      newTimelineItem.name &&
      (newTimelineItem.estimatedDate || newTimelineItem.date)
    ) {
      const item: TimelineItem = {
        ...newTimelineItem,
        id: `timeline_${Date.now()}`,
      };
      setTimelineItems((prev) => [...prev, item]);
      setNewTimelineItem({
        id: '',
        name: '',
        date: '',
        estimatedDate: '',
        status: 'pending',
        description: '',
      });
    }
  }, [newTimelineItem]);

  // Add timeline item with provided fields immediately
  const addTimelineItemWith = useCallback((partial: Partial<TimelineItem>) => {
    const item: TimelineItem = {
      id: `timeline_${Date.now()}`,
      name: partial.name || '',
      date: partial.date || '',
      estimatedDate: partial.estimatedDate || '',
      status: (partial.status as TimelineItem['status']) || 'pending',
      description: partial.description || '',
    };
    if (!item.name || !(item.estimatedDate || item.date)) return;
    setTimelineItems((prev) => [...prev, item]);
  }, []);

  const updateTimelineItem = useCallback(
    (index: number, field: keyof TimelineItem, value: unknown) => {
      setTimelineItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    },
    []
  );

  const updateTimelineItemFull = useCallback(
    (index: number, updatedItem: TimelineItem) => {
      setTimelineItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...updatedItem, id: item.id } : item
        )
      );
    },
    []
  );

  const deleteTimelineItem = useCallback((index: number) => {
    setTimelineItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const setNewTimelineItemField = useCallback(
    (field: keyof TimelineItem, value: unknown) => {
      setNewTimelineItem((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Document status item handlers
  const addDocumentStatusItem = useCallback(() => {
    if (
      newDocumentStatusItem.name &&
      (newDocumentStatusItem.estimatedDate || newDocumentStatusItem.date)
    ) {
      const item: DocumentStatusItem = {
        ...newDocumentStatusItem,
        id: `document_${Date.now()}`,
      };
      setDocumentStatusItems((prev) => [...prev, item]);
      setNewDocumentStatusItem({
        id: '',
        name: '',
        date: '',
        estimatedDate: '',
        status: 'pending',
        description: '',
      });
    }
  }, [newDocumentStatusItem]);

  const updateDocumentStatusItem = useCallback(
    (index: number, field: keyof DocumentStatusItem, value: unknown) => {
      setDocumentStatusItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    },
    []
  );

  const updateDocumentStatusItemFull = useCallback(
    (index: number, updatedItem: DocumentStatusItem) => {
      setDocumentStatusItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...updatedItem, id: item.id } : item
        )
      );
    },
    []
  );

  const deleteDocumentStatusItem = useCallback((index: number) => {
    setDocumentStatusItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const setNewDocumentStatusItemField = useCallback(
    (field: keyof DocumentStatusItem, value: unknown) => {
      setNewDocumentStatusItem((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Load item data for editing
  const loadItemData = useCallback((item: InboundItem) => {
    console.log('Loading item data:', item);
    console.log('Item packaging:', item.packaging);
    console.log('Item timeline:', item.timeline);
    console.log('Item documentStatus:', item.documentStatus);
    console.log('Item notes:', item.notes);
    console.log('Item quantity:', item.quantity);

    // Always load data, even if arrays are empty
    setPackagingItems(item.packaging || []);
    setTimelineItems(item.timeline || []);
    setDocumentStatusItems(item.documentStatus || []);

    console.log('State set - packagingItems:', item.packaging || []);
    console.log('State set - timelineItems:', item.timeline || []);
    console.log('State set - documentStatusItems:', item.documentStatus || []);
  }, []);

  // Reset all items
  const resetAllItems = useCallback(() => {
    setPackagingItems([]);
    setTimelineItems([]);
    setDocumentStatusItems([]);
    setNewPackagingItem({
      id: '',
      type: '2PCS/SET',
      quantity: 0,
      description: '',
    });
    setNewTimelineItem({
      id: '',
      name: '',
      date: '',
      status: 'pending',
      description: '',
    });
    setNewDocumentStatusItem({
      id: '',
      name: '',
      date: '',
      status: 'pending',
      description: '',
    });
  }, []);

  return {
    // Packaging
    packagingItems,
    newPackagingItem,
    addPackagingItem,
    updatePackagingItem,
    deletePackagingItem,
    setNewPackagingItemField,

    // Timeline
    timelineItems,
    newTimelineItem,
    addTimelineItem,
    addTimelineItemWith,
    updateTimelineItem,
    updateTimelineItemFull,
    deleteTimelineItem,
    setNewTimelineItemField,

    // Document Status
    documentStatusItems,
    newDocumentStatusItem,
    addDocumentStatusItem,
    updateDocumentStatusItem,
    updateDocumentStatusItemFull,
    deleteDocumentStatusItem,
    setNewDocumentStatusItemField,

    // Load and Reset
    loadItemData,
    resetAllItems,
  };
};
