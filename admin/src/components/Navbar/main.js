import React from "react";
import NavLogo from "../Images/logo.png";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify"; // Import toastify

export default function Main() {
  const token = localStorage.getItem("jwtToken");
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    toast.success("You have been logged out successfully"); // Add toast notification
    setTimeout(() => {
      window.location.href = "/"; // Navigate to home page after 2 seconds
    }, 2000);
  };

  return (
    <>
      <ToastContainer />
      <nav className="navbar bg-body-tertiary shadow-lg">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link className="navbar-brand" to="/">
            <img
              src={NavLogo}
              alt="Logo"
              width="110"
              height="80"
              className="d-inline-block align-text-top"
            />
          </Link>
          {token && (
            <button onClick={handleLogout} className="btn btn-danger">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
