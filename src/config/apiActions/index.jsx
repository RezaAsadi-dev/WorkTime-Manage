import api from "../axiosConfig";
import { employeeEndpoints } from "../endpoints";

export const logInEmployee = async (data) => {
  const response = await api.post(employeeEndpoints.login, data);
  return response.data;
};
// export const getProfile = async () => {
//   const response = await api.get(employeeEndpoints.profile);
//   return response.data;
// };
export const getProfile = async () => {
  const response = await api.get(employeeEndpoints.profile);

    return response.data;

};
export const checkIn = async () => {
  const response = await api.get(employeeEndpoints.checkIn);
  return response.data;
};
export const checkOut = async () => {
  const response = await api.get(employeeEndpoints.checkOut);
  return response.data;
};

export const fetchTimesheets = async (page = 1) => {
  const response = await api.post(employeeEndpoints.timesheet, { page });
  return response.data;
};

export const getEmployeeStatus = async () => {
  const response = await api.get(employeeEndpoints.status);
  return response.data;
};
