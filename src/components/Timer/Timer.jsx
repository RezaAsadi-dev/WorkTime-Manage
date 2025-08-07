import { useState, useEffect, useCallback } from "react";

const Timer = ({ checkInTime, checkedIn }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // Sync with checkInTime from API
  useEffect(() => {
    if (checkedIn && checkInTime) {
      // Parse checkInTime (HH:mm) to today timestamp
      const now = new Date();
      const [h, m] = checkInTime.split(":").map(Number);
      const checkInDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
      let diff = Math.floor((Date.now() - checkInDate.getTime()) / 1000);
      if (diff < 0) diff = 0; // اگر تایمر منفی شد، صفر نمایش بده
      setStartTime(checkInDate.getTime());
      setTime(diff);
      setIsRunning(true);
    } else if (!checkedIn) {
      setIsRunning(false);
      setTime(0);
      setStartTime(null);
    }
  }, [checkInTime, checkedIn]);

  // Handle tab closing
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isRunning && startTime) {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        if (currentTime < 0) {
          localStorage.setItem(
            "workTimer",
            JSON.stringify({
              startTime,
              elapsedTime: 0,
              lastUpdated: Date.now(),
            })
          );
        } else {
          localStorage.setItem(
            "workTimer",
            JSON.stringify({
              startTime,
              elapsedTime: currentTime,
              lastUpdated: Date.now(),
            })
          );
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isRunning, startTime]);

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
        const timePassed = Math.floor((Date.now() - timerData.lastUpdated) / 1000);
        let totalElapsedTime = timerData.elapsedTime + timePassed;
        if (totalElapsedTime < 0) totalElapsedTime = 0;
        
        // Update the timer data in localStorage
        localStorage.setItem(
          "workTimer",
          JSON.stringify({
            startTime: timerData.startTime,
            elapsedTime: totalElapsedTime,
            lastUpdated: Date.now(),
          })
        );
        
        setStartTime(timerData.startTime);
        setTime(totalElapsedTime);
      } else {
        const now = Date.now();
        setStartTime(now);
        setTime(0);
        localStorage.setItem(
          "workTimer",
          JSON.stringify({
            startTime: now,
            elapsedTime: 0,
            lastUpdated: now,
          })
        );
      }
    } else {
      setIsRunning(false);
      setTime(0);
      setStartTime(null);
    }
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    if (isRunning && startTime) {
      let currentTime = Math.floor((Date.now() - startTime) / 1000);
      if (currentTime < 0) currentTime = 0;
      localStorage.setItem(
        "workTimer",
        JSON.stringify({
          startTime,
          elapsedTime: currentTime,
          lastUpdated: Date.now(),
        })
      );
    }
  }, [isRunning, startTime]);

  // Handle timer logic
  useEffect(() => {
    let interval;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        const savedTimer = localStorage.getItem("workTimer");
        if (savedTimer) {
          const timerData = JSON.parse(savedTimer);
          const timePassed = Math.floor((Date.now() - timerData.lastUpdated) / 1000);
          let totalElapsedTime = timerData.elapsedTime + timePassed;
          if (totalElapsedTime < 0) totalElapsedTime = 0;
          setTime(totalElapsedTime);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  // Listen for changes to workstatus
  useEffect(() => {
    const checkWorkStatus = () => {
      const workStatus = localStorage.getItem("workstatus");

      if (workStatus === "IN") {
        if (!startTime) {
          const savedTimer = localStorage.getItem("workTimer");
          if (savedTimer) {
            const timerData = JSON.parse(savedTimer);
            const timePassed = Math.floor((Date.now() - timerData.lastUpdated) / 1000);
            let totalElapsedTime = timerData.elapsedTime + timePassed;
            if (totalElapsedTime < 0) totalElapsedTime = 0;
            
            setStartTime(timerData.startTime);
            setTime(totalElapsedTime);
          } else {
            const now = Date.now();
            setStartTime(now);
            setTime(0);
            localStorage.setItem(
              "workTimer",
              JSON.stringify({
                startTime: now,
                elapsedTime: 0,
                lastUpdated: now,
              })
            );
          }
        }
        setIsRunning(true);
      } else {
        setIsRunning(false);
        setTime(0);
        setStartTime(null);
      }
    };

    checkWorkStatus();
    const statusCheck = setInterval(checkWorkStatus, 1000);

    return () => clearInterval(statusCheck);
  }, [startTime]);

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
    <div className="flex flex-col items-center gap-4 bg-gradient-to-b from-[#262626] to-[#0a0a0a] rounded-2xl border border-[rgba(238,73,73,0.68)] p-6 shadow-md w-[90%] m-auto">
      <div className="flex items-center justify-center gap-2 font-vazir rtl flex-wrap">
        <span className="font-bold text-gray-800 bg-gray-200 py-3 px-4 rounded-lg text-center">
          {hours}
        </span>
        <span className="text-3xl font-bold text-gray-600 mx-1">:</span>
        <span className="font-bold text-gray-800 bg-gray-200 py-3 px-4 rounded-lg text-center">
          {minutes}
        </span>
        <span className="text-3xl font-bold text-gray-600 mx-1">:</span>
        <span className="font-bold text-gray-800 bg-gray-200 py-3 px-4 rounded-lg text-center">
          {seconds}
        </span>
      </div>
    </div>
  );
};

export default Timer;
