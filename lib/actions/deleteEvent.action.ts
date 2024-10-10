export const deleteOrderClient = async (orderId: string) => {
    // Logic để xóa đơn hàng
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete order');
    }
    return response.json();
  };