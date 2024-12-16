import React, { useEffect, useState } from "react";
import { App, Credentials } from "realm-web";
import Navbar from "../Navbar/main";
import Spinner from "../Spinner/main";
import { Link } from "react-router-dom";

const app = new App({ id: "application-0-cocosmt" });

export default function Main() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [accounttransactions, setAccountTransactions] = useState(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showTransactionPopup, setShowtransactionPopup] = useState(false);
  const [ShowmoneyPopup, setShowmoneyPopup] = useState(false);
  const [moneyDetails, setmoneyDetails] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [about, setAbout] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await app.logIn(Credentials.anonymous());
        const mongodb = user.mongoClient("mongodb-atlas");
        const collection = mongodb.db("cashtracker").collection("userdata");

        const results = await collection.find({});
        setData(results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowPopup(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const user = await app.logIn(Credentials.anonymous());
      const mongodb = user.mongoClient("mongodb-atlas");
      const collection = mongodb.db("cashtracker").collection("userdata");

      await collection.deleteOne({ _id: userToDelete._id });

      const results = await collection.find({});
      setData(results);
      setShowPopup(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setUserToDelete(null);
    setShowDetailsPopup(false);
    setAccountDetails(null);
    setShowmoneyPopup(false);
    setmoneyDetails(null);
    setAccountTransactions(null);
    setShowtransactionPopup(false);
    setShowPassword(false);
    setShowImage(false);
    setCurrentImage("");
  };
  const handleAddMoneyClick = (user) => {
    // add money logic here
    setmoneyDetails(user);
    setShowmoneyPopup(true);
  };

  const handleAccountDetailsClick = (user) => {
    setAccountDetails(user);
    setShowDetailsPopup(true);
  };

  const handleTransactionsClick = (user) => {
    setAccountTransactions(user);
    setShowtransactionPopup(true);
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleAddMoneySubmit = async (e) => {
    e.preventDefault();
    if (!amountToAdd || !about) {
      alert("Both amount and about fields are required.");
      return;
    }
    try {
      const user = await app.logIn(Credentials.anonymous());
      const mongodb = user.mongoClient("mongodb-atlas");
      const collection = mongodb.db("cashtracker").collection("userdata");

      const newAmount = parseFloat(amountToAdd);
      const updatedTotalMoney = moneyDetails.totalmoney + newAmount;
      const updatedAccBalance = moneyDetails.accbalance + newAmount;

      await collection.updateOne(
        { _id: moneyDetails._id },
        {
          $set: {
            totalmoney: updatedTotalMoney,
            accbalance: updatedAccBalance,
          },
          $push: {
            transactions: {
              amount: newAmount,
              nature: "credit",
              about: about,
              date: new Date(),
              balance: updatedAccBalance,
            },
          },
        }
      );

      const results = await collection.find({});
      setData(results);
      setShowmoneyPopup(false);
      setmoneyDetails(null);
      setAmountToAdd("");
      setAbout("");
      alert("Money added successfully!");
    } catch (error) {
      console.error("Error adding money:", error);
    }
  };

  const handleViewImageClick = (image) => {
    setCurrentImage(image);
    setShowImage(true);
  };

  const handleCloseImage = () => {
    setShowImage(false);
    setCurrentImage("");
  };

  const handleVerifyTransaction = async (transaction) => {
    try {
      const user = await app.logIn(Credentials.anonymous());
      const mongodb = user.mongoClient("mongodb-atlas");
      const collection = mongodb.db("cashtracker").collection("userdata");

      await collection.updateOne(
        { _id: accounttransactions._id, "transactions.date": transaction.date },
        { $set: { "transactions.$.verified": "yes" } }
      );

      // Update the state in place
      setAccountTransactions((prev) => {
        const updatedTransactions = prev.transactions.map((t) =>
          t.date === transaction.date ? { ...t, verified: "yes" } : t
        );
        return { ...prev, transactions: updatedTransactions };
      });

      const results = await collection.find({});
      setData(results);
    } catch (error) {
      console.error("Error verifying transaction:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12 text-end">
            <Link to="/new-account">
              <button className="btn btn-primary btn-lg">
                <i className="fa-solid fa-plus"></i> Add New Account
              </button>
            </Link>
          </div>
        </div>
        <div className="row pb-5 mb-5">
          <div className="col-md-12">
            {data.length > 0 ? (
              data.map((item) => (
                <div key={item._id} className="user-data-item">
                  <div
                    className="card shadow-sm mt-3"
                    data-aos="fade-up"
                    data-aos-delay="300"
                    data-aos-once="true"
                  >
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4 text-center">
                          <h3 className="card-title">{item.name}</h3>
                          <p className="card-text">
                            User ID:{" "}
                            <b style={{ fontSize: "18px" }}>{item.username}</b>
                          </p>
                          <p>{item.personposition}</p>
                        </div>
                        <div className="col-md-4 text-center">
                          <h4 className="card-title">Total Money Received</h4>
                          <p style={{ fontSize: "17px", fontWeight: "bold" }}>
                            ₹{" "}
                            <span style={{ fontSize: "22px", color: "green" }}>
                              {item.totalmoney}
                            </span>
                          </p>
                          <h4 className="card-title">
                            Current Account Balance
                          </h4>
                          <p style={{ fontSize: "17px", fontWeight: "bold" }}>
                            ₹{" "}
                            <span style={{ fontSize: "22px", color: "green" }}>
                              {item.accbalance}
                            </span>
                          </p>
                        </div>
                        <div className="col-md-2 d-flex flex-column align-items-center justify-content-center mt-2">
                          <button
                            className="btn btn-outline-success w-100"
                            onClick={() => handleAddMoneyClick(item)}
                          >
                            <i className="fa-solid fa-money-bill"></i> Add Money
                          </button>
                          <button
                            className="btn btn-outline-primary w-100 mt-2"
                            onClick={() => handleTransactionsClick(item)}
                          >
                            <i className="fa-solid fa-comments-dollar"></i>{" "}
                            Transactions
                          </button>
                          <button
                            className="btn btn-outline-primary w-100 mt-2"
                            onClick={() => handleAccountDetailsClick(item)}
                          >
                            <i className="fa-solid fa-gear"></i> Account
                            Settings
                          </button>
                        </div>
                        <div className="col-md-2 d-flex flex-column align-items-center justify-content-center mt-2">
                          <button
                            className="btn btn-danger w-100"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <i className="fa-solid fa-trash"></i> Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center mt-5" style={{ fontSize: "18px" }}>
                <span className="text-danger" style={{ fontWeight: "bold" }}>
                  404! No Account Available.
                </span>{" "}
                <br />{" "}
                <Link to="/new-account" style={{ textDecoration: "none" }}>
                  Create One{" "}
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
      {showPopup && (
        <>
          <div
            className="backdrop"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-once="true"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleCancel}
          ></div>
          <div
            className="modal fade show"
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-once="true"
            style={{ display: "block", zIndex: 1000 }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button
                    type="button"
                    className="btn close"
                    onClick={handleCancel}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body text-center">
                  <p>
                    Are you sure you want to delete this account? <br />
                    <strong>{userToDelete?.name}</strong> <br /> (User ID:{" "}
                    <strong>{userToDelete?.username}</strong>)
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteConfirm}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Money details Popup */}
      {ShowmoneyPopup && (
        <>
          <div
            className="backdrop"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-once="true"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleCancel}
          ></div>
          <div
            className="modal fade show"
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-once="true"
            style={{ display: "block", zIndex: 1000 }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5
                    className="modal-title"
                    data-aos="fade-up"
                    data-aos-delay="450"
                    data-aos-once="true"
                  >
                    Add Money
                  </h5>
                  <button
                    type="button"
                    className="btn close"
                    onClick={handleCancel}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div
                    className="row"
                    data-aos="fade-up"
                    data-aos-delay="500"
                    data-aos-once="true"
                  >
                    <div className="col-md-6">
                      <p>
                        Username: <strong>{moneyDetails?.username}</strong>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        Name: <strong>{moneyDetails?.name}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <form
                      className="form-inline text-center"
                      onSubmit={handleAddMoneySubmit}
                    >
                      <div
                        className="form-group mx-sm-3 mb-2"
                        data-aos="fade-up"
                        data-aos-delay="550"
                        data-aos-once="true"
                      >
                        <label>
                          <b>
                            Amount(INR)
                            <span className="text-danger">*</span>
                          </b>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="inputAmount"
                          placeholder="Enter Amount to Add"
                          value={amountToAdd}
                          onChange={(e) => setAmountToAdd(e.target.value)}
                        />
                      </div>
                      <div
                        className="form-group mx-sm-3 mb-2"
                        data-aos="fade-up"
                        data-aos-delay="600"
                        data-aos-once="true"
                      >
                        <label className="mt-2">
                          <b>
                            About Transaction
                            <span className="text-danger">*</span>
                          </b>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputAbout"
                          placeholder="Enter About"
                          value={about}
                          onChange={(e) => setAbout(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary mb-2 mt-2"
                        data-aos="fade-up"
                        data-aos-delay="600"
                        data-aos-once="true"
                      >
                        <i className="fa-solid fa-indian-rupee-sign"></i> Add
                        Money
                      </button>
                    </form>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleCancel}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Account Details Popup */}
      {showDetailsPopup && (
        <>
          <div
            className="backdrop"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-once="true"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleCancel}
          ></div>

          <div
            className="modal fade show"
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-once="true"
            style={{ display: "block", zIndex: 1000 }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">Account Details</h5>
                  <button
                    type="button"
                    className="btn close"
                    onClick={handleCancel}
                  >
                    <span className="text-white" style={{ fontSize: "20px" }}>
                      &times;
                    </span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <span className="text-primary">Name: </span>
                      <span style={{ fontSize: "20px" }}>
                        {accountDetails?.name}
                      </span>
                    </div>
                    <div className="col-md-6">
                      <span className="text-primary">Username: </span>
                      <span style={{ fontSize: "20px" }}>
                        {accountDetails?.username}
                      </span>
                    </div>
                    {/* <div className="col-md-12 mt-2">
                  <span className="text-primary">Password: </span>
                  <span style={{ fontSize: "20px" }}>
                    {accountDetails?.password}
                  </span>
                </div> */}
                    <div className="col-md-12 mt-2">
                      <span className="text-primary">Password: </span>
                      <span style={{ fontSize: "20px" }}>
                        {showPassword ? accountDetails?.password : "*****"}{" "}
                        {/* Show password or masked */}
                      </span>
                      <span
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                      >
                        {showPassword ? (
                          <i className="fa-solid fa-eye-slash"></i> // Eye Slash Icon
                        ) : (
                          <i className="fa-solid fa-eye"></i> // Eye Icon
                        )}
                      </span>
                    </div>
                    <div className="col-md-12 mt-2">
                      <span className="text-primary">About Person: </span>
                      <span style={{ fontSize: "20px" }}>
                        {accountDetails?.personposition}
                      </span>
                    </div>
                    <div className="col-md-12 mt-2">
                      <span className="text-primary">Created At: </span>
                      <span style={{ fontSize: "20px" }}>
                        {accountDetails?.createdAt
                          ? accountDetails.createdAt.toString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleCancel}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Transaction Popup */}
      {showTransactionPopup && (
        <>
          <div
            className="backdrop mb-5 pb-5"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-once="true"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleCancel}
          ></div>
          <div
            className="modal fade show"
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-once="true"
            style={{ display: "block", zIndex: 1000 }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Transaction Details</h5>
                  <button
                    type="button"
                    className="btn close"
                    onClick={handleCancel}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {accounttransactions?.transactions?.length > 0 ? (
                    <ul
                      className="list-group"
                      data-aos="fade-up"
                      data-aos-delay="500"
                      data-aos-once="true"
                    >
                      {accounttransactions.transactions
                        .slice()
                        .reverse()
                        .map((transaction, index) => (
                          <li
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <span>{transaction.about}</span>
                              <br />
                              <small style={{ color: "grey" }}>
                                Available balance: ₹{transaction.balance}
                              </small>
                              <br />
                              <span style={{ color: "brown" }}>
                                {new Date(transaction.date).toLocaleString()}
                              </span>
                              <br />
                              {transaction.image ? (
                                <span className="text-success">
                                  <i className="fa-solid fa-link"></i>{" "}
                                  <span>Image Attached</span>{" "}
                                  <span
                                    style={{
                                      textDecoration: "underline",
                                      fontWeight: "bold",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleViewImageClick(transaction.image)
                                    }
                                  >
                                    (View Image)
                                  </span>
                                </span>
                              ) : (
                                <span style={{ color: "red" }}>
                                  <i className="fa-solid fa-link-slash"></i> No
                                  Image Attachment
                                </span>
                              )}
                              {transaction.verified === "no" && (
                                <div
                                  className="alert alert-danger mt-2"
                                  style={{ padding: "5px 10px", width: "100%" }}
                                >
                                  <i className="fa-solid fa-xmark"></i> Not
                                  Verified
                                  <button
                                    className="btn btn-sm btn-success"
                                    style={{ marginLeft: "10px" }}
                                    onClick={() =>
                                      handleVerifyTransaction(transaction)
                                    }
                                  >
                                    <i className="fa-solid fa-circle-check"></i>{" "}
                                    Verify
                                  </button>
                                </div>
                              )}
                              {transaction.verified === "yes" && (
                                <div
                                  className="alert alert-success mt-2"
                                  style={{ padding: "5px 10px", width: "90%" }}
                                >
                                  <i className="fa-solid fa-check"></i> Verified
                                </div>
                              )}
                            </div>
                            <span
                              style={{
                                color:
                                  transaction.nature === "credit"
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {transaction.nature === "credit" ? "+" : "-"}₹
                              {transaction.amount}
                            </span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-center">No transactions available.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-lg btn-danger mb-5"
                    onClick={handleCancel}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Modal for viewing image */}
      {showImage && (
        <div
          className="modal fade show"
          data-aos="fade-up"
          data-aos-delay="300"
          data-aos-once="true"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            data
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Image</h5>
                <button
                  type="button"
                  className="btn close"
                  onClick={handleCloseImage}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={currentImage}
                  alt="Transaction Image"
                  style={{ maxWidth: "100%", maxHeight: "80vh" }}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseImage}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
