import React from "react";
import profilePic from "../../assets/user.jpeg";
import { IoMdMore } from "react-icons/io";
import "./ChatHeader.css";
import { useChatStore } from "../../lib/chatStore";

const ChatHeader = ({ onDisplay }) => {
  const { user } = useChatStore();
  return (
    <div className="chatheader-container">
      {user && (
        <img
          src={user?.profilepic}
          alt=""
          style={{ width: "45px", height: "45px", borderRadius: "50%" }}
        />
      )}
      <p className="username-text">{user?.username}</p>
      <IoMdMore size="25px" onClick={onDisplay} style={{ cursor: "pointer" }} />
    </div>
  );
};

export default ChatHeader;
