import axiosClient from "./axios.client";

export const getCustomer = async (customerId) => {
  try {
    const response = await axiosClient.get(`customers/${customerId}`);

    return { response };
  } catch (err) {
    return { err };
  }
};
