import React, { useState } from "react";
import profilePic from "../../assets/user.jpeg";
import { IoIosClose } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import "./AddContact.css";
import { toast } from "react-toastify";

const AddContact = ({ onClose }) => {
  const [formData, setFormData] = useState({
    searchedName: "",
  });
  const [searchedUser, setSearchedUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSearch = async (e) => {
    const { searchedName } = formData;

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", searchedName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setSearchedUser(querySnapshot.docs[0].data());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      if (!searchedUser || searchedUser.id === currentUser.id) {
        toast.error("Cannot proceed with this user");
        return;
      }
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, searchedUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          isSeen: true,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          isSeen: true,
          lastMessage: "",
          receiverId: searchedUser.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="form-container">
      <IoIosClose className="close-icon" size="30px" onClick={onClose} />
      <h2 className="form-title mb-3">Add Contact</h2>
      <form className="custom-form" onSubmit={(e) => e.preventDefault()}>
        <div className="mb-2 search-container">
          <div className="input-wrapper">
            <input
              type="text"
              className="form-control search-input"
              id="searchedName"
              placeholder="Search"
              value={formData.searchedName}
              onChange={handleChange}
            />
            <CiSearch
              className="search-icon"
              style={{ cursor: "pointer" }}
              onClick={handleSearch}
            />
          </div>
        </div>
      </form>
      {searchedUser && (
        <div className="form-floating mb-3 add-contactCard">
          <img
            className="add-profilepic"
            src={searchedUser.profilepic}
            alt=""
          />
          <h6>{searchedUser.username}</h6>
          <IoIosAddCircle size="30px" color="#724ff9" onClick={handleAdd} />
        </div>
      )}
    </div>
  );
};

export default AddContact;
