import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { GrEmoji } from "react-icons/gr";
import { CiImageOn } from "react-icons/ci";
import EmojiPicker from "emoji-picker-react";
import { useChatStore } from "../../lib/chatStore";

const MessageInput = ({ onSend }) => {
  const { isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState({
    file: null,
    url: "",
  });

  const handleEmojiSelect = (e) => {
    setMessage((prev) => prev + e.emoji);
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      const imgObj = {
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      };
      setImage(imgObj);
      onSend("", imgObj);
      setImage({
        file: null,
        url: "",
      });
    }
  };

  const handleSend = () => {
    onSend(message.trim(), image);
    setMessage("");
    setImage({
      file: null,
      url: "",
    });
  };

  return (
    <>
      <div className="input-box">
        <div className="input-container">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          >
            <IoMdSend size="18px" color="white" />
          </button>
          <div className="emoji">
            <button className="emoji-button">
              <GrEmoji
                size="28px"
                color="black"
                onClick={() => {
                  setOpenEmojiPicker(!openEmojiPicker);
                }}
              />
            </button>
            <div className="picker">
              {openEmojiPicker && (
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              )}
            </div>
          </div>
          <div>
            <label className="img-uploader-btn" htmlFor="file">
              <CiImageOn size="28px" color="black" />
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleImage}
              disabled={isCurrentUserBlocked || isReceiverBlocked}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageInput;
