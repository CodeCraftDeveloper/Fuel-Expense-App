import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import NewAccount from "./components/NewAccount/main";
import Footer from "./components/Footer/main";
// import AddData from "./components/AddDetail/main";
// import EditData from "./components/EditDetail/main";
import ProtectedRoute from "./ProtectedRoute";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { Helmet } from "react-helmet";

import TopLoader from "nextjs-toploader";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Helmet>
        <title>Admin - Cash Tracker</title>
        <meta name="description" content="Prem Industries Cash Tracker" />
      </Helmet>
      <TopLoader color="#E92227" showSpinner={false} height={4} />
      <Routes>
        {/* Public route for login */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected route for dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-account"
          element={
            <ProtectedRoute>
              <NewAccount />
            </ProtectedRoute>
          }
        />

        {/* Redirect to login if route not found */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
