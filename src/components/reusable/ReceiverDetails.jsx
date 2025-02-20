import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { onSnapshot } from "firebase/firestore";
import Accordion from "react-bootstrap/Accordion";
import "./ReceiverDetails.css";
import SharedItem from "./SharedItem";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "./../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const ReceiverDetails = ({ onCloseDetails }) => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();
  const [chat, setChat] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!chatId) return;

    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => unSub();
  }, [chatId]);

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="re-details-container">
      <div className="close-icon-container">
        <IoIosClose size="30px" onClick={onCloseDetails} />
      </div>
      {user && (
        <div className="receiver-details">
          <img className="receiver-img" src={user?.profilepic} alt="" />
          <h5 className="receiver-name">{user?.username}</h5>
          <p>{user.about ? user.about : "About"}</p>
        </div>
      )}
      <div className="shared-media">
        <Accordion className="custom-accordion" defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Shared Media</Accordion.Header>
            <Accordion.Body>
              {chat?.messages
                ?.filter((message) => message.img)
                .map((message, index) => (
                  <SharedItem key={index} message={message} />
                ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      <div className="action-container">
        <button className="btn btn-danger block-button" onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "Reciever has blocked you"
            : isReceiverBlocked
            ? "Unblock"
            : "Block"}
        </button>
        <button
          className="btn btn-primary logout-button"
          style={{ backgroundColor: "#724ff9" }}
          onClick={() => {
            auth.signOut();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ReceiverDetails;
