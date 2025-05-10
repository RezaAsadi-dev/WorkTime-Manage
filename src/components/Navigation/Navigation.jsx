import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "./Navigation.css";
import home from "../../assets/home.svg";
import history from "../../assets/files-history.svg";

const Navigation = ({ theme = "dark" }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname === "/" ? "home" : location.pathname.slice(1)
  );

  const handleTabClick = (e, tab) => {
    const token = localStorage.getItem("token");
    if (!token) {
      e.preventDefault();
      toast.error("Please log in first");
      return;
    }
    setActiveTab(tab);
  };

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: <img src={home} alt="Home" />,
      path: "/",
    },
    {
      id: "detail",
      label: "History",
      icon: <img src={history} alt="History" />,
      path: "/detail",
    },
  ];

  return (
    <div className={`navigation-container ${theme}`}>
      <div className="navigation-tabs">
        {navItems.map((item) => (
          <Link
            to={item.path}
            key={item.id}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={(e) => handleTabClick(e, item.id)}
          >
            <div className="nav-icon">{item.icon}</div>
            <div className="nav-label">{item.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
