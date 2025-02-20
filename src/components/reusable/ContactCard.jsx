import React, { useState } from "react";
import "./ContactCard.css";

const ContactCard = ({ chat, onSelect, isLastMsgSeen, isSelected }) => {
  const formatTimeStamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "";

    const date = new Date(timestamp.seconds * 1000);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div
      className={`contact-card ${isLastMsgSeen ? "" : "unread"} ${
        isSelected ? "selected" : ""
      }`}
      onClick={() => onSelect(chat)}
    >
      <img className="contact-img" src={chat.user.profilepic} alt="" />
      <div className="middle-section">
        <p className="username-text">{chat.user.username}</p>
        <p className="last-msg">{chat.lastMessage}</p>
      </div>
      <p className="lastmsg-time">
        {`${chat.lastMessage ? formatTimeStamp(chat.lastMessageTime) : ""}`}
      </p>
    </div>
  );
};

export default ContactCard;
