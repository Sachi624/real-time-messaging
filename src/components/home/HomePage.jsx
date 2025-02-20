import React, { useState } from "react";
import UserDetails from "./UserDetails";
import EditProfile from "./EditProfile";
import ChatPanel from "./ChatPanel";
import MessagePanel from "./MessagePanel";
import ReceiverDetails from "../reusable/ReceiverDetails";
import AddContact from "./AddContact";
import { useChatStore } from "../../lib/chatStore";
import message from "../../assets/message.svg";
import "./HomePage.css";

const HomePage = () => {
  const { user } = useChatStore();
  const [displayAllMsg, setDisplayAllMsg] = useState(true);
  const [isEditing, setEditing] = useState(false);
  const [isDisplayDetails, setDisplayDetails] = useState(false);
  const [isAddContactMode, setAddContactMode] = useState(false);
  const { chatId } = useChatStore();

  const handleDisplayAllMsg = () => {
    setDisplayAllMsg(true);
    console.log("display all msg");
  };

  const handleDisplayUnreadMsg = () => {
    setDisplayAllMsg(false);
    console.log("display unread msg");
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCloseEdit = () => {
    setEditing(false);
  };

  const handleDisplayDetails = () => {
    setDisplayDetails(true);
  };

  const handleHideDetails = () => {
    setDisplayDetails(false);
  };

  const handleAddContact = () => {
    setAddContactMode(true);
  };

  const handleHideAddContact = () => {
    setAddContactMode(false);
  };

  return (
    <>
      <div
        className={`homepage-container ${
          isEditing || isAddContactMode ? "blured" : ""
        }`}
      >
        <UserDetails onEdit={handleEdit} />
        <div className="row g-0">
          <div className="col-3 left-panel">
            <ChatPanel
              displayAllMsg={displayAllMsg}
              onAddContact={handleAddContact}
              onDisplayAllMsg={handleDisplayAllMsg}
              onDisplayUnreadMsg={handleDisplayUnreadMsg}
            />
          </div>
          <div className="col right-panel">
            {!user ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <img
                  src={message}
                  alt=""
                  style={{
                    width: "50px",
                    height: "50px",
                    marginRight: "10px",
                  }}
                />
                <h1>Welcome to Chatty!</h1>
              </div>
            ) : isDisplayDetails ? (
              <div className="row g-0">
                <div className="col col-8">
                  <MessagePanel onHideDetails={handleHideDetails} />
                </div>
                <div className="col col-4">
                  <ReceiverDetails onCloseDetails={handleHideDetails} />
                </div>
              </div>
            ) : (
              <MessagePanel onDisplay={handleDisplayDetails} />
            )}
          </div>
        </div>
      </div>
      {isEditing && (
        <>
          <div className="parent-overlay"></div>
          <EditProfile onClose={handleCloseEdit} />
        </>
      )}
      {isAddContactMode && (
        <>
          <div className="parent-overlay"></div>
          <AddContact onClose={handleHideAddContact} />
        </>
      )}
    </>
  );
};

export default HomePage;
