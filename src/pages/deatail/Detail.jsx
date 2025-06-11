import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { Pagination } from "@heroui/react";
import "./style.css";
import TracingBeamDemo from "../../components/tracing";

const BASE_URL = import.meta.env.VITE_MAIN_ADDRESS;
const profileEndpoint = "api/employee/profile";
const timesheetsEndpoint = "api/employee/timesheet";

function Detail() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    contractStartDate: "",
    contractExpirationDate: "",
    basicHourlySalary: "",
  });
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timesheetsLoading, setTimesheetsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`${BASE_URL}/${profileEndpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        setProfileData({
          name: response.data.name || "",
          contractStartDate: response.data.contract_start || "",
          contractExpirationDate: response.data.contract_end || "",
          basicHourlySalary: response.data.salary || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimesheets = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(
        `${BASE_URL}/${timesheetsEndpoint}`,
        { page },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 200) {
        setTimesheets(response.data.timesheets || []);
        const itemsPerPage = 10;
        setTotalPages(Math.ceil(response.data.total_records / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    } finally {
      setTimesheetsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchTimesheets(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setTimesheetsLoading(true);
  };

  return (
    <div>
      <TracingBeamDemo
        data={timesheets}
        userProfile={profileData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={timesheetsLoading}
      />
    </div>
  );
  
}

export default Detail;
