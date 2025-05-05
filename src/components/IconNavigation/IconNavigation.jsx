import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./IconNavigation.css";

const IconNavigation = ({ theme = "dark" }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname === "/" ? "home" : location.pathname.slice(1)
  );

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderIcon = (type, isActive) => {
    const fill = isActive ? "#ffffff" : theme === "light" ? "#666666" : "#999999";
    
    if (type === "home") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12h6v10" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (type === "search") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 21L16.65 16.65" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (type === "analytics") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 20V10" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 20V4" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 20V14" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (type === "history") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8V12L15 15" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.05 11C3.3 7.58 5.37 4.61 8.4 3.05M12 2C13.57 2 15.1 2.4 16.47 3.14M21.95 11C21.72 13.77 20.28 16.23 18 17.85M12 22C8.25 22 5.03 19.94 3.63 17" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (type === "profile") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
  };

  const navItems = [
    { id: "home", path: "/" },
    { id: "search", path: "/search" },
    { id: "analytics", path: "/analytics" },
    { id: "history", path: "/history" },
    { id: "profile", path: "/profile" },
  ];

  return (
    <div className={`icon-navigation-container ${theme}`}>
      <div className="icon-navigation-tabs">
        {navItems.map((item) => (
          <Link
            to={item.path}
            key={item.id}
            className={`icon-nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => handleTabClick(item.id)}
          >
            {renderIcon(item.id, activeTab === item.id)}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default IconNavigation; 