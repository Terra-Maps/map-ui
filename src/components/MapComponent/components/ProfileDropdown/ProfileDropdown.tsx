import React, { useContext, useState } from "react";
import "./ProfileDropdown.scss";
import IProfileDropdownProps from "./model";
import { ActionContext } from "../../../../hooks";
import { IActionModel } from "../../../../model/hooks.model";
import { ApiService } from "../../../../service";

const ProfileDropdown: React.FC<IProfileDropdownProps> = ({
  setShowDropdown,
}) => {
  const { resetUser, toggleModal } = useContext<IActionModel>(ActionContext);

  const [logoutText, setLogoutText] = useState("Logout");

  const logout = async () => {
    setLogoutText("Logging out...");
    await ApiService.logout();
    localStorage.removeItem("jwt-token");
    resetUser();
    setLogoutText("Logout");
    setShowDropdown(false);
  };

  return (
    <>
      <div
        className="dropdown-overlay"
        onClick={(e) => setShowDropdown(false)}
      ></div>
      <div className="dropdown-box">
        <div className="dropdown-triangle"></div>
        <div
          className="dropdown-item"
          onClick={(e) => {
            toggleModal({
              openModal: true,
              modalConfig: { type: "user-details" },
            });
            setShowDropdown(false);
          }}
        >
          User Details
        </div>
        <div className="dropdown-item" onClick={logout}>
          {logoutText}
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;
