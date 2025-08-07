import { useState, useEffect } from "react";
import "./style.css";
import TracingBeamDemo from "../../components/tracing";
import { useProfile, useTimesheets } from "../../config/apiHooks/useAdmin";
import Layout from "../../layout";
import { useNavigate } from "react-router-dom";

function Detail() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { data: profileData, error: profileError } = useProfile();

  const {
    data: timesheetData,
    isLoading: timesheetLoading,
    error: timesheetError,
  } = useTimesheets(currentPage);

  // Handle unauthorized errors
  useEffect(() => {
    if (profileError?.message === "UNAUTHORIZED" || timesheetError?.message === "UNAUTHORIZED") {
      navigate("/login");
    }
  }, [profileError, timesheetError, navigate]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Layout>
      <TracingBeamDemo
        data={timesheetData?.timesheets || []}
        userProfile={profileData}
        currentPage={currentPage}
        totalPages={timesheetData?.totalPages || 1}
        onPageChange={handlePageChange}
        isLoading={timesheetLoading}
      />
    </Layout>
  );
}

export default Detail;
