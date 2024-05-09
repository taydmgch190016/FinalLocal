import axiosClient from "./axios.client";

export const getProduct = async () => {
  try {
    const response = await axiosClient.get("products/listProduct");

    return { response };
  } catch (err) {
    return { err };
  }
};

export const addProduct = async ({
  name,
  description,
  price,
  quantity,
  image,
  storeId,
  categoryId,
}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("quantity", quantity);
  formData.append("image", image);
  formData.append("storeId", storeId);
  formData.append("categoryId", categoryId);

  try {
    const response = await axiosClient.post("products/addProduct", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { response };
  } catch (err) {
    return { err };
  }
};

export const updateProduct = async (
  productId,
  { name, description, price, quantity, image, storeId, categoryId }
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("quantity", quantity);
  formData.append("image", image);
  formData.append("storeId", storeId);
  formData.append("categoryId", categoryId);

  try {
    const response = await axiosClient.put(
      `products/updateProduct/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { response };
  } catch (err) {
    return { err };
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axiosClient.delete(
      `products/deleteProduct/${productId}`
    );

    return { response };
  } catch (err) {
    return { err };
  }
};
