import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { loginSchema } from "../../validations/LoginValidation";
import "./AuthCommon.css";

const Login = () => {
  const { currentUser, fetchUserInfo } = useUserStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password } = formData;

    try {
      await loginSchema.validate(formData, {
        abortEarly: false,
      });
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      toast.success("User logged in successfully!");
      await fetchUserInfo(userCredential.user.uid);
      navigate("/home");
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
      <h2 className="form-title mb-3">Login</h2>
      <form className="custom-form" onSubmit={handleSubmit}>
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
        <div className="form-floating mb-3">
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
        <div className="mb-3" style={{ width: "100%" }}>
          <button
            className="btn btn-primary custom-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading" : "Login"}
          </button>
        </div>
      </form>
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <p style={{ margin: 0, color: "#6c757d", fontSize: "14px" }}>
          Don't have an account yet?
        </p>
        <Link className="link-btn" to={"/register"}>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
