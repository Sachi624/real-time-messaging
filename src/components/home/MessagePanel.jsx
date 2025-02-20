import React, { useEffect, useState } from "react";
import ChatHeader from "../reusable/ChatHeader";
import MessageInput from "../reusable/MessageInput";
import Message from "../reusable/Message";
import {
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import "./MessagePanel.css";

const MessagePanel = ({ onDisplay }) => {
  const [chat, setChat] = useState([]);
  const { currentUser } = useUserStore();
  const { chatId, user } = useChatStore();

  useEffect(() => {
    if (!chatId) return;

    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => unSub();
  }, [chatId]);

  const handleSend = async (text, img) => {
    if (!text && !img.file) return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatSnapshot = await getDoc(userChatRef);

        if (userChatSnapshot.exists()) {
          const userChatsData = userChatSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (chat) => chat.chatId === chatId
          );
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
          userChatsData.chats[chatIndex].lastMessageTime = new Date();

          await updateDoc(userChatRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className="message-panel">
      <ChatHeader onDisplay={onDisplay} />
      <div className="message-section">
        {chat?.messages?.map((message) => {
          return (
            <Message
              key={message?.createdAt}
              isOwn={message.senderId === currentUser?.id ? true : false}
              messageInfo={message.img || message.text}
              isImage={Boolean(message.img)}
              messageTime={message.createdAt}
            />
          );
        })}
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default MessagePanel;
