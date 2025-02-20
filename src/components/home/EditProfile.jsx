import React, { useState } from "react";
import { useUserStore } from "../../lib/userStore";
import profilePic from "../../assets/user.jpeg";
import { toast } from "react-toastify";
import { editProfileSchema } from "../../validations/EditProfileValidation";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import upload from "../../lib/upload";
import "./EditProfile.css";

const EditProfile = ({ onClose }) => {
  const { currentUser } = useUserStore();
  const [formData, setFormData] = useState({
    username: currentUser.username,
    about: currentUser.about,
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState({
    file: null,
    url: currentUser.profilepic,
  });

  const handleImageUpdate = (e) => {
    if (e.target.files[0]) {
      setProfilePicture({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { username, about } = formData;

    try {
      await editProfileSchema.validate(formData, {
        abortEarly: false,
      });

      if (profilePicture.file) {
        const imgURL = await upload(profilePicture.file);
        await updateDoc(doc(db, "users", currentUser.id), {
          profilepic: imgURL,
        });
      }

      await updateDoc(doc(db, "users", currentUser.id), {
        username,
        about,
      });

      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title mb-3">Edit Profile</h2>
      <form className="custom-form" onSubmit={handleSubmit}>
        <div className="mb-2 edit-profile-image">
          <img
            className="userImageSelect"
            src={profilePicture.url || profilePic}
            onClick={() => {
              document.getElementById("formFile").click();
            }}
          />
          <input
            type="file"
            id="formFile"
            style={{ display: "none" }}
            onChange={handleImageUpdate}
          />
        </div>
        <div className="form-floating mb-2">
          <input
            type="text"
            className={`form-control ${
              errors?.username ? "contain-error" : "custom-input"
            }`}
            id="username"
            placeholder="sample"
            onChange={handleChange}
            value={formData.username}
          />
          <label htmlFor="username">Username</label>
          {errors?.username && (
            <div className="text-danger">{errors.username}</div>
          )}
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className={`form-control ${
              errors?.about ? "contain-error" : "custom-input"
            }`}
            id="about"
            placeholder="sampleAbout"
            onChange={handleChange}
            value={formData.about || ""}
          />
          <label htmlFor="about">About</label>
          {errors?.about && <div className="text-danger">{errors.about}</div>}
        </div>

        <div className="row mb-3" style={{ width: "100%" }}>
          <div className="col">
            <button
              className="btn btn-secondary custom-btn"
              style={{
                width: "100%",
              }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-primary custom-btn"
              style={{ width: "100%" }}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
