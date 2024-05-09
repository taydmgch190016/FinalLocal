import axiosClient from "./axios.client";

export const getEmployee = async () => {
  try {
    const response = await axiosClient.get("employees/listEmployee");

    return { response };
  } catch (err) {
    return { err };
  }
};

export const addEmployee = async ({ email, password, storeId }) => {
  try {
    const response = await axiosClient.post("employees/addEmployee", {
      email,
      password,
      storeId,
    });

    return { response };
  } catch (err) {
    return { err };
  }
};

export const updateEmployee = async (
  employeeId,
  { email, password, storeId }
) => {
  try {
    const response = await axiosClient.put(
      `employees/updateEmployee/${employeeId}`,
      {
        email,
        password,
        storeId,
      }
    );

    return { response };
  } catch (err) {
    return { err };
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const response = await axiosClient.delete(
      `employees/deleteEmployee/${employeeId}`
    );

    return { response };
  } catch (err) {
    return { err };
  }
};
