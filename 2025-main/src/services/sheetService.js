// Th�m h�m n�y v�o sheetService.js

// L�u nhi?u ��n h�ng c�ng l�c
export const batchSaveOrders = async (orders) => {
  if (!orders || orders.length === 0) return true;

  try {
    // Chuy?n �?i format �? ph� h?p v?i Google Sheets
    const formattedOrders = orders.map(order => {
    //
      return {
        id: order.id,
        name: order.name,
        customer: order.customer,
        transporter: order.transporter,
        phone: order.phone,
        amount_total: order.amount_total,
        cod_total: order.cod_total,
        shipment_id: order.shipment_id,
        shipment_code: order.shipment_code,
        ecom_recipient_code: order.ecom_recipient_code,
        date_order: order.date_order,
        detail: order.detail,
        address: order.address,
        district: order.district,
        city: order.city,
        ward: order.ward,
        note: order.note,
        sla_code: order.sla?.code,
        sla_level: order.sla?.level,
        deadline: order.deadline,
        time_left: order.timeLeft,
        status: order.status,
        assigned_staff_id: order.assigned_staff_id,
        last_updated: new Date().toISOString()
      };
    });

    // G?i batch request �?n Google Sheets
    const response = await fetch(`${SHEETS_API_URL}?action=batchWrite&sheet=Orders`, {
      method: 'POST',
      body: JSON.stringify(formattedOrders)
    });

    const result = await response.json();
    return result.status === 'success';
  } catch (error) {
    console.error('Error saving batch orders:', error);
    return false;
  }
};

// L�u nhi?u ho?t �?ng c�ng l�c
export const batchSaveActivities = async (activities) => {
  if (!activities || activities.length === 0) return true;

  try {
    // Ch? l?y c�c ho?t �?ng ch�a ��?c x? l?
    const newActivities = activities.filter(a => !a.processed);

    if (newActivities.length === 0) return true;

    // G?i batch request �?n Google Sheets
    const response = await fetch(`${SHEETS_API_URL}?action=batchWrite&sheet=Activities`, {
      method: 'POST',
      body: JSON.stringify(newActivities.map(a => ({ ...a, processed: true })))
    });

    const result = await response.json();
    return result.status === 'success';
  } catch (error) {
    console.error('Error saving batch activities:', error);
    return false;
  }
};
