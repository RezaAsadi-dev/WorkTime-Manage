import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "@heroui/react";
import "./style.css";
import TracingBeamDemo from "../../components/tracing";

const BASE_URL = import.meta.env.VITE_MAIN_ADDRESS;
const profileEndpoint = "user/api/profile";
const timesheetsEndpoint = "user/api/my_timesheets";

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
      const response = await axios.get(`${BASE_URL}/${profileEndpoint}`, {
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
      const response = await axios.post(
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
    // <div className=" container m-auto">
    //   <div className=" space-y-10 ">
    //     <div className=" w-full   shadow-sm overflow-auto">
    //       <span className=" w-full bg-[#0d67be] text-white py-4 text-xl  flex justify-center  items-center ">
    //         Personal information
    //       </span>
    //       <div className=" p-5 grid lg:grid-cols-4 md:grid-cols-2 border-2 gap-4 ">
    //         <div>
    //           <span className="font-normal text-sm"> Name :</span>
    //           <span className="infomationDetails">
    //             {" "}
    //             {loading ? "Loading..." : profileData.name}
    //           </span>
    //         </div>
    //         <div>
    //           <span className="font-normal text-sm">
    //             {" "}
    //             Contract start date :
    //           </span>
    //           <span className="infomationDetails">
    //             {" "}
    //             {loading ? "Loading..." : profileData.contractStartDate}
    //           </span>
    //         </div>
    //         <div>
    //           <span className="font-normal text-sm">
    //             {" "}
    //             Contract expiration date :
    //           </span>
    //           <span className="infomationDetails">
    //             {" "}
    //             {loading ? "Loading..." : profileData.contractExpirationDate}
    //           </span>
    //         </div>
    //         <div>
    //           <span className="font-normal text-sm">
    //             {" "}
    //             Basic hourly salary amount :
    //           </span>
    //           <span className="infomationDetails">
    //             {" "}
    //             {loading ? "Loading..." : profileData.basicHourlySalary}
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //     <div className=" w-full mt-5 ">
    //       <span className=" w-full bg-[#0d67be] text-white py-4 text-xl  flex justify-center  items-center ">
    //         Report
    //       </span>
    //       <table className="border-collapse w-full shadow">
    //         <thead className="bg-gray-100">
    //           <tr className="border py-4 text-center font-normal text-sm">
    //             <th className="px-4 py-2">Entry Time</th>
    //             <th className="px-4 py-2">Exit Time</th>
    //             <th className="px-4 py-2">Date</th>
    //             <th className="px-4 py-2">Total Time (minutes)</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {timesheetsLoading ? (
    //             <tr>
    //               <td colSpan="4" className="text-center py-4">
    //                 Loading...
    //               </td>
    //             </tr>
    //           ) : timesheets.length === 0 ? (
    //             <tr>
    //               <td colSpan="4" className="text-center py-4">
    //                 No timesheet data available
    //               </td>
    //             </tr>
    //           ) : (
    //             timesheets.map((timesheet) => (
    //               <tr
    //                 key={timesheet.id}
    //                 className="border py-4 text-center font-normal text-sm"
    //               >
    //                 <td className="px-4 py-2">{timesheet.check_in || "-"}</td>
    //                 <td className="px-4 py-2">{timesheet.check_out || "-"}</td>
    //                 <td className="px-4 py-2">{timesheet.date || "-"}</td>
    //                 <td className="px-4 py-2">{timesheet.total_time || "0"}</td>
    //               </tr>
    //             ))
    //           )}
    //         </tbody>
    //       </table>

    //       {totalPages && (
    //         <div className="flex justify-center my-5 mb-4">
    //           <Pagination
    //             initialPage={currentPage}
    //             total={totalPages}
    //             onChange={handlePageChange}
    //           />
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
    <div>
      <TracingBeamDemo data={timesheets}/>
    </div>
  );
}

export default Detail;
