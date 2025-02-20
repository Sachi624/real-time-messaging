import React from "react";
import { useUserStore } from "./../../lib/userStore";
import "./UserDetails.css";

const UserDetails = ({ onEdit }) => {
  const { currentUser } = useUserStore();
  return (
    <div className="top-container">
      <div
        className="userdetails-container"
        onClick={() => {
          onEdit();
        }}
      >
        <img
          className="userImg"
          src={currentUser.profilepic}
          alt="ProfilePic"
        />
        <h6 className="username" style={{ paddingTop: "5px" }}>
          {currentUser.username}
        </h6>
      </div>
    </div>
  );
};

export default UserDetails;
