import React, { useState, useEffect } from "react";
import * as Realm from "realm-web";
import Navbar from "../Navbar/main";
import { Link } from "react-router-dom";
import Spinner from "../Spinner/main";
import { Helmet } from "react-helmet";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";

export default function Main() {
  const [truckData, setTruckData] = useState({
    truckNumber: "",
    truckSize: "",
    truckWeight: "",
    groups: [{ location: "", rate: "", transporterName: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second delay
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTruckData((prevData) => ({
      ...prevData,
      [name]: name === "truckNumber" ? value.toUpperCase() : value,
    }));
  };

  const handleGroupChange = (index, e) => {
    const { name, value } = e.target;
    setTruckData((prevData) => {
      const newGroups = [...prevData.groups];
      newGroups[index][name] = value;
      return { ...prevData, groups: newGroups };
    });
  };

  const addMoreGroup = () => {
    setTruckData((prevData) => ({
      ...prevData,
      groups: [
        ...prevData.groups,
        { location: "", rate: "", transporterName: "" },
      ],
    }));
  };

  const removeGroup = (index) => {
    setTruckData((prevData) => ({
      ...prevData,
      groups: prevData.groups.filter((_, groupIndex) => groupIndex !== index),
    }));
  };

  const resetForm = () => {
    setTruckData({
      truckNumber: "",
      truckSize: "",
      truckWeight: "",
      groups: [{ location: "", rate: "", transporterName: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true
    try {
      // MongoDB Realm connection
      const app = new Realm.App({ id: "application-0-cocosmt" });
      const credentials = Realm.Credentials.anonymous();
      const user = await app.logIn(credentials);

      const mongo = user.mongoClient("mongodb-atlas");
      const collection = mongo.db("transportapp").collection("entry");

      // Check if the truck number already exists
      const existingTruck = await collection.findOne({
        truckNumber: truckData.truckNumber,
      });
      if (existingTruck) {
        alert(
          "Vehicle number already exists. Please use a different vehicle number."
        );
        return; // Stop the submission process
      }

      // Insert data into MongoDB
      await collection.insertOne({
        truckNumber: truckData.truckNumber,
        truckSize: truckData.truckSize,
        truckWeight: truckData.truckWeight,
        groups: truckData.groups,
        createdAt: new Date(),
        verified: "no",
      });

      // toast.success("Data Submitted Successfully");
      alert("Entry Submitted Successfully");
      resetForm(); // Reset form fields after successful submission
    } catch (error) {
      console.error("Error submitting data:", error);
      // toast.error("Failed to Submit Data");
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <>
      <Navbar />
      <Helmet>
        <title>New Entry - Prem Industries India Limited</title>
        <meta name="description" content="Prem Industries India Limited" />
      </Helmet>
      {/* <ToastContainer /> */}
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="container pt-3 mt-5 mb-5 pb-5">
            <div className="row">
              <div className="col-md-6 text-center">
                <h4
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-once="true"
                >
                  <Link
                    to="/dashboard"
                    style={{ textDecoration: "none", color: "red" }}
                  >
                    <i className="fa-solid fa-arrow-left-long"></i> Back to
                    Dashboard
                  </Link>
                </h4>
              </div>
              <div className="col-md-6 text-center">
                <h4
                  data-aos="fade-up"
                  data-aos-delay="400"
                  data-aos-once="true"
                >
                  <Link
                    to="/edit-entry"
                    style={{ textDecoration: "none", color: "red" }}
                  >
                    Check all Entries{" "}
                    <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                </h4>
              </div>
            </div>
          </div>
          <div className="container mt-3">
            <form onSubmit={handleSubmit}>
              <div
                className="row"
                data-aos="fade-up"
                data-aos-delay="500"
                data-aos-once="true"
              >
                <div className="form-group">
                  <label>
                    <b>
                      Vehicle Number <span className="text-danger">*</span>
                    </b>
                  </label>
                  <input
                    type="text"
                    name="truckNumber"
                    value={truckData.truckNumber}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-6">
                  <div
                    className="form-group"
                    data-aos="fade-up"
                    data-aos-delay="550"
                    data-aos-once="true"
                  >
                    <label>
                      <b>
                        Vehicle Size (in Foot){" "}
                        <span className="text-danger">*</span>
                      </b>
                    </label>
                    <input
                      type="text"
                      name="truckSize"
                      value={truckData.truckSize}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="form-group"
                    data-aos="fade-up"
                    data-aos-delay="600"
                    data-aos-once="true"
                  >
                    <label>
                      <b>
                        Vehicle Weight (in KG){" "}
                        <span className="text-danger">*</span>
                      </b>
                    </label>
                    <input
                      type="text"
                      name="truckWeight"
                      value={truckData.truckWeight}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <h3
                className="text-center mt-4 mb-4 text-danger"
                data-aos="fade-up"
                data-aos-delay="700"
                data-aos-once="true"
              >
                Transport Details
              </h3>
              {truckData.groups.map((group, index) => (
                <div
                  key={index}
                  className="row"
                  data-aos="fade-up"
                  data-aos-delay="500"
                  data-aos-once="true"
                >
                  <div className="col-md-3 text-center">
                    <label>
                      <b>
                        Location <span className="text-danger">*</span>
                      </b>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={group.location}
                      onChange={(e) => handleGroupChange(index, e)}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-3 text-center">
                    <label>
                      <b>
                        Rate <span className="text-danger">*</span>
                      </b>
                    </label>
                    <input
                      type="number"
                      name="rate"
                      value={group.rate}
                      onChange={(e) => handleGroupChange(index, e)}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-3 text-center">
                    <label>
                      <b>
                        Transporter Name <span className="text-danger">*</span>
                      </b>
                    </label>
                    <input
                      type="text"
                      name="transporterName"
                      value={group.transporterName}
                      onChange={(e) => handleGroupChange(index, e)}
                      required
                      className="form-control"
                    />
                  </div>
                  <div
                    className="col-md-3"
                    data-aos="fade-up"
                    data-aos-delay="500"
                    data-aos-once="true"
                  >
                    <button
                      type="button"
                      className="btn btn-danger mt-4"
                      onClick={() => removeGroup(index)}
                    >
                      Remove Row
                    </button>
                  </div>
                </div>
              ))}
              <div className="row">
                <div className="col-md-12 text-center">
                  <button
                    type="button"
                    onClick={addMoreGroup}
                    className="btn btn-primary mt-3 m-2 btn-lg"
                  >
                    Add Rows
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 mb-5 pb-5">
                  <button
                    data-aos="fade-up"
                    data-aos-delay="600"
                    data-aos-once="true"
                    type="submit"
                    className="btn btn-success mt-3 m-2 btn-lg w-100"
                    disabled={isSubmitting} // Disable button while submitting
                  >
                    {isSubmitting ? "Submitting..." : "Save Entry"}{" "}
                    {/* Button text */}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
