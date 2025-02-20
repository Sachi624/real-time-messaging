import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import profilePicPath from "../../assets/user.jpeg";
import upload from "../../lib/upload";
import { registerSchema } from "../../validations/RegisterValidation";
import "./AuthCommon.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { username, email, password } = formData;

    try {
      await registerSchema.validate(formData, {
        abortEarly: false,
      });
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const response = await fetch(profilePicPath);
      const blob = await response.blob();
      const file = new File([blob], "user.jpeg", { type: blob.type });
      const imgURL = await upload(file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        profilepic: imgURL,
        id: res.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      toast.success("User registered successfully!");
      navigate("/");
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
      <h2 className="form-title mb-3">Signup</h2>
      <form className="custom-form" onSubmit={handleSubmit}>
        <div className="form-floating mb-2">
          <input
            type="text"
            className={`form-control ${
              errors?.username ? "contain-error" : "custom-input"
            }`}
            id="username"
            placeholder="sample"
            value={formData.username}
            onChange={handleChange}
          />
          <label htmlFor="username">Username</label>
          {errors?.username && (
            <div className="text-danger">{errors.username}</div>
          )}
        </div>
        <div className="form-floating mb-2">
          <input
            type="text"
            className={`form-control ${
              errors?.email ? "contain-error" : "custom-input"
            }`}
            id="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
          {errors?.email && <div className="text-danger">{errors.email}</div>}
        </div>
        <div className="form-floating mb-2">
          <input
            type="password"
            className={`form-control ${
              errors?.password ? "contain-error" : "custom-input"
            }`}
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          {errors?.password && (
            <div className="text-danger">{errors.password}</div>
          )}
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className={`form-control ${
              errors?.rePassword ? "contain-error" : "custom-input"
            }`}
            id="rePassword"
            placeholder="Password"
            value={formData.rePassword}
            onChange={handleChange}
          />
          <label htmlFor="rePassword">Confirm Password</label>
          {errors?.rePassword && (
            <div className="text-danger">{errors.rePassword}</div>
          )}
        </div>
        <div className="mb-3" style={{ width: "100%" }}>
          <button
            className="btn btn-primary custom-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading" : "Signup"}
          </button>
        </div>
      </form>
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <p style={{ margin: 0, color: "#6c757d", fontSize: "14px" }}>
          Already have an account?
        </p>
        <Link className="link-btn" to={"/"}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
