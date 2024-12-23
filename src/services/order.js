/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";

export const getAllOrder = async (page, size, sort, search) => {
  try {
    let queryOrder = `orders?size=${size}&page=${page}`;
    if (page) queryOrder += `&page=${page}`;
    if (sort.sortField && sort.sortOrder)
      queryOrder += `&sortField=${sort.sortField}&sort=${sort.sortOrder}`;

    if (search) queryOrder += `&orderCode=${search}`;

    return await Author.get(queryOrder);
  } catch (error) {
    throw error;
  }
};

export const getOrderForAssignShipper = async () => {
  try {
    const res = await Author.get("/orders?orderStatus=Đã xác nhận");
    return res;
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await Author.get(`orders/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductsForOrderId = async (id, page) => {
  try {
    const response = await Author.get(
      `orders/${id}/products?page=${page}&size=5`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const confirmOder = async (id) => {
  try {
    const response = await Author.put(`/orders/${id}/order-status`, {
      order_status: "Đã xác nhận",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const returnOder = async (id) => {
  try {
    const response = await Author.put(`/orders/${id}/order-status`, {
      order_status: "Trả hàng",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deliveredOder = async (id) => {
  try {
    const response = await Author.put(`/orders/${id}/order-status`, {
      order_status: "Đã nhận hàng",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const rejectOder = async (id) => {
  try {
    const response = await Author.put(`/orders/${id}/order-status`, {
      order_status: "Đã huỷ",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const assignOrderForShipper = async (shipperId, orderId) => {
  try {
    const res = await Author.put(`orders/assign-many-delivery-person`, {
      delivery_person_id: shipperId,
      order_id: orderId,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
