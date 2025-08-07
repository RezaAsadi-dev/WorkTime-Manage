import { useMutation, useQuery } from "@tanstack/react-query";
import {
  logInEmployee,
  getProfile,
  checkIn,
  checkOut,
  fetchTimesheets,
  getEmployeeStatus,
} from "../apiActions";
import { queryClient } from "../queryClient";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await logInEmployee(data);
      return response;
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        localStorage.setItem("platintoken", data.token);
        queryClient.invalidateQueries({ queryKey: ["get-profile"] });
      }
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["get-profile"],
    queryFn: async () => {
      try {
        return await getProfile();
      } catch (error) {
        if (error?.response?.status === 401) {
          localStorage.removeItem("platintoken");
          throw new Error("UNAUTHORIZED");
        }
        throw error;
      }
    },
    refetchInterval: 1000 * 60 * 5,
    enabled: !!localStorage.getItem("platintoken"),
    retry: 1,
  });
};

export const useCheckIn = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        return await checkIn();
      } catch (error) {
        if (error?.response?.status === 401) {
          localStorage.removeItem("platintoken");
          throw new Error("UNAUTHORIZED");
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        localStorage.setItem("workstatus", "IN");
        localStorage.removeItem("workTimer");
        queryClient.invalidateQueries({ queryKey: ["get-profile"] });
        queryClient.invalidateQueries({ queryKey: ["employee-status"] });
      }
    },
  });
};

export const useCheckOut = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        return await checkOut();
      } catch (error) {
        if (error?.response?.status === 401) {
          localStorage.removeItem("platintoken");
          throw new Error("UNAUTHORIZED");
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        localStorage.removeItem("lastWorkDuration");
        localStorage.removeItem("workstatus");
        localStorage.removeItem("workTimer");
        localStorage.removeItem("timeIntervals");
        queryClient.invalidateQueries({ queryKey: ["get-profile"] });
        queryClient.invalidateQueries({ queryKey: ["employee-status"] });
      }
    },
  });
};

export const useTimesheets = (page = 1) => {
  return useQuery({
    queryKey: ["timesheets", page],
    queryFn: async () => {
      try {
        const data = await fetchTimesheets(page);
        if (data.status === 200) {
          return {
            timesheets: data.timesheets || [],
            totalPages: Math.ceil(data.total_records / 10),
          };
        }
        throw new Error("خطا در دریافت داده‌های تایم‌شیت");
      } catch (error) {
        if (error?.response?.status === 401) {
          localStorage.removeItem("platintoken");
          throw new Error("UNAUTHORIZED");
        }
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!localStorage.getItem("platintoken"),
  });
};

export const useEmployeeStatus = () => {
  return useQuery({
    queryKey: ["employee-status"],
    queryFn: async () => {
      try {
        return await getEmployeeStatus();
      } catch (error) {
        if (error?.response?.status === 401) {
          localStorage.removeItem("platintoken");
          throw new Error("UNAUTHORIZED");
        }
        throw error;
      }
    },
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    enabled: !!localStorage.getItem("platintoken"),
    retry: 1,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => {
      localStorage.clear();
      localStorage.removeItem("platintoken");
      localStorage.removeItem("workstatus");
      localStorage.removeItem("workTimer");
      localStorage.removeItem("lastWorkDuration");
      localStorage.removeItem("timeIntervals");
      queryClient.clear();
      return Promise.resolve();
    },
  });
};
