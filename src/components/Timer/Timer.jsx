import { useState, useEffect, useCallback } from "react";

const Timer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  // Load timer state from localStorage on component mount
  useEffect(() => {
    const workStatus = localStorage.getItem("workstatus");

    // If work is in progress
    if (workStatus === "IN") {
      setIsRunning(true);

      // Check if there's a saved timer
      const savedTimer = localStorage.getItem("workTimer");
      if (savedTimer) {
        const timerData = JSON.parse(savedTimer);
        setTime(timerData.time);

        // Account for time passed while page was closed
        const timePassed = Math.floor(
          (Date.now() - timerData.lastUpdated) / 1000
        );
        if (timePassed > 1) {
          setTime(timerData.time + timePassed);
        }
      } else {
        // No saved timer but work is in progress, start from 0
        setTime(0);
      }
    } else {
      // No work in progress, reset timer
      setIsRunning(false);
      setTime(0);
    }
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    if (isRunning) {
      localStorage.setItem(
        "workTimer",
        JSON.stringify({
          time,
          lastUpdated: Date.now(),
        })
      );
    }
  }, [time, isRunning]);

  // Handle timer logic
  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  // Listen for changes to workstatus
  useEffect(() => {
    const checkWorkStatus = () => {
      const workStatus = localStorage.getItem("workstatus");

      if (workStatus === "IN") {
        setIsRunning(true);
      } else {
        setIsRunning(false);
        setTime(0);
      }
    };

    // Check initially and set up interval to check periodically
    checkWorkStatus();
    const statusCheck = setInterval(checkWorkStatus, 1000);

    return () => clearInterval(statusCheck);
  }, []);

  // Format time to display hours, minutes, and seconds
  const formatTime = useCallback((totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  }, []);

  const { hours, minutes, seconds } = formatTime(time);

  return (
    <div className="flex flex-col items-center gap-4 bg-gradient-to-b from-[#262626] to-[#0a0a0a]  rounded-2xl border border-[rgba(238,73,73,0.68)] p-6 shadow-md w-[90%] m-auto">
      <div className="flex items-center justify-center gap-2 font-vazir rtl flex-wrap">
        <span className="  font-bold text-gray-800 bg-gray-200 py-3 px-4 rounded-lg  text-center">
          {hours}
        </span>
        <span className="text-3xl font-bold text-gray-600 mx-1">:</span>
        <span className="font-bold text-gray-800 bg-gray-200 py-3 px-4 rounded-lg  text-center">
          {minutes}
        </span>
        <span className="text-3xl font-bold text-gray-600 mx-1">:</span>
        <span className=" font-bold text-gray-800 bg-gray-200 py-3 px-4 rounded-lg text-center">
          {seconds}
        </span>
      </div>
    </div>
  );
};

export default Timer;
