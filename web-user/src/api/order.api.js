import axiosClient from "./axios.client";

export const getOrder = async () => {
  try {
    const response = await axiosClient.get("orders/listOrders");

    return { response };
  } catch (err) {
    return { err };
  }
};

export const confirmDelivery = async (id) => {
  try {
    const response = await axiosClient.post(`orders/confirmDelivery/${id}`);

    return { response };
  } catch (err) {
    return { err };
  }
};

export const revenueStatistics = async () => {
  try {
    const response = await axiosClient.get("orders/revenueStatistics");

    return { response };
  } catch (err) {
    return { err };
  }
};

export const getTopProducts = async () => {
  try {
    const response = await axiosClient.get("orders/getTopProducts");

    return { response };
  } catch (err) {
    return { err };
  }
};
