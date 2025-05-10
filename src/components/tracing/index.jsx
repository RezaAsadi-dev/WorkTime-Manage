import { twMerge } from "tailwind-merge";
import { TracingBeam } from "./ui/index";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../hook/hook";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function TracingBeamDemo({ data }) {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile().then((data) => {
      setUserProfile(data);
    });
  }, []);

  function calculateTotalPay(timeString, salaryPerHour) {
    if (!timeString || !salaryPerHour) return 0;

    const [hours, minutes] = timeString.split(":").map(Number);
    const totalHours = hours + minutes / 60;
    return totalHours * salaryPerHour;
  }

  const dummyContent = [
    {
      title: userProfile?.name,
      description: (
        <>
          <div className=" p-5 grid lg:grid-cols-4 md:grid-cols-2 border-2 gap-4 ">
            <div>
              <span className="font-normal text-sm">
                {" "}
                Contract start date :
              </span>
              <span className="infomationDetails">
                {userProfile?.contract_start}
              </span>
            </div>
            <div>
              <span className="font-normal text-sm">
                Contract expiration date :
              </span>
              <span className="infomationDetails">
                {userProfile?.contract_end}
              </span>
            </div>
            <div>
              <span className="font-normal text-sm">
                Basic hourly salary amount :
              </span>
              <span className="infomationDetails">
                ریال {Number(userProfile?.salary)?.toLocaleString()}
              </span>
            </div>
          </div>
        </>
      ),
      badge: "Personal information",
    },
    {
      title: "30 day",
      description: (
        <>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border-collapse shadow">
              <thead className="bg-gray-100">
                <tr className="border py-4 text-center font-normal text-sm">
                  <th className="px-4 py-2 whitespace-nowrap"> - </th>
                  <th className="px-4 py-2 whitespace-nowrap">Entry Time</th>
                  <th className="px-4 py-2 whitespace-nowrap">Exit Time</th>
                  <th className="px-4 py-2 whitespace-nowrap">Date</th>
                  <th className="px-4 py-2 whitespace-nowrap">Total Time</th>
                  <th className="px-4 py-2 whitespace-nowrap">Daily income</th>
                </tr>
              </thead>
              <tbody>
                {data?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No timesheet data available
                    </td>
                  </tr>
                ) : (
                  data?.reverse()?.map((timesheet, index) => (
                    <tr
                      key={timesheet.id}
                      className="border py-4 text-center font-normal text-sm hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {timesheet.check_in || "-"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {timesheet.check_out || "-"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {timesheet.date || "-"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {timesheet.total_time || "0"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {calculateTotalPay(
                          timesheet.total_time,
                          userProfile?.salary
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ),
      badge: "Report",
    },
  ];
  return (
    <TracingBeam className="px-6">
      <div className="max-w-2xl mx-auto antialiased pt-4 relative">
        {dummyContent?.map((item, index) => (
          <div key={`content-${index}`} className="mb-[10rem]">
            <h2 className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4">
              {item.badge}
            </h2>

            <p className={"text-xl mb-4"}>{item.title}</p>

            <div className="text-sm prose prose-sm dark:prose-invert">
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </TracingBeam>
  );
}
