import React from "react";
import "./Message.css";

const Message = ({ isOwn, messageInfo, isImage, messageTime }) => {
  const formatTimeStamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "";
    const date = new Date(timestamp.seconds * 1000);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <>
      {!isImage ? (
        <div className={`message-container ${isOwn ? "own" : "recieved"}`}>
          <p>{messageInfo}</p>
        </div>
      ) : (
        <div className={`image-container ${isOwn ? "own" : "recieved"}`}>
          <img src={messageInfo} alt="placeholder" className="image-message" />
        </div>
      )}
      <p className={`time-stamp ${isOwn ? "own" : "recieved"}`}>
        {formatTimeStamp(messageTime)}
      </p>
    </>
  );
};

export default Message;
