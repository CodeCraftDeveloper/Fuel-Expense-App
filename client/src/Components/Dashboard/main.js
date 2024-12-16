import React, { useState } from "react";
import * as Realm from "realm-web";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const app = new Realm.App({ id: "application-0-cocosmt" });
    const credentials = Realm.Credentials.anonymous();

    try {
      const user = await app.logIn(credentials);
      const mongo = user.mongoClient("mongodb-atlas");
      const collection = mongo.db("cashtracker").collection("userdata");

      const userData = await collection.findOne(
        { username: username, password: password },
        {
          projection: {
            _id: 0,
            name: 1,
            username: 1,
            password: 1,
            personposition: 1,
            totalmoney: 1,
            accbalance: 1,
            transactions: 1,
            createdAt: 1,
          },
        }
      );

      if (userData) {
        console.log("User data:", userData);
        setUserData(userData);
        setError(null); // Clear error if user data is found
      } else {
        setError("Invalid username or password. Try Again or Contact Admin");
        setUserData(null); // Clear user data if there is an error
      }
    } catch (err) {
      console.error("Failed to login", err);
      alert("Login failed. Please try again.");
      setUserData(null); // Clear user data if there is an error
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (parseFloat(amount) <= 0) {
      alert("Invalid Spend Amount.");
      setLoading(false);
      return;
    }

    if (userData.accbalance < amount) {
      alert("Insufficient balance for this transaction.");
      setLoading(false);
      return;
    }

    const newTransaction = {
      amount: parseFloat(amount),
      nature: "debit",
      about,
      date: new Date().toISOString(),
      balance: userData.accbalance - parseFloat(amount),
      verified: "no", // Add this line
    };

    if (image) {
      newTransaction.image = image;
    }

    try {
      const app = new Realm.App({ id: "application-0-cocosmt" });
      const credentials = Realm.Credentials.anonymous();
      const user = await app.logIn(credentials);
      const mongo = user.mongoClient("mongodb-atlas");
      const collection = mongo.db("cashtracker").collection("userdata");

      await collection.updateOne(
        { username: userData.username },
        {
          $push: { transactions: newTransaction },
          $inc: { accbalance: -parseFloat(amount) },
        }
      );

      setUserData((prevData) => ({
        ...prevData,
        transactions: [...prevData.transactions, newTransaction],
        accbalance: prevData.accbalance - parseFloat(amount),
      }));

      alert("Transaction successful!");
      setAmount("");
      setAbout("");
      setImage("");
    } catch (err) {
      console.error("Failed to add transaction", err);
      setError("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
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

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center mt-2 pt-5">
      {/* <h2 className="mb-4">Login</h2> */}
      <form onSubmit={handleLogin}>
        <div className="d-flex flex-row mb-3">
          <div
            className="me-2 flex-grow-1"
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-once="true"
          >
            <label htmlFor="username" className="form-label">
              <b>Username</b>
              <span className="text-danger"> *</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div
            className="flex-grow-1 position-relative"
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-once="true"
          >
            <label htmlFor="password" className="form-label">
              <b>Password</b>
              <span className="text-danger"> *</span>
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>
        <div
          className="mb-3"
          data-aos="fade-up"
          data-aos-delay="500"
          data-aos-once="true"
        >
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              "Search User"
            )}
          </button>
        </div>
      </form>
      {error && (
        <h4
          className="text-danger text-center mt-5"
          data-aos="fade-up"
          data-aos-delay="500"
          data-aos-once="true"
        >
          {error}
        </h4>
      )}
      {userData && (
        <div className="mt-4 mb-2 w-100">
          {/* <h3 className="text-center">Details</h3> */}
          <div className="container-fluid">
            <div className="row text-center">
              <div
                className="col-md-6"
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-once="true"
              >
                <span style={{ fontSize: "25px", fontWeight: "bold" }}>
                  Account Balance:{" "}
                </span>
                <span
                  className="text-success"
                  style={{ fontSize: "30px", fontWeight: "bold" }}
                >
                  ₹{userData.accbalance}
                </span>
              </div>
              <div
                className="col-md-6"
                data-aos="fade-up"
                data-aos-delay="450"
                data-aos-once="true"
              >
                <span style={{ fontSize: "25px", fontWeight: "bold" }}>
                  Account Name:{" "}
                </span>
                <span
                  className="text-success"
                  style={{ fontSize: "30px", fontWeight: "bold" }}
                >
                  {userData.name}
                </span>
              </div>
            </div>
            <div className="row">
              <div
                className="col-md-6 mt-5"
                data-aos="fade-up"
                data-aos-delay="500"
                data-aos-once="true"
              >
                <div className="row">
                  <h4 className="text-center">New Spend</h4>
                  <form onSubmit={handleTransactionSubmit}>
                    <div className="mb-3">
                      <label htmlFor="amount" className="form-label">
                        <b>
                          Amount<span className="text-danger">*</span>
                        </b>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="about" className="form-label">
                        <b>
                          Remarks<span className="text-danger">*</span>
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="about"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">
                        <b>Image</b>
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="image"
                        accept="image/*"
                        onChange={(e) => {
                          const reader = new FileReader();
                          reader.onload = () => setImage(reader.result);
                          reader.readAsDataURL(e.target.files[0]);
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        "₹ Add Spend"
                      )}
                    </button>
                  </form>
                </div>
              </div>
              <div
                className="col-md-6 mt-5"
                data-aos="fade-up"
                data-aos-delay="600"
                data-aos-once="true"
              >
                <h4 className="text-center mb-4">Account History</h4>
                {userData.transactions.length > 0 ? (
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <ul className="list-group">
                      {userData.transactions
                        .slice()
                        .reverse()
                        .map((transaction, index) => (
                          <li
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <div>
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
                                    <i className="fa-solid fa-link-slash"></i>{" "}
                                    No Image Attachment
                                  </span>
                                )}
                                <br />
                                <div className="row mt-2"></div>
                                {transaction.nature !== "credit" &&
                                  (transaction.verified === "yes" ? (
                                    <div
                                      className="alert alert-success p-1"
                                      role="alert"
                                    >
                                      <i className="fa-solid fa-check"></i>{" "}
                                      Verified By Admin
                                    </div>
                                  ) : (
                                    <div
                                      className="alert alert-danger p-1"
                                      role="alert"
                                    >
                                      <i className="fa-solid fa-xmark"></i> Not
                                      Verified Yet
                                    </div>
                                  ))}
                              </div>
                            </div>
                            <span
                              style={{
                                color:
                                  transaction.nature === "credit"
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {transaction.nature === "credit" ? "+ " : "- "}₹
                              {transaction.amount}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-center">No transactions available.</p>
                )}
              </div>
              <div className="col-md-12 mt-5"></div>
            </div>
          </div>
        </div>
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
            data-aos="fade-up"
            data-aos-delay="500"
            data-aos-once="true"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Transaction Image</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseImage}
                ></button>
              </div>
              <div className="modal-body p-0">
                <img
                  src={currentImage}
                  alt="Transaction"
                  style={{ width: "100%", height: "100%" }}
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
    </div>
  );
};

export default LoginPage;
