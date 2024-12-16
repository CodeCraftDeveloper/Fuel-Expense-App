import React, { useEffect, useState } from "react";
import { App, Credentials } from "realm-web"; // Import the Realm App and Credentials
import Navbar from "../Navbar/main";
import Spinner from "../Spinner/main";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const app = new App({ id: "application-0-cocosmt" }); // Initialize Realm App

export default function Main() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    personposition: "", // New field added
    totalmoney: 0,
    accbalance: 0,
    // balused: 0,
    // balremaining: 0,
    transactions: [],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second loading

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const login = async () => {
    const user = await app.logIn(Credentials.anonymous()); // Use Credentials from realm-web
    return user;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // User should be logged in before saving data
    const user = await login(); // Ensure user is logged in
    const mongodb = user.mongoClient("mongodb-atlas");
    const collection = mongodb.db("cashtracker").collection("userdata");

    // Check if the username already exists
    const existingUser = await collection.findOne({
      username: formData.username,
    });

    if (existingUser) {
      // Username already exists, show alert
      window.alert("Username not available. Please choose another one.");
      return; // Exit the function
    }

    // Save the formData to MongoDB with createdAt timestamp
    try {
      const result = await collection.insertOne({
        ...formData,
        createdAt: new Date(), // Add createdAt field with the current date and time
      });
      window.alert("New Account Created!");
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      // Reset form data after alert is dismissed
      setFormData({
        name: "",
        username: "",
        password: "",
        personposition: "",
        totalmoney: 0,
        accbalance: 0,
        transactions: [],
      });
    }
  };

  // if (loading) {
  //   return (
  //     <>
  //       <Navbar />
  //       <Spinner />
  //     </>
  //   );
  // }

  return (
    <>
      <Helmet>
        <title>New Account - Cash Tracker</title>
        <meta name="description" content="Prem Industries Cash Tracker" />
      </Helmet>
      <Navbar />
      <div className="container mt-5 mb-5 pb-5">
        <div className="row mb-3">
          <div className="col-md-12 text-end">
            <Link
              to="/dashboard"
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-once="true"
            >
              <button className="btn btn-primary btn-lg">
                <i class="fa-solid fa-users"></i> Back to Accounts
              </button>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h2
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="500"
              data-aos-once="true"
            >
              Create New Account
            </h2>
          </div>
        </div>
        <div className="row">
          <form onSubmit={handleSubmit} className="col-md-12">
            <div
              className="form-group mt-2"
              data-aos="fade-up"
              data-aos-delay="600"
              data-aos-once="true"
            >
              <label>
                <b>Person's Name</b>
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div
              className="form-group mt-2"
              data-aos="fade-up"
              data-aos-delay="700"
              data-aos-once="true"
            >
              <label>
                <b>Person's Position</b>
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="personposition" // New input field for person position
                value={formData.personposition}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div
              className="form-group mt-2"
              data-aos="fade-up"
              data-aos-delay="800"
              data-aos-once="true"
            >
              <label>
                <b>Username</b>
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div
              className="form-group mt-2"
              data-aos="fade-up"
              data-aos-delay="900"
              data-aos-once="true"
            >
              <label>
                <b>Password</b>
                <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div
              style={{ display: "flex", justifyContent: "center" }}
              data-aos="fade-up"
              data-aos-delay="1000"
              data-aos-once="true"
            >
              <button
                type="submit"
                className="btn btn-primary btn-lg mt-3 mb-5"
              >
                <i class="fa-solid fa-check"></i> Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
