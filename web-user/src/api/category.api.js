import axiosClient from "./axios.client";

export const getCategory = async () => {
  try {
    const response = await axiosClient.get("categories/listCategory");

    return { response };
  } catch (err) {
    return { err };
  }
};

export const addCategory = async ({ name }) => {
  try {
    const response = await axiosClient.post("categories/addCategory", {
      name,
    });

    return { response };
  } catch (err) {
    return { err };
  }
};

export const updateCategory = async (categoryId, { name }) => {
  try {
    const response = await axiosClient.put(
      `categories/updateCategory/${categoryId}`,
      {
        name,
      }
    );

    return { response };
  } catch (err) {
    return { err };
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await axiosClient.delete(
      `categories/deleteCategory/${categoryId}`
    );

    return { response };
  } catch (err) {
    return { err };
  }
};
