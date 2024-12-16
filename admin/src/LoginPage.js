import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Realm from "realm-web";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar/main";

const LoginPage = () => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Initialize Realm app
    const app = new Realm.App({ id: "application-0-cocosmt" });
    const credentials = Realm.Credentials.anonymous();

    try {
      const user = await app.logIn(credentials);
      const mongo = user.mongoClient("mongodb-atlas");
      const collection = mongo.db("cashtracker").collection("admin");

      // Fetch user data from the database
      const userData = await collection.findOne({ username: userID });

      // Validate password
      if (userData && userData.password === password) {
        // Fetch the token from the database
        const tokenData = await mongo
          .db("cashtracker")
          .collection("tokens")
          .findOne({});
        const fakeToken = tokenData.admin; // Assuming the token is stored in a collection named 'tokens'

        localStorage.setItem("jwtToken", fakeToken); // Save JWT token
        toast.success("Welcome Back Admin");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000); // wait 2 seconds before navigating
      } else {
        toast.error("Invalid username or password");
      }
    } catch (err) {
      console.error("Failed to log in", err);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="container d-flex flex-column align-items-center justify-content-center mt-5 pt-5">
        <div className="row w-100">
          <div className="col-md-5 d-flex align-items-center justify-content-center">
            <h1
              className="mb-4"
              data-aos="fade-up"
              data-aos-delay="500"
              data-aos-once="true"
              style={{ color: "#E92328" }}
            >
              Admin Login
            </h1>
          </div>
          <div className="col-md-7 d-flex align-items-center justify-content-center">
            {/* Login form */}
            <form
              onSubmit={handleLogin}
              className="w-100 shadow-lg p-5 rounded"
              style={{ backgroundColor: "#14254C" }}
            >
              <div
                className="mb-3"
                data-aos="fade-up"
                data-aos-delay="600"
                data-aos-once="true"
              >
                <label
                  htmlFor="userID"
                  className="form-label text-white"
                  style={{ fontSize: "18px" }}
                >
                  Username<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="userID"
                  value={userID}
                  onChange={(e) => setUserID(e.target.value)}
                  required
                />
              </div>
              <div
                className="mb-3"
                data-aos="fade-up"
                data-aos-delay="700"
                data-aos-once="true"
              >
                <label
                  htmlFor="password"
                  className="form-label text-white"
                  style={{ fontSize: "18px" }}
                >
                  Password<span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-success w-100"
                data-aos="fade-up"
                data-aos-delay="800"
                data-aos-once="true"
              >
                <i className="fa-solid fa-lock"></i> Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
