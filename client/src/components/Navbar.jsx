import { useNavigate } from "react-router-dom";

import LayersIcon from "@mui/icons-material/Layers";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

function Navbar({ onBrandClick }) {
  const navigate = useNavigate();

  const handleBrandClick = () => {
    if (onBrandClick) {
      onBrandClick();
    } else {
      navigate("/");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div
          className="navbar-brand-group"
          onClick={handleBrandClick}
          role="button"
          tabIndex={0}
        >
          <span className="navbar-logo">
            <LayersIcon />
          </span>
          <span className="navbar-brand">Wysa Stepper Form</span>
        </div>

        <div className="navbar-actions">
          <button className="navbar-icon-btn" aria-label="Notifications">
            <span className="navbar-notif-dot" />
            <NotificationsNoneOutlinedIcon />
          </button>

          <div className="navbar-user">
            <div className="navbar-user-text">
              <span className="navbar-user-name">Shagun Pareek</span>
              <span className="navbar-user-role">+91-9461046343</span>
            </div>

            <span className="navbar-avatar">
              <PersonOutlineOutlinedIcon />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
