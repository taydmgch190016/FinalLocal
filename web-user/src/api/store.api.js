import axiosClient from "./axios.client";

export const getStore = async () => {
  try {
    const response = await axiosClient.get("client/stores/listStore");

    return { response };
  } catch (err) {
    return { err };
  }
};

export const addStore = async ({ name, address }) => {
  try {
    const response = await axiosClient.post("client/stores/addStore", {
      name,
      address,
    });

    return { response };
  } catch (err) {
    return { err };
  }
};

export const updateStore = async (storeId, { name, address }) => {
  try {
    const response = await axiosClient.put(
      `client/stores/updateStore/${storeId}`,
      {
        name,
        address,
      }
    );

    return { response };
  } catch (err) {
    return { err };
  }
};

export const deleteStore = async (storeId) => {
  try {
    const response = await axiosClient.delete(
      `client/stores/deleteStore/${storeId}`
    );

    return { response };
  } catch (err) {
    return { err };
  }
};
