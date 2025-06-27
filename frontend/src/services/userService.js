
import API from "./api";

export const getEmployeesByManager = async () => {
  const response = await API.get("/auth/employees");
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await API.get(`/auth/users/${userId}`);
  return response.data;
};
