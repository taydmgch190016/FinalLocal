import axiosClient from "./axios.client";

export const userSignIn = async ({ email, password }) => {
  try {
    const response = await axiosClient.post("auth/webLogin", {
      email,
      password,
    });

    return { response };
  } catch (err) {
    return { err };
  }
};
