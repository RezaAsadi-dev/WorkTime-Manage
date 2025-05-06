import React, { useEffect, useState } from "react";
import { BackgroundBeamsWithCollision } from "../components/BackgroundBeamsWithCollision/BackgroundBeamsWithCollision";
import UserProfile from "../components/userProfile";
import platinLogo from "../assets/platin.png";
import { fetchUserProfile, useRealVh } from "../hook/hook";
import Navigation from "../components/Navigation/Navigation";

const Layout = ({ children }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [localStorage.getItem("token")]);

  useEffect(() => {
    fetchUserProfile().then((data) => {
      setUserProfile(data);
    });
  }, [token]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        calendar: "persian",
      };

      try {
        const persianDate = new Intl.DateTimeFormat("fa-IR", options).format(
          now
        );
        setDate(persianDate);

        const timeOptions = {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Tehran",
        };

        const iranTime = new Intl.DateTimeFormat("fa-IR", timeOptions).format(
          now
        );
        setTime(iranTime);
      } catch (error) {
        console.error("Error formatting Persian date:", error);
        setDate(now.toLocaleDateString());
        setTime(now.toLocaleTimeString());
      }
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    useRealVh();
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <div className="App">
        <BackgroundBeamsWithCollision>
          <div>
            <div className="w-full">
              <div className="flex justify-between text-[15px] text-white mb-5">
                <span>{date}</span>
                <span>{time}</span>
              </div>
            </div>
            <div className=" text-white">
              <img className="w-[250px] m-auto" src={platinLogo} alt="" />
              <div className="mt-8 p-2">
                {userProfile && token && (
                  <div>
                    <UserProfile userData={userProfile} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </BackgroundBeamsWithCollision>
      </div>
      {children}
      <div>
        <Navigation />
      </div>
    </div>
  );
};

export default Layout;
