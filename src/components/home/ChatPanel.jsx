import React, { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useUserStore } from "../../lib/userStore";
import ContactCard from "../reusable/ContactCard";
import { db } from "../../lib/firebase";
import { useChatStore } from "./../../lib/chatStore";
import "./ChatPanel.css";

const ChatPanel = ({
  displayAllMsg,
  onAddContact,
  onDisplayAllMsg,
  onDisplayUnreadMsg,
}) => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        const sortedChats = chatData.sort((a, b) => b.updatedAt - a.updatedAt);
        setChats(sortedChats);

        setFilteredChats(
          displayAllMsg
            ? sortedChats
            : sortedChats.filter((item) => !item.isSeen)
        );
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id, displayAllMsg]);

  useEffect(() => {
    setFilteredChats(
      displayAllMsg ? chats : chats.filter((item) => !item.isSeen)
    );
  }, [displayAllMsg, chats]);

  const handleSelect = async (chat) => {
    setSelectedChatId(chat.chatId);
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userChats[chatIndex].isSeen = true;
    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chat-panel-container">
      <div className="add-section">
        <button
          className={`filter-btn ${displayAllMsg ? "selected" : ""}`}
          onClick={onDisplayAllMsg}
        >
          All
        </button>
        <button
          className={`filter-btn ${displayAllMsg ? "" : "selected"}`}
          onClick={onDisplayUnreadMsg}
        >
          Unread
        </button>
        <IoIosAddCircle
          className="add-icon"
          size="35px"
          color="#724ff9"
          onClick={onAddContact}
        />
      </div>
      <div className="chat-panel-content">
        {filteredChats.map((chat) => {
          return (
            <ContactCard
              key={chat.chatId}
              chat={chat}
              onSelect={handleSelect}
              isLastMsgSeen={chat?.isSeen}
              isSelected={selectedChatId === chat.chatId}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChatPanel;
