import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/main";
import * as Realm from "realm-web";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Spinner from "../Spinner/main";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";

export default function UpdateCompany() {
  const [companyData, setCompanyData] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null); // Store the selected company
  const [updatedCompany, setUpdatedCompany] = useState({}); // Store the updated company data
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second delay
  }, []);

  useEffect(() => {
    async function fetchData() {
      const app = new Realm.App({ id: "application-0-cocosmt" });
      const credentials = Realm.Credentials.anonymous();
      try {
        const user = await app.logIn(credentials);
        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongodb.db("transportapp").collection("entry");
        const data = await collection.find({});
        setCompanyData(data);
      } catch (err) {
        console.error("Failed to Fetch Data:", err);
      }
    }

    fetchData();
  }, []);

  const handleUpdateDetails = (company) => {
    setSelectedCompany(company); // Set selected company to prefill form
    setUpdatedCompany(company); // Prefill the form with current company details
    const modal = new window.bootstrap.Modal(
      document.getElementById("updateModal")
    );
    modal.show();
  };

  const handleGroupInputChange = (e, index) => {
    const { name, value } = e.target;
    const groups = [...updatedCompany.groups];
    groups[index] = { ...groups[index], [name]: value };
    setUpdatedCompany({ ...updatedCompany, groups });
  };

  const handleDeleteGroup = (index) => {
    const groups = [...updatedCompany.groups];
    groups.splice(index, 1);
    setUpdatedCompany({ ...updatedCompany, groups });
  };

  const handleAddGroup = () => {
    const groups = [...updatedCompany.groups];
    groups.push({ transporterName: "", location: "", rate: "" });
    setUpdatedCompany({ ...updatedCompany, groups });
  };
  // Handle input change for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCompany({ ...updatedCompany, [name]: value.toUpperCase() });
  };

  const handleDeleteEntry = async (id) => {
    const app = new Realm.App({ id: "application-0-cocosmt" });
    const credentials = Realm.Credentials.anonymous();
    try {
      const user = await app.logIn(credentials);
      const mongodb = app.currentUser.mongoClient("mongodb-atlas");
      const collection = mongodb.db("transportapp").collection("entry");

      await collection.deleteOne({ _id: id });
      alert("Entry Deleted Successfully!");
      setCompanyData(companyData.filter((company) => company._id !== id));
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  const handleUpdateSubmit = async () => {
    const app = new Realm.App({ id: "application-0-cocosmt" });
    const credentials = Realm.Credentials.anonymous();
    try {
      const user = await app.logIn(credentials);
      const mongodb = app.currentUser.mongoClient("mongodb-atlas");
      const collection = mongodb.db("transportapp").collection("entry");

      // Update the verified field to "no" along with other updates
      await collection.updateOne(
        { _id: selectedCompany._id }, // Match by company ID
        {
          $set: {
            ...updatedCompany, // Spread existing updates
            verified: "no", // Set verified to "no"
            updatedAt: new Date(), // Set updatedAt to current date and time
          },
        }
      );

      alert("Details Updated! Entry Marked as Not Verified");
      setCompanyData(
        companyData.map((company) =>
          company._id === selectedCompany._id
            ? { ...updatedCompany, verified: "no", updatedAt: new Date() }
            : company
        )
      );
    } catch (err) {
      console.error("Failed to update company details:", err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit Entry - Prem Industries India Limited</title>
        <meta name="description" content="Prem Industries India Limited" />
      </Helmet>
      <Navbar />
      {/* <ToastContainer /> */}
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="container mb-5 pb-5">
            <div className="row">
              <div className="col-md-12 text-center pt-3 mt-5">
                <div className="container">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <h4
                        data-aos="fade-up"
                        data-aos-delay="300"
                        data-aos-once="true"
                      >
                        <Link
                          to="/dashboard"
                          style={{ textDecoration: "none", color: "red" }}
                        >
                          <i className="fa-solid fa-arrow-left-long"></i> Back
                          to Dashboard
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
                          to="/new-entry"
                          style={{ textDecoration: "none", color: "red" }}
                        >
                          Add New Entry{" "}
                          <i className="fa-solid fa-arrow-right-long"></i>
                        </Link>
                      </h4>
                    </div>
                  </div>
                  <div className="row card-container">
                    {companyData === null ? (
                      <h4 className="mt-5">Loading data...</h4>
                    ) : companyData.length === 0 ? (
                      <h4
                        className="mt-5 text-danger"
                        data-aos="fade-up"
                        data-aos-delay="500"
                        data-aos-once="true"
                      >
                        No Entry Available In Database
                      </h4>
                    ) : (
                      companyData
                        ?.slice()
                        ?.reverse()
                        .map((company, index) => (
                          <div className="col-md-12" key={index}>
                            <div
                              className="card shadow-sm"
                              data-aos="fade-up"
                              data-aos-delay="500"
                              data-aos-once="true"
                              style={{ margin: "10px", width: "100%" }}
                            >
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-md-4">
                                    <h3
                                      data-aos="fade-up"
                                      data-aos-delay="600"
                                      data-aos-once="true"
                                    >
                                      {company.truckNumber}
                                    </h3>
                                    <h4
                                      className="pt-2"
                                      style={{
                                        color:
                                          company?.verified === "yes"
                                            ? "green"
                                            : "red",
                                      }}
                                    >
                                      {company?.verified === "yes"
                                        ? "Verified"
                                        : "Not Verified Yet"}
                                    </h4>
                                    <p className="mt-5">
                                      Created At:{" "}
                                      <b>
                                        {new Date(
                                          company.createdAt
                                        ).toLocaleString("en-US", {
                                          year: "numeric",
                                          month: "2-digit",
                                          day: "2-digit",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          second: "2-digit",
                                          hour12: true, // Set to false for 24-hour format
                                        })}
                                      </b>
                                    </p>
                                    <p className="mt-2">
                                      Last Update:{" "}
                                      <b>
                                        {company.updatedAt
                                          ? new Date(
                                              company.updatedAt
                                            ).toLocaleString("en-US", {
                                              year: "numeric",
                                              month: "2-digit",
                                              day: "2-digit",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              second: "2-digit",
                                              hour12: true, // Set to false for 24-hour format
                                            })
                                          : "Not Updated Yet"}
                                      </b>
                                    </p>
                                  </div>
                                  <div className="col-md-4">
                                    <h4>Truck Size</h4>
                                    <p>{company.truckSize} Foot</p>
                                    <h4 className="mt-5">Truck Weight</h4>
                                    <p>{company.truckWeight} KG</p>
                                  </div>
                                  <div className="col-md-4">
                                    <br />
                                    <button
                                      data-aos="fade-up"
                                      data-aos-delay="600"
                                      data-aos-once="true"
                                      className="btn btn-danger btn-lg"
                                      onClick={() =>
                                        handleDeleteEntry(company._id)
                                      }
                                    >
                                      Delete this Entry
                                    </button>
                                    <br />
                                    <button
                                      data-aos="fade-up"
                                      data-aos-delay="700"
                                      data-aos-once="true"
                                      className="btn btn-primary btn-lg mt-4"
                                      onClick={() =>
                                        handleUpdateDetails(company)
                                      }
                                    >
                                      Update Entry Details
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal for updating company details */}
          <div
            className="modal fade"
            id="updateModal"
            tabIndex="-1"
            aria-labelledby="updateModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="updateModalLabel">
                    Vehicle{" "}
                    <span className="text-danger">
                      {selectedCompany?.truckNumber}
                    </span>
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {selectedCompany && (
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          <b>Truck Number</b>
                          <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="truckNumber"
                          value={updatedCompany.truckNumber || ""}
                          onChange={handleInputChange}
                          style={{ textTransform: "uppercase" }}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          <b>Truck Size</b>
                          <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="truckSize"
                          value={updatedCompany.truckSize || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          <b>Truck Weight</b>
                          <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="truckWeight"
                          value={updatedCompany.truckWeight || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          <b>Created At</b>
                          <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="createdAt"
                          value={updatedCompany.createdAt || ""}
                          onChange={handleInputChange}
                          disabled
                        />
                      </div>
                      <h4
                        className="pt-2 text-center"
                        style={{
                          color:
                            updatedCompany?.verified === "yes"
                              ? "green"
                              : "red",
                        }}
                      >
                        {updatedCompany?.verified === "yes"
                          ? "Verified"
                          : "Not Verified Yet"}
                      </h4>
                      {/* <h5
                        className="pt-2 text-center"
                        style={{
                          color: updatedCompany?.verified ? "green" : "red",
                        }}
                      >
                        {updatedCompany?.verified ? "Verified" : "Not Verified"}
                      </h5> */}
                      {updatedCompany.groups.map((group, index) => (
                        <div key={index}>
                          <hr className="mt-4 mb-4" />
                          <div className="mb-3">
                            <label className="form-label">
                              <b>Transporter Name</b>
                              <span className="text-danger"> *</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="transporterName"
                              value={group.transporterName || ""}
                              onChange={(e) => handleGroupInputChange(e, index)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              <b>Location</b>
                              <span className="text-danger"> *</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="location"
                              value={group.location || ""}
                              onChange={(e) => handleGroupInputChange(e, index)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              <b>Rate</b>
                              <span className="text-danger"> *</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="rate"
                              value={group.rate || ""}
                              onChange={(e) => handleGroupInputChange(e, index)}
                            />
                          </div>
                          <button
                            type="button"
                            className="btn btn-danger w-100"
                            onClick={() => handleDeleteGroup(index)}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-primary mt-3 w-100"
                        onClick={handleAddGroup}
                      >
                        Add More Details
                      </button>
                    </form>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    Close Details
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleUpdateSubmit}
                  >
                    Update Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
