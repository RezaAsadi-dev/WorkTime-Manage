import axiosInstance from "../utils/axiosConfig";

const token = localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_MAIN_ADDRESS;

export function useRealVh() {
  const setRealVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--real-vh", `${vh}px`);
  };

  setRealVh();
  window.addEventListener("resize", setRealVh);
  return () => window.removeEventListener("resize", setRealVh);
}

export const fetchUserProfile = async () => {
  if (token) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/api/employee/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }
  return null;
};
