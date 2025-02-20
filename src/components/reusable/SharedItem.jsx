import React from "react";
import { IoMdDownload } from "react-icons/io";
import "./SharedItem.css";

const SharedItem = ({ message }) => {
  const handleDownload = () => {
    window.open(message.img);
  };

  return (
    <div className="shared-item-container">
      <img src={message.img} alt="" />
      <p>{message.img.toString()}</p>
      <IoMdDownload onClick={handleDownload} />
    </div>
  );
};

export default SharedItem;
