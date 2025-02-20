import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import HomePage from "./components/home/HomePage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/home", element: <HomePage /> },
]);

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  console.log(currentUser);

  if (isLoading)
    return (
      <div
        className="spinner-border"
        role="status"
        style={{ color: "#724ff9" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
